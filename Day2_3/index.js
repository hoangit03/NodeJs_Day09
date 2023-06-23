// const { format } = require('date-fns')
// const { v4: uuid} = require('uuid')

// console.log(format(new Date(), 'MMyyyydd\tHH:mm:ss'));

// console.log(uuid());
// df

/** Day 2 */

// const logEvents = require('./logEvent')

// const eventEmitter = require('events')

// class MyEmitter extends eventEmitter {};

// const myEmitter = new MyEmitter();

// myEmitter.on('log',(msg)=>logEvents(msg))

// setTimeout(()=>{
//     myEmitter.emit('log', 'Log events emitted')
// },2000)


/** Day 3 */
const fs = require('fs');
const fsPromises = require('fs').promises; 
const http = require('http');
const path = require('path');
const logEvents = require('./middlerware/logEvent');
const eventEmitter = require('events');

class MyEmitter extends eventEmitter {};

const myEmitter = new MyEmitter();
myEmitter.on('log',(msg,fileName)=>logEvents(msg,fileName))
const PORT = process.env.PORT || 3500;

const serverFile = async (filePath, contentType, response)=>{
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf-8' : ''
            );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            {'Content-Type' : contentType}
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (error) {
        console.log(error);
        myEmitter.emit('log', `${error.name}\t${error.message}`,'errorLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

//  Tạo serverx

const server = http.createServer((req,res)=>{
    console.log(req.url,req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`,'reqLog.txt');
    const extension = path.extname(req.url);

    let contentType;
    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html'
    }
    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname,req.url);
    
    // nếu phần mở rộng không có hoặc kí tự cuối của yêu cầu là '/' thì sẽ công thêm .html
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath)

    if(fileExists){
        serverFile(filePath,contentType,res);
    }
    else{
        // console.log(path.parse(filePath).base);
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location' :'/new-page.html'});
                res.end();
                break;
            case 'www-page.html': 
                res.writeHead(301, {'Location' :'/'});
                res.end();
                break;
            default:
                serverFile(path.join(__dirname, 'views', '404.html'),'text/html',res);   

        };
    }

});

// Lắng nghe cổng 3500 để thực hiện chương trình

server.listen(PORT,() =>console.log(`Server running on port ${PORT}`))