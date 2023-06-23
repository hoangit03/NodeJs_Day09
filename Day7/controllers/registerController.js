const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const fsPromieses = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req,res)=>{
    // Lấy các giá trị được yêu cầu
    const { user, pwd} = req.body;
    /*Kiểm tra nếu giá trị user hoặc mật khẩu không có thì sẽ trả về mã trạng thái 400(Lỗi bên phía client) và
    một đối tượng json để thông báo.*/
    if(!user || !pwd) res.status(400).json({"message": "User name and password are required"});
    // Tìm kiếm xem trong dữ liệu đã có user này hay chưa
    const duplicate = usersDB.users.find(person => person.username === user);
    // nếu đã có tên người dùng trong data thì trả về mã trạng thái 409
    if(duplicate) res.sendStatus(409);
    try{
        // Đoạn code dùng để mã hóa mật khẩu.
        const hashedPwd = await bcrypt.hash(pwd,10);
        // Tạo đối tượng object để lưu trữ dữ liệu yêu cầu
        const newUser = {
            "username":user,
            "roles": {"User": 2001},
            "password":hashedPwd
        };
        // Đặt lại dữ liệu
        usersDB.setUsers([...usersDB.users,newUser]);
        // viết dữ liệu vào file lưu trữ
        await fsPromieses.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        // Trả về trạng thái thành công
        res.status(201).json({"success": `New user ${user} created!`});
    }catch(err){
        res.status(500).json({"message":err.message});
    }
}


module.exports = {handleNewUser};