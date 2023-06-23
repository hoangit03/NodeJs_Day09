const fsPromises = require('fs').promises

const { log } = require('console');
const path = require('path')

const fileOps = async ()=>{
    try{
        const data = await fsPromises.readFile(path.join(__dirname,'starter.txt'),'utf8');
        console.log(data);
        await fsPromises.writeFile(path.join(__dirname,'test.txt'),'Dao Huy Hoang');
        await fsPromises.appendFile(path.join(__dirname,'test.txt'),'\nVu Thi Thu Loan')
        await fsPromises.rename(path.join(__dirname,'lorem.txt'),path.join(__dirname,'crush.txt'))
        const newData = await fsPromises.readFile(path.join(__dirname,'crush.txt'),'utf8')
        console.log(newData);
    }catch(err){
        console.log(err);
    }
}

fileOps();