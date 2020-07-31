const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: {
    type: String,
    required: [true, "Chưa có tên đăng nhập!"]
  },
  subjects: {
    type: [{
      name: {
        type: String,
        required: [true, "Chưa có tên môn học!"]
      },
      day: {
        type: String,
        enum: ["thứ 2", "thứ 3", "thứ 4", "thứ 5", "thứ 6", "thứ 7", "chủ nhật"]
      },
      hours: {
        type: Number,
        min: [7, "Học chi sớm rứa, không được :v"],
        max: [20, "Học chi cái giờ ni, không được :v"]
      },
      minutes: {
        type: Number,
        min: [0],
        max: [59, "làm chi có phút ni mi?"]
      }
    }],
    default: new Array
  }
}, {
  timestamps: true
});

userSchema.post("save", function (doc) {
	console.log(`${doc.id} user has been save.`);
});

const User = mongoose.model("user", userSchema);

module.exports.User = User;