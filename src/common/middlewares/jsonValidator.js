const jsonValidator = (req, res, next) => {
  if (!req.is("application/json")) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Invalid JSON format",
    });
  }
  next();
};

export default jsonValidator;
