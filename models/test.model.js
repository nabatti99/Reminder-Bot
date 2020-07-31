const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  data: {
    type: Object,
  },
});

testSchema.post("save", function (doc) {
  console.log(`${doc.id} test has been save.`);
});

const Test = mongoose.model("test", testSchema);

module.exports.Test = Test;
