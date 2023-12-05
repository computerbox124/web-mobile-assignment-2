const API = 'https://dummyjson.com/products'

function fetchData(url) {
    return $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        error: function(request, textStatus, errorThrown) {
            console.error('Request failed: ' + textStatus + ', Response code: ' + request.status);
        }
    }).then(function (data){
        return data;
    });

}

function getCategories(){
    const APICategories = API + '/categories';
    return fetchData(APICategories).then(function (data){
        return data
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



var pageActive = 1;

function renderPagination(objCounts, link) {

   getProducts(link).then(function (data){
       $("#pagination").empty();
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
                pagination(i, objCounts, link)
            }).appendTo('#page' + i);
        }
    });
}

function clickedProduct(id){
    window.open(`./detailed.html?product=${id}`, '_blank');
}

function getHTMLId(element) {
    var res = '';
    for(var i = 4; i < element.length; i++){
        res += element[i];
    }
    return res
}

function pagination(page, objectCount, link){
    $("#container").empty();
    var pageId = 'page' + page;
    var pageIdActive = 'page' + pageActive;

    $('#' + pageIdActive).removeClass('active');
    $('#' + pageId).addClass('active');

    pageActive = page;
    let skipObjects = (page - 1) * objectCount;
    const paginationAPI = link + '?limit=' + objectCount + '&skip=' + skipObjects
    getProducts(paginationAPI).then(function (data){
        var dataEl = data.products;
        var objects = [];
        for(let i = 0; i < dataEl.length; i++)
        {
            objects.push(dataEl[i]);
        }
        let cnt = 0;
        let rowCnt = 0;
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
                    'id': 'card' + item.id
                })
                    .on('click', function (){ clickedProduct(getHTMLId(this.id)); })
                    .on('mouseenter',function(){
                        this.style = '' +
                            'border-color: black;' +
                            'border-style: groove; ' +
                            'border-width: 4px';})
                    .on('mouseleave',function(){ this.style = '';}).appendTo('#row' + rowCnt);

                $('<img>', {
                    'src': item.thumbnail,
                    'class': 'card-img rounded mx-auto d-block'
                }).appendTo('#card' + item.id);

                $('<h5>', {
                    'text': item.title,
                    'class': 'card-title'
                }).appendTo('#card' + item.id);

                $('<span>', {
                    'class': 'card-text',
                    'text': 'Category: ' + item.category
                }).appendTo('#card' + item.id);

                $('<h2>', {
                    'text': 'Price: $' + item.price,
                    'class': 'card-text'
                }).appendTo('#card' + item.id);

                $('<span>', {
                    'text': 'Discount: ' + item.discountPercentage + '%',
                    'class': 'card-text'
                }).appendTo('#card' + item.id);

                $('<span>', {
                    'text': 'Stock: ' + item.stock + ' items left!',
                    'class': 'card-text'
                }).appendTo('#card' + item.id);


                cnt = cnt + 1;
            }

        }

    });

}

function renderCategories(){
   $("#SelectFilter").empty();
  getCategories().then(function (data){
      for(var object of data){
          $("<option>", {
              'value': object,
              'text': object
          }).appendTo('#SelectFilter');
      }

      $("#SelectFilter").on('change', function() {
          if(this.value === "all")generatePage(API);
          else generatePage(API + "/category/" + this.value);
      })


  });
}

function generatePage(link){
    renderPagination(12, link);
    pagination(1, 12, link);

}

$(document).ready(function(){
    renderCategories();
    generatePage(API);
});
