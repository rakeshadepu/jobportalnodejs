import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and contains 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Authentication failed or header not found"));
  }

  // Extract the token
  const token = authHeader.split(" ")[1]; // Split on space to get the token
  try {
    // Verify the token
    const payload = JWT.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object
    req.user = { userId: payload.userId };

    // Proceed to the next middleware
    next();
  } catch (error) {
    return next(new Error("Authentication failed")); // Handle invalid token
  }
};

export default userAuth;
