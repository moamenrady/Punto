exports.setCreatedBy = (req, res, next) => {
  if (!req.body.created_by && req.user) {
    req.body.created_by = req.user.id;
  }
  next();
};
