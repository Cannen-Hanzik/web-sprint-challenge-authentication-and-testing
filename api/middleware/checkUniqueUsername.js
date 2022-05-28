const db = require('../auth/user-model');

module.exports = async (req, res, next) => {
    try {
        const users = await db.findBy({ username: req.body.username })
        if (!users.length) {
            next()
        } else {
            next({ message: 'username taken', status: 422 })
        }
    } catch(err) {
        next(err)
    } 
  };