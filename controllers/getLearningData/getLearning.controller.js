const { Learning } = require("../../models/learning.model");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.getDatabase = async function (request, response, next) {
  const { title, subject } = request.query;

  if (!title || !subject)
    throw new Error("Title or subject is not correct");

  try {
    const listTitles = await getUrls(title); // => href

    let result = new Array();
    for (let i = 0; i < listTitles.length; ++i) {
      const linkTitle = listTitles[i]
      const questions = await getData(linkTitle);
      await updateDatabase(subject, linkTitle, questions)
        .then(res => {
          result.push({linkTitle, status: "OK"});
        })
        .catch(err => {
          result.push({linkTitle, status: "FAIL", messageError: err.message});
        })
    }

    response.json(result);
  } catch (error) {
    throw new Error(error);
  }
}

async function getUrls(title) {
  const dom = await JSDOM.fromURL(
    title, {
      includeNodeLocations: true
    }
  )

  const {document} = dom.window;

  const listTitlesArea = Array.from(document.querySelectorAll("h3.sub-title + ul.list"));

  const listTitles = listTitlesArea.reduce((accumulator, linkArea) => {
    const linksArea = Array.from(linkArea.querySelectorAll("a"));
    const linksAreaCorrect = linksArea.filter(linkArea => !linkArea.target.includes("_blank"));

    const links = linksAreaCorrect.map(linkArea => linkArea.href);

    return [...accumulator, ...links];
  }, new Array());

  return listTitles;
}

async function getData(url) {
  const dom = await JSDOM.fromURL(url, {
      includeNodeLocations: true
    }
  )

  const {document} = dom.window;

  parent = document.querySelector(".content div")

  const questionListArea = Array.from(parent.querySelectorAll("h2 ~ p"));

  const trueAnswerListArea = Array.from(parent.querySelectorAll("h2 ~ p ~ section"));

  const trueAnswerList = trueAnswerListArea.map(item => {
    trueAnswerArea = item.querySelector(".toggle-content");
    return trueAnswerArea.textContent;
  });

  const data = questionListArea.reduce((accumulator, item) => {
    questionArea = item.querySelector("b.color-green");
    if (!questionArea) {
        question = accumulator.slice(-1)[0];
        answerText = item.textContent.trim().replace(/\s\s\s\s*/g, " | ");
        question.answers += answerText + " | ";
    } else {
        questionIndex = accumulator.length;

        newQuestion = new Object();
        newQuestion.title = questionArea.textContent;
        newQuestion.answers = new String();
        newQuestion.trueAnswer = trueAnswerList[questionIndex];
        accumulator.push(newQuestion);
    }
    return accumulator;
  }, new Array());

  return data;
}

async function updateDatabase(subject, title, questions) {
  const newLearning = new Learning({subject, title, questions});
  return newLearning.save();
}