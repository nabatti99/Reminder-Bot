module.exports.splitIntoTwoString = (textInput) => {
  const result = new Object();

  const textLimited1 = textInput.substring(0, 2000).split("\n");
  const textLost = textLimited1.pop();
  result.textOutput1 = textLimited1.join("\n");

  const textLimited2 = textInput.substring(2000);
  result.textOutput2 = textLost.concat(textLimited2);

  return result;
};
