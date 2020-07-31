const { User } = require("../models/user.model");

module.exports = async function (req, res, next) {
  const { messages, status } = res.locals;

  if(!status) {
    res.json({messages});
    return;
  }

  const { user, name, day, time } = req.query;

  const [hours, minutes] = time
    .split(":")
    .map((item) => item.trim());

  try{
    const currentUser = await User
      .findOne({user});

    const anotherSameSubject = currentUser.subjects.find((subject) => {
      return subject.name  == name && subject.day == day && subject.hours == hours && subject.minutes == minutes
    });

    if (anotherSameSubject)
      throw new Error("Mi đã nhờ t nhắc môn ni rồi mà, không nhớ à :v");

    let subject = null;

    subject = {
      name,
      day: day.toLowerCase(),
      hours,
      minutes
    }

    currentUser.subjects.push(subject);

    await currentUser.save();

    res.json({
      messages: [
        {text: "Ok, t sẽ nhắc nhở mi đàng hoàng"},
        {text: "Chỉ cần mi hỏi thôi :v"}
    ]
    });
  } catch(error) {
    const messages = new Array;

    if (error.errors)
      for (key in error.errors)
        messages.push({text: error.errors[key].message});
    else
      messages.push({text: error.message});

    res.json({messages});
  }
}