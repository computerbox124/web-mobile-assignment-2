function fetchData(url) {
    return $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        error: function(request, textStatus, errorThrown) {
            console.error('Request failed: ' + textStatus + ', Response code: ' + request.status);
        }
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

function renderItems(){
    getProducts().then(function (data){
        console.log(data);
        var cnt = 0;
        for (item of data) {

            $('<div>', {
                'class': 'card',
                'id': 'card' + cnt
            }).appendTo('#container');

            $('<img>', {
                'src': item.thumbnail
            }).appendTo('#card' + cnt);

            $('<h2>', {
               'text': item.title
            }).appendTo('#card' + cnt);

            $('<h2>', {
                'text': '$' + item.price
            }).appendTo('#card' + cnt);

            cnt = cnt + 1;

        }
    })
}

function pagination(page, objectCount){
    getProducts().then(function (data){
        var objects = [];
        var dataSize = data.length;
        var startObjectIndex = objectCount * (page - 1);
        var endObjectIndex = objectCount * page;
        for(let i = startObjectIndex; i < endObjectIndex; i++)
        {
           objects.push(data[i]);
        }
        console.log(objects);

    });

}

renderItems();

pagination(2, 10);