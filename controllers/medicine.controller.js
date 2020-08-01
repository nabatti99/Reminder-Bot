const { JSDOM } = require("jsdom");

const { splitIntoTwoString } = require("../services/utilities");

module.exports.get = async function (request, response, next) {
  const { searchValue } = request.query;

  if (!searchValue) {
    response.json({
      messages: [{ text: "Lỗi rồi: Không tìm thấy từ khoá!" }],
    });
  }

  const { window } = new JSDOM();
  const searchValueEncoded = window.encodeURI(searchValue);

  const dom = await JSDOM.fromURL(
    `https://hellobacsi.com/?s=${searchValueEncoded}`,
    {
      includeNodeLocations: true,
    }
  );

  const { document } = dom.window;

  const articles = Array.from(document.querySelectorAll("article"));

  const messages = articles.slice(0, 10).map((article, index) => {
    const text = article.textContent
      .replace(/\n\n/g, "\n")
      .substring(0, article.textContent.search(/\[…\]/));

    const link = article.querySelector("a").getAttribute("href");

    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text,
          buttons: [
            {
              title: "Xem ở đây...",
              type: "show_block",
              set_attributes: {
                medicineUrl: link,
              },
              block_names: ["WeatherForecastsDetail"],
            },
            {
              title: "Xem ở Web...",
              type: "web_url",
              url: link,
            },
          ],
        },
      },
    };
  });

  response.json({ messages });
};

module.exports.getDetail = async function (request, response, next) {
  const { medicineUrl } = request.query;
  if (!medicineUrl) {
    response.json({
      messages: [{ text: "Lỗi rồi: Không tìm thấy bài viết!" }],
    });
  }

  const dom = await JSDOM.fromURL(medicineUrl, {
    includeNodeLocations: true,
  });

  const { document } = dom.window;

  const contains = Array.from(
    document.querySelector(".entry-content-body").children
  ).filter((contain) => !contain.classList.contains("ads-wrapper"));

  const beginIndex = contains.findIndex((contain) => contain.tagName == "H2");
  const endIndex = contains.findIndex((contain) =>
    contain.classList.contains("end-of-article")
  );

  contains.forEach((contain, index) => {
    const noscriptElement = contain.querySelector("noscript");
    console.log(noscriptElement);
    if (!noscriptElement) return;

    noscriptElement.parentNode.removeChild(noscriptElement);
  });

  contains.splice(endIndex);
  contains.splice(0, beginIndex);

  const containsSplitIndex = contains.findIndex(
    (contain, index) => contain.tagName == "H2" && index != 0
  );

  const text1 = contains
    .slice(0, containsSplitIndex)
    .reduce((text, contain) => text.concat("\n", contain.textContent), "");
  const textMessage1 = splitIntoTwoString(text1);

  const text2 = contains
    .slice(containsSplitIndex)
    .reduce((text, contain) => text.concat("\n", contain.textContent), "");
  const textMessage2 = splitIntoTwoString(text2);

  response.json({
    messages: [
      { text: textMessage1.textOutput1 },
      { text: textMessage1.textOutput2 },
      { text: textMessage2.textOutput1 },
      { text: textMessage2.textOutput2 },
    ],
  });
};
