const fs = require('fs')

const rs = fs.createReadStream('./test.txt',{encoding:'utf8'})

const ws = fs.createWriteStream('./new-test.txt')

// rs.on('data',(dataChunk)=>{
//     console.log(dataChunk);
//     ws.write(dataChunk);
// })

rs.pipe(ws)