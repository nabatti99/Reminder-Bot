const { Test } = require("../models/test.model");

module.exports.get = async function (req, res, next) {
  const { data } = await Test.findOne();

  res.json(data);
};

module.exports.create = async function (req, res, next) {
  const data = {
    messages: [
      {
        text: "New Data!",
      },
    ],
  };

  const newData = await new Test({ data });
  newData.save();

  res.json({
    messages: [
      {
        text: "Create successfully!",
      },
    ],
  });
};
