
function handleCustomErrors (err, req, res, next) {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

function handlePsqlErrors (err, req, res, next) {
    if ( ["22P02","23502"].includes(err.code) ) {
        res.status(400).send({msg: "Bad request!"});
    } 
    if(err.code === "23503"){
        res.status(404).send({msg: "Not found"});
    }else {
        next(err);
    }
};

function handleServerErrors(err, req, res, next)  {
    
    res.status(500).send({ msg: 'Internal Server Error' });
};

module.exports = {handleCustomErrors,handlePsqlErrors,handleServerErrors}