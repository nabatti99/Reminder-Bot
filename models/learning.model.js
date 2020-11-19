const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const learningSchema = new Schema({
  subject: {
    type: String,
    required: [true, "Chưa có tên môn học"]
  },
  title: {
    type: String,
    required: [true, "Chưa có tên tiêu đề"]
  },
  questions: {
    type: [
      {
        title: {
          type: String,
          required: [true, "Chưa có tên câu hỏi"]
        }, 
        answers: {
          type: String,
          required: [true, "Chưa có câu trả lời"]
        }, 
        trueAnswer: {
          type: String,
          required: [true, "Chưa có câu trả lời chính xác"]
        }
      },
    ]
  }
}, {
  timestamps: true
});

learningSchema.post("save", function (doc) {
  console.log(`${doc.id} Learning has been save.`);
});

const Learning = mongoose.model("learning", learningSchema);

module.exports.Learning = Learning;
