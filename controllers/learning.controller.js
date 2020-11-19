const { Learning } = require("../models/learning.model");
const { randomInList } = require("../services/utilities");

module.exports.getTitle = async function (request, response, next) {
  const { queryTitleString, subject } = request.query;

  if (!queryTitleString || !subject)
    next(new Error("mi thiếu chuỗi tìm kiếm hoặc môn học rồi!"));

  const queryString = queryTitleString.trim().toLowerCase().replace(/\s+/g, "-");

  const learning = (await Learning.aggregate()
    .match({
      title: { $regex: new RegExp(queryString, "g") }
    })
    .project({
      title: 1,
      questions: 1
    })
    .sample(1))[0];

  const { title, questions } = learning;

  const question = randomInList(questions);

  const newMessages = new Array();
  newMessages.push({text: `Mi đang làm bài trong các câu hỏi được lấy tại trang: ${title}`});
  newMessages.push({text: question.title});
  newMessages.push({text: question.answers});

  response.json({
    messages: newMessages,
    set_attributes: {
      learningAnswer: question.trueAnswer,
      learningTitle: title,
      learningSubject: subject
    }
  });
}

module.exports.getMoreQuestion = async function(request, response, next) {
  const { title, subject } = request.query;

  if (!title || !subject)
    next(new Error("Không tìm thấy câu hỏi"));

  const learning = (await Learning.aggregate()
    .match({ title, subject })
    .project({
      title: 1,
      questions: 1
    })
    .sample(1))[0];

  const question = randomInList(learning.questions);

  const newMessages = new Array();
  newMessages.push({text: question.title});
  newMessages.push({text: question.answers});

  response.json({
    messages: newMessages,
    set_attributes: {
      learningAnswer: question.trueAnswer
    }
  });
}