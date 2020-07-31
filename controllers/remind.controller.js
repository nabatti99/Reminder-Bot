const { User } = require("../models/user.model");

module.exports = async function(req, res, next) {
  const { messages, status } = res.locals;

  if (!status) {
    res.json({messages});
    return;
  }

  const { user } = req.query;

  const currentUser = await User
    .findOne({user});

  const now = convertUTCDateToLocalDate(new Date(Date.now()));
  const day = now.getUTCDay();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();

  console.log(day, hours, minutes);

  const newMessages = new Array;
  //today
  const today = getToday(day);
  const subjectsRemaining = currentUser.subjects.filter((subject) => {
    if (subject.day == today && subject.hours > hours)
      return true;
    if (subject.day == today && subject.hours == hours && subject.minutes > minutes)
      return true;
    return false;
  });

  if (subjectsRemaining.length){
    newMessages.push({text: "Hôm ni mi còn phải đi học nữa, chuẩn bị đi cả trễ:"});
    subjectsRemaining.forEach((subject) => {
      newMessages.push({text: `${subject.name} vào lúc ${subject.hours}:${subject.minutes}`});
    });
    newMessages.push({text: "Nhắc luôn ngày mai :v"});
  }

  //next day
  const nextDay = getNextDay(day);
  const subjectsFiltered = currentUser.subjects.filter((subject) => {
    return subject.day == nextDay;
  });

  // filter subject
  if (!subjectsFiltered.length)
    newMessages.push({text: `Ngày mai là ${nextDay}, mi không học chi hết, rảnh nè :3`});
  else {
    if (subjectsFiltered > 4)
      newMessages.push({text: `Ngày mai là ${nextDay}, học nhiều lắm mi`});
    else
      newMessages.push({text: `Ngày mai là ${nextDay}, mi sẽ học những môn ni =))`});

    subjectsFiltered.forEach((subject) => {
      newMessages.push({text: `${subject.name} vào lúc ${subject.hours}:${subject.minutes}`});
    });
  }

  if (hours > 22) {
    newMessages.push({text: "Khuya rồi, đi ngủ thôi, thức khuya không tốt mô :3"});
  }

  res.json({messages: newMessages});
}

function getNextDay(day) {
  const nextDay = day == 6 ? 0 : day + 1;
  return getToday(nextDay)
}

function getToday(day) {
  const dayArr = ["chủ nhật", "thứ 2", "thứ 3", "thứ 4", "thứ 5", "thứ 6", "thứ 7"];
  return dayArr[day];
}

function convertUTCDateToLocalDate(date) {
  const newDate = new Date(date.getTime() + 420*60*1000);

  return newDate;   
}