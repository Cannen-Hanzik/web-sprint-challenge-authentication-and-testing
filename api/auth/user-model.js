const db = require('../../data/dbConfig.js');

async function add(user) {
    const [id] = await db("users").insert(user)
    return findById(id)
}

function findById(id) {
    return db('users')
        .select('id','username','password')
        .where("users.id",id)
        .first()
}

const findBy = filter => {
    return db('users')
        .where(filter)
}

module.exports = {
    add,
    findById,
    findBy,
}