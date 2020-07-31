const { User } = require("../models/user.model");

module.exports.login = function (req, res, next) {
  const { messages } = res.locals

  res.json({messages});
}

// Middlewares
module.exports.auth = async function (req, res, next) {
  const { user } = req.query;

  const currentUser = await User
    .findOne({user})

  if (!currentUser) {
    res.locals.messages = [{
      text: `T không quen ${user} nơi. Đăng nhập lại thử coi.`
    }];

    res.locals.status = false;

    next();
    return;
  }

  res.locals.messages = [{
    text: `Thì ra là ${user}, mi khoẻ không? Hihi :3` 
  }];

  res.locals.status = true;

  next();
}