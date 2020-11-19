module.exports = function (error, request, response, next) {
  response.status(500).json({
    messages: [{
      text: `Huhu :(, ${error.message}`
    }]
  });
}