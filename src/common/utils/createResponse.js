const createResponse = (success, statusCode, message, data) => {
  return {
    success,
    statusCode,
    message,
    data: data || null,
  };
};
export default createResponse;
