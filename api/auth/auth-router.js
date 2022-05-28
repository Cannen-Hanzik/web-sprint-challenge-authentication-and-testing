const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();
const { BCRYPT_ROUNDS, JWT_SECRET } = require("../secrets");
const Users = require('./user-model.js');

const restricted = require('../middleware/restricted.js')
const checkRegister = require('../middleware/checkRegister.js')
const checkUniqueUsername = require('../middleware/checkUniqueUsername.js')
const checkUsernameExists = require('../middleware/checkUsernameExists.js')

router.post('/register', checkRegister, checkUniqueUsername, (req, res, next) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)
  user.password = hash
  console.log(`user ${user.username}, hash ${user.password}`)

  Users.add(user)
    .then(newUser => {
      // console.log('inside add', newUser)
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.post('/login', checkUsernameExists, (req, res, next) => {
  let { username, password } = req.body
  Users.findBy({ username })
    .then(([user]) => {
      if(user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          message: `welcome ${username}`,
          token: generateToken(user)
        })
      } else {
        next({ status: 401, message: 'Invalid credentials' })
      }
    })
    .catch(next)
});

function generateToken(user){
  const payload = {
    subject: user.user_id,
    username: user.username,
  };
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;