export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(401).
  jason(new apiResponse(401, null, "Not authorized as an admin"));

}