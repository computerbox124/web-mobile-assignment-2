function fetchData(url) {
    return $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
    }).then(function (data){
        dataResult = data;
        return dataResult;
    });

}

function getProducts(){
    return fetchData('https://dummyjson.com/products').then( function(data){
        return data.products;

    })
}

getProducts().then(function (data){
    console.log(data);
})