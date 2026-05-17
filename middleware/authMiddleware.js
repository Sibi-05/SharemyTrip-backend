const jwt = require("jsonwebtoken");

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {

    let token =
      req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    if (
      token.startsWith("Bearer ")
    ) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded.id;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }
};

module.exports = authMiddleware;