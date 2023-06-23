const {logEvent} = require('./logEvent')
const errorMiddlerware = (error,req,res,next) =>{
    logEvent(`${error.name}:${error.message}`,'errLog.txt')
    console.error(error.stack);
    res.status(500).send(error.message);
}

module.exports = errorMiddlerware;