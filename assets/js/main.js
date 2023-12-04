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

var pageActive = 1;

function renderPagination(pages) {
    for(let i = 1; i <= pages; i++){
        var cName = 'page' + i;
        if(i === pageActive){
            cName += ' active';
        }
        $('<li>', {
            'class': cName,
            'id': 'page' + i
        }).appendTo('#pagination');

        $('<a>', {
            'class': 'page-link',
        }).text(i).appendTo('#page' + i);
    }

}

function pagination(page, objectCount){
    getProducts().then(function (data){
        var pageCounts = data.length / 12 + (data.length % 12 ? 1 : 0);
        renderPagination(pageCounts);


        var objects = [];
        var startObjectIndex = objectCount * (page - 1);
        var endObjectIndex = objectCount * page;
        for(let i = startObjectIndex; i < endObjectIndex; i++)
        {
           objects.push(data[i]);
        }

        var cnt = 0;
        var rowCnt = 0;
        for (var i = 0; i < objects.length; i+=3) {
            rowCnt += 1
            $('<div>', {
                'class': 'row',
                'id': 'row' + rowCnt
            }).appendTo('#container');
            for(var j = i; j < Math.min(i + 3, objects.length); j++) {
                var item = objects[j];
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

    });

}

pagination(1, 12);
