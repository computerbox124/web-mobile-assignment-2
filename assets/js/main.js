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

renderItems();