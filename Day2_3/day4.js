const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;


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


// app.get('/',(req,res)=>{
//     res.send(`${req.url}`);
// });
app.get('^/$|/index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));
});
app.get('/new-page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','new-page.html'));
});
app.get('/xyz-page(.html)?',(req,res)=>{
    res.redirect(301,'/new-page.html');
});


// Route handdlers
app.get('/hello(.html)?',(req,res,next)=>{
    console.log('attempted to load hello.html');
    next();
},(req,res)=>{
    res.send('Hello world!')
})

// Array Route handdlers


app.get('/arr(.html)?',[one,two,three]);

app.listen(PORT,()=>console.log(`Server running PORT: ${PORT}`));