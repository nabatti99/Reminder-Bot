const { User } = require("../models/user.model");

module.exports.show = async function (req, res, next) {
  const { messages, status } = res.locals;

  if (!status) {
    res.json({messages});
    return;
  }

  const { user } = req.query;

  const currentUser = await User
    .findOne({user});

  const listSubject = new Array;
  currentUser.subjects.forEach((subject) => {
    listSubject.push(`${subject.name} (${subject.day} ${subject.hours}:${subject.minutes})`);
  });

  res.json({
    messages: [
      {text:`Danh sách các môn của mi đây: ${listSubject.join(", ")}.`}
    ]
  });
}

module.exports.exec = async function (req, res, next) {
  const { messages, status } = res.locals;

  if (!status) {
    res.json({messages});
    return;
  }

  const { user, indexesString, isCorrect } = req.query;

  const currentUser = await User
    .findOne({user});

  const isCorrectParsed = Number(isCorrect);

  if (!isCorrectParsed) {
    const listSubject = new Array;
    currentUser.subjects.forEach((subject) => {
      listSubject.push(`${subject.name} (${subject.day}, ${subject.hours}:${subject.minutes})`);
    });

    res.json({
      messages: [
        {text: `T chưa làm chi hết mô, kiểm tra lại cho chắc nè :3`},
        {text: `Danh sách các môn của mi đây: ${listSubject.join(", ")}. Đúng chưa?`}
      ]
    });

    return;
  }

  try{
    let indexes = indexesString + ","; // Add ","

    indexes = indexes
      .trim()
      .split(",");
    indexes.pop();                     // Remove ","
    indexes.forEach((index, i) => {
      indexes[i] = Number(index.trim());
      if (indexes[i] >= currentUser.subjects.length) {
        throw new Error("Chỉ số sai rồi nè, t không xoá được, sr nghe");
      }
    });

    const messageLog = new Array

    indexes.forEach((index) => {
      messageLog.push(`${currentUser.subjects[index].name} (${currentUser.subjects[index].day}, ${currentUser.subjects[index].hours}:${currentUser.subjects[index].minutes})`);
    })

    for(let i = indexes.length - 1; i >= 0; --i) {
      currentUser.subjects = [...currentUser.subjects.slice(0, indexes[i]), ...currentUser.subjects.slice(indexes[i] + 1, currentUser.subjects.length)];
    }

    currentUser.save();

    // get remain subjects
    const listSubject = new Array;
    currentUser.subjects.forEach((subject) => {
      listSubject.push(`${subject.name} (${subject.day}, ${subject.hours}:${subject.minutes})`);
    });

    res.json({
      messages: [
        {text: `T đã xoá môn ${messageLog.join(", ")} ra khỏi danh sách nhắc nhở rồi, hi vọng những chi mi mới làm là đúng.`},
        {text: `Danh sách các môn còn lại của mi đây: ${listSubject.join(", ")}. Đúng chưa?`}
      ]
    });
  } catch(error) {
    res.json({
      messages: [
        {text: `Lỗi rồi: ${error.message}`}
      ]
    })
  }
}

module.exports.all = async function (req, res, next) {
  const { messages, status } = res.locals;

  if (!status) {
    res.json({messages});
    return;
  }

  const { user } = req.query;

  const currentUser = await User
    .findOne({user});

  currentUser.subjects = new Array;
  currentUser.save();

  res.json({
    messages: [
      {text: "T đã xoá toàn bộ danh sách mà mi đã cung cấp cho t, hi vọng những chi mi mới làm là đúng."}
    ]
  });
}