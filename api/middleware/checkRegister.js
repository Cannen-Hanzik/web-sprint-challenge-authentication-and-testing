module.exports = (req, res, next) => {
    if(!req.body.username || !req.body.password){
        return next({ status: 422, message: 'username and password required'})
    }
    next();
  };