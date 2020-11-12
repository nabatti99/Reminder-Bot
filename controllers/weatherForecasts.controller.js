const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.get = async function (request, response, next) {
  const dom = await JSDOM.fromURL(
    "https://thoitietvietnam.gov.vn/Kttv/vi-VN/1/thoi-tiet-nguy-hiem-5-15.html",
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

  await newFeeds.forEach((newFeed, index) => {
    const link = newFeeds[index].firstChild.getAttribute("href");
    const text = newFeeds[index].textContent;

    const imgUrl = newFeedImgs[index].firstChild.getAttribute("src");

    messages.push({
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
                weatherForecastUrl: link,
              },
              block_names: ["WeatherForecastsDetail"],
            },
            {
              title: "Xem ở Web",
              type: "web_url",
              url: link,
            },
          ],
        },
      },
    });
  });

  response.json({ messages });
};

module.exports.getDetail = async function (request, response, next) {
  const { weatherForecastUrl } = request.query;
  if (!weatherForecastUrl) {
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

  const textArea = document.querySelector(".text-content-news span>span");
  const textContent = textArea.textContent;

  const textLimited1 = textContent.substring(0, 2000).split("\n");
  const textLost = textLimited1.pop();
  const textLimited1After = textLimited1.join("\n\n");

  const textLimited2 = textContent.substring(2000).split("\n").join("\n\n");
  const textLimited2After = textLost.concat(textLimited2);

  response.json({
    messages: [
      imgMessage,
      { text: textLimited1After },
      { text: textLimited2After },
    ],
  });
};
