const fs = require('fs')
const path = require('path')
console.log(__dirname);

fs.readFile(path.join(__dirname,'starter.txt'),'utf8',(err,data)=>{
    if (err) throw err;
    console.log(data);
})

fs.writeFile(path.join(__dirname,'test.txt'),'Nice to meet you',(err)=>{
    if (err) throw err;
    console.log('Write complete!');
    fs.readFile(path.join(__dirname,'test.txt'),'utf8',(err,data)=>{
        if (err) throw err;
        console.log(data);
    })
})

fs.appendFile(path.join(__dirname,'lorem.txt'),'\n\nVu Thi Thu Loan',err=>{
    if(err) throw err;
    console.log('Append complete!');
    fs.readFile(path.join(__dirname,'test.txt'),'utf8',(err,data)=>{
        if (err) throw err;
        console.log(data);
        fs.readFile(path.join(__dirname,'lorem.txt'),'utf8',(err,data)=>{
            if (err) throw err;
            console.log(data);
        })
    })
})



process.on('uncaughtException',err=>{
    console.log(`Loi:${err}`);
    process.exit(1)
})