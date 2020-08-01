const splitIntoTwoString = (textInput) => {
  const result = new Object();

  const textLimited1 = textInput.substring(0, 2000).split("\n");
  const textLost = textLimited1.pop();
  result.textOutput1 = textLimited1.join("\n");

  const textLimited2 = textInput.substring(2000);
  result.textOutput2 = textLost.concat(textLimited2);

  return result;
};

module.exports.splitIntoString = (textInput) => {
  const result = new Array();

  const { textOutput1, textOutput2 } = splitIntoTwoString(textInput);

  if (textOutput1.length >= 2000) {
    const result1 = this.splitIntoString(textOutput1);
    result.push(...result1);
  } else result.push(textOutput1);
  if (textOutput2.length >= 2000) {
    const result2 = this.splitIntoString(textOutput2);
    result.push(...result2);
  } else result.push(textOutput2);
  return result;
};
