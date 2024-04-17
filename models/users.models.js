const db = require( "../db/connection")

function fetchAllUsers(){
    return db.query(`SELECT * FROM users`)
    .then(({rows})=> {
        return rows
    })
}

function fetchUserByUsername(username){
    let sqlString = `SELECT * FROM users WHERE username=$1;`
    return db.query(sqlString,[username])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status:404, msg: "User not found"})
        }
        return rows[0]
    })
}

module.exports = { fetchAllUsers, fetchUserByUsername }