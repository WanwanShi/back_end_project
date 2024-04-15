const endpoints = require("../endpoints.json")

function getAllEndpoints(req,res,next){
    let endpointsArray = [];
    for(const key in endpoints){
        let newObj = {};
        newObj[key] = endpoints[key];
        endpointsArray.push(newObj)
    }
    res.status(200).send(endpointsArray)
}

module.exports = {getAllEndpoints}