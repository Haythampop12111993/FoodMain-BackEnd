function resGenerator(res, statusCode, apiStatus, data, message) {
  return res.status(statusCode).send({
    apiStatus: apiStatus,
    data: data,
    message: message,
  });
}
module.exports = { resGenerator };
