module.exports = {
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 9000,
    JWT_SECRET: 'My Very Secret Password'
  }