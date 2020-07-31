const { User } = require("../models/user.model");

module.exports = async function (req, res, next) {
  const { user } = req.query;

  const anotherSameUser = await User
    .findOne({user});

  if(anotherSameUser) {
    res.json({
      messages: [{
        text: "Có người xài tên ni rồi, m xài tên khác tạm nghe :(("
      }]
    });

    return;
  }

  try {
    const newUser = new User({user});
    newUser.save();

    res.json({
      messages: [
        {text: `Okay, từ nay t gọi mi là ${user} nghe`},
        {text: `Chào ${user} cái nè :3`}
      ]
    });
  } catch(error) {
    res.json({
      messages: [{
        text: `Lỗi: ${error.message}`
      }]
    });
  }
}