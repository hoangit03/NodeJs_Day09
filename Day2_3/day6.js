const path = require('path');
const express = require('express');
const { logger } = require('./middlerware/logEvent');
const errorMiddlerware = require('./middlerware/errorhander');
const app = express();
const PORT = process.env.PORT || 3500;

const cors = require('cors');
const { error } = require('console');

// app.use((req,res,next)=>{
//     logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt');
//     console.log(`${req.method}\t${req.path}`);
//     next();
// });


app.use(logger);

const whitelist = ['https://www.google.com.vn','http://127.0.0.1:5000','http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(express.urlencoded({extended : false}));

app.use(express.json());

app.use('/',express.static(path.join(__dirname,'/public')));
app.use('/subdir',express.static(path.join(__dirname,'/public')));
app.use('/',require('./routes/root'));
app.use('/subdir',require('./routes/subdir'));
app.use('/employees',require('./routes/api/employees'));


const one = (req,res,next)=>{
    console.log('one');
    next();
}
const two = (req,res,next)=>{
    console.log('two');
    next();
}
const three = (req,res)=>{
    res.send('Array route handdlers');
}





// Route handdlers
app.get('/hello(.html)?',(req,res,next)=>{
    console.log('attempted to load hello.html');
    next();
},(req,res)=>{
    res.send('Hello world!')
})

// Array Route handdlers


app.get('/arr(.html)?',[one,two,three]);

app.all('/*',(req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({error: "404 Not Found"})
    }else
    {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorMiddlerware);


app.listen(PORT,()=>console.log(`Server running PORT: ${PORT}`));