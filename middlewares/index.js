const fs = require("fs");

function logRequestResponse(fileName) {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `\n${req.method}: ${req.path}: ${req.ip}: ${Date.now()}:`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = {
  logRequestResponse,
};
