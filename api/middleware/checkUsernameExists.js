const db = require('../auth/user-model');

module.exports = async (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        next({ status: 401, message: 'username and password required' })
    } else {
        try {
            const users = await db.findBy({ username: req.body.username })
            if (users.length) {
                req.user = users[0]
                next()
            } else {
                next({ message: 'Invalid credentials', status: 401 })
            }
        } catch(err) {
            next(err)
        }    
    }
  };