const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req,res)=>{
    // lấy dữ liệu đã đc gửi đi trong request
    const { user, pwd} = req.body;
    if(!user || !pwd) res.status(400).json({"message": "User name and password are required"});
    // tìm kiếm tên người dùng
    const foundUser = usersDB.users.find(person => person.username === user);
    // không có trả về mã trạng thái 401 lỗi từ phía client
    if(!foundUser) res.sendStatus(401);
    // Dùng để so sánh mật khẩu 
    const match = await bcrypt.compare(pwd,foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles);
        // day 09
        
        // create JWTs
        // Dùng để xác thực người dùng và được truyền giữa client và server để cho phép truy cập vào các tài nguyên được bảo vệ
        const accessToken = jwt.sign(
            {   
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser,refreshToken};
        usersDB.setUsers([...otherUsers,currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt',refreshToken,{ httpOnly: true,sameSite: 'None',secure: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({ accessToken });
        // res.json({"access":`User ${foundUser.username}`})

    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};