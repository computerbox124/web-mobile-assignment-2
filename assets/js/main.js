const API = 'https://dummyjson.com/products'

function fetchData(url) {
    console.log(url);
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

function getProducts(link){
    return fetchData(link).then( function(data){
        return {
            'products': data.products,
            'total': data.total
        };

    })
}

function getProduct(link){
    return fetchData(link).then( function(data){
        console.log(data);
        return {
            data
        };

    })

}

var pageActive = 1;

function renderPagination(objCounts) {
   getProducts(API).then(function (data){
        const total = data.total;
        var pages = Math.floor(total / objCounts) + (total % objCounts ? 1 : 0);
        for (let i = 1; i <= pages; i++) {
            var cName = 'page' + i;
            if (i === pageActive) {
                cName += ' active';
            }
            $('<li>', {
                'class': cName,
                'id': 'page' + i
            }).appendTo('#pagination');

            $('<a>', {
                'class': 'page-link',
            }).text(i).on('click', function () {
                pagination(i, objCounts)
            }).appendTo('#page' + i);
        }
    });
}

renderPagination(12);


function pagination(page, objectCount){
    $("#container").empty();
    var pageId = 'page' + page;
    var pageIdActive = 'page' + pageActive;

    $('#' + pageIdActive).removeClass('active');
    $('#' + pageId).addClass('active');

    pageActive = page;
    let skipObjects = (page - 1) * objectCount;
    const paginationAPI = API + '?limit=' + objectCount + '&skip=' + skipObjects
    getProducts(paginationAPI).then(function (data){
        data = data.products;
        var objects = [];
        for(let i = 0; i < data.length; i++)
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
