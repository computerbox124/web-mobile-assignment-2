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
        var rowCnt = 0;
        for (var i = 0; i < data.length; i+=3) {
            rowCnt += 1
            $('<div>', {
                'class': 'row',
                'id': 'row' + rowCnt
            }).appendTo('#container');
            for(var j = i; j < i + 3; j++) {
                var item = data[j];
                $('<div>', {
                    'class': 'card col',
                    'id': 'card' + cnt
                }).appendTo('#row' + rowCnt);

                $('<img>', {
                    'src': item.thumbnail
                }).appendTo('#card' + cnt);

                $('<h2>', {
                    'text': item.title
                }).appendTo('#card' + cnt);

                $('<span>', {
                    'text': 'Category: ' + item.category
                }).appendTo('#card' + cnt);

                $('<h2>', {
                    'text': 'Price: $' + item.price
                }).appendTo('#card' + cnt);

                $('<span>', {
                    'text': 'Discount: %' + item.discountPercentage
                }).appendTo('#card' + cnt);

                $('<span>', {
                    'text': 'Stock: ' + item.stock
                }).appendTo('#card' + cnt);



                cnt = cnt + 1;
            }

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
