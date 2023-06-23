const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req,res)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt) res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser){
        res.clearCookie('jwt',{ httpOnly: true});
        res.sendStatus(204);
    }
    const otherUser = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUser,currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt', {httpOnly: true});
    res.sendStatus(204);
}

module.exports = {handleLogout}