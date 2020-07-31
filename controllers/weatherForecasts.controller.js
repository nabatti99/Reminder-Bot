const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.get = async function (request, response, next) {
  const dom = await JSDOM.fromURL(
    "http://nchmf.gov.vn/Kttvsite/vi-VN/1/thoi-tiet-nguy-hiem-5-15.html",
    {
      includeNodeLocations: true,
    }
  );

  const { document } = dom.window;

  const newFeeds = Array.from(
    document.querySelectorAll(".text-weather-location.fix-weather-location")
  );
  const newFeedImgs = Array.from(
    document.querySelectorAll(".img-weather-location.fix-img-weather-location")
  );

  const messages = new Array();

  newFeeds.forEach((newFeed, index) => {
    const link = newFeeds[index].firstChild.getAttribute("href");
    const text = newFeeds[index].textContent;

    const imgUrl = newFeedImgs[index].firstChild.getAttribute("src");

    messages.push({ text });
    messages.push({
      attachment: {
        type: "template",
        payload: {
          template_type: "media",
          elements: [
            {
              media_type: "image",
              url: imgUrl,
              button: [
                {
                  title: "Xem ở đây...",
                  type: "show-block",
                  set_attributes: {
                    weatherForecastUrl: link,
                  },
                  block_names: ["WeatherForecastsDetail"],
                },
                {
                  title: "Xem ở Web...",
                  type: "web-url",
                  url: link,
                },
              ],
            },
          ],
        },
      },
    });
  });

  response.json({ messages: messages });
};

module.exports.getDetail = async function (request, response, next) {
  const { weatherForecastUrl } = request.query;
  if (weatherForecastUrl) {
    response.json({
      messages: [{ text: "Lỗi rồi: Không tìm thấy bài viết!" }],
    });
  }

  const dom = await JSDOM.fromURL(weatherForecastUrl, {
    includeNodeLocations: true,
  });

  const { document } = dom.window;

  const img = document.querySelector(".popupImage");
  const imgUrl = img.getAttribute("src");
  const imgMessage = {
    attachment: {
      type: "image",
      payload: {
        url: imgUrl,
      },
    },
  };

  const textArea = document.querySelector("p>span>span");
  const textContent = textArea.textContent;
  const textMessages = textContent.split("\n").map((text) => {
    return { text };
  });

  response.json({
    messages: [imgMessage, ...textMessages],
  });
};
