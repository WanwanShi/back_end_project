

function displayResultWithLimitAndPage(array,limit=10,pageNumber=1){
    let result = [];
    let subArrayNumber = Math.ceil(array.length / limit)
    for(let i = 0; i < subArrayNumber; i++){
        result.push(array.slice(i*limit,(i+1)*limit||array.length))
    }
    if(result[pageNumber-1]){
        return result[pageNumber-1]
    }else{
        return []
    }    
}

module.exports = {displayResultWithLimitAndPage}