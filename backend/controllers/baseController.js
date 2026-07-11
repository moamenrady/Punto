exports.setCreatedBy = (req, res, next) => {
  if (req.user) {
    req.body.created_by = req.user.id;
  }
  next();
};
