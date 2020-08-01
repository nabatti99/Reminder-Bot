const { JSDOM } = require("jsdom");

const { splitIntoString } = require("../services/utilities");

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
              title: "Xem ở đây",
              type: "show_block",
              set_attributes: {
                medicineUrl: link,
              },
              block_names: ["MedicineDetail"],
            },
            {
              title: "Xem ở Web",
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
  const textMessages1 = splitIntoString(text1).map((text) => ({ text }));

  const text2 = contains
    .slice(containsSplitIndex)
    .reduce((text, contain) => text.concat("\n", contain.textContent), "");
  const textMessages2 = splitIntoString(text2).map((text) => ({ text }));

  response.json({
    messages: [...textMessages1, ...textMessages2],
  });
};
