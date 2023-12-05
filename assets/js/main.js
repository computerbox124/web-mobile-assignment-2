// The basic url for fetching API
const API = 'https://dummyjson.com/products'

// -------- Support functions -------------

// The basic fetching function by URL
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
        return data;
    });

}

// The function which gets all available categories
function getCategories(){
    const APICategories = API + '/categories';
    return fetchData(APICategories).then(function (data){
        return data
    });
}

// The function which gets all products
function getProducts(link){
    return fetchData(link).then( function(data){
        return {
            'products': data.products,
            'total': data.total
        };

    })
}



// Support function in order to get ID of the HTML object
function getHTMLId(element) {
    var res = '';
    for(var i = 4; i < element.length; i++){
        res += element[i];
    }
    return res
}




// Function which will open the product details after clicking the product card
function clickedProduct(id){
    window.open(`./detailed.html?product=${id}`, '_blank');
}

// --------------- Component functions --------------------

// Component function which renders pagination buttons
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
                pagination(i, objCounts, link + '?')
            }).appendTo('#page' + i);
        }
    });
}

// Component function which renders the all products according pagination configuration
function pagination(page, objectCount, link){
    $("#container").empty();
    var pageId = 'page' + page;
    var pageIdActive = 'page' + pageActive;

    //If other page button clicked, the current button must lose the active class
    $('#' + pageIdActive).removeClass('active');
    //If other page button clicked, the clicked page button must gain the active class
    $('#' + pageId).addClass('active');

    pageActive = page;
    // Getting products by using pagination configurations
    let skipObjects = (page - 1) * objectCount;
    const paginationAPI = link + 'limit=' + objectCount + '&skip=' + skipObjects
    getProducts(paginationAPI).then(function (data){
        var dataEl = data.products;
        var objects = [];
        for(let i = 0; i < dataEl.length; i++)
        {
            objects.push(dataEl[i]);
        }

        // Rendering product to HTML
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
                        // When mouse entered the border will appear
                        this.style = '' +
                            'border-color: black;' +
                            'border-style: groove; ' +
                            'border-width: 4px';})
                    .on('mouseleave',function(){
                        this.style = '';}).appendTo('#row' + rowCnt);

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

// Component function which renders all categories
function renderCategories(){
   $("#SelectFilter").empty();
  getCategories().then(function (data){
      $("<option>", {
          'value': 'all',
          'text': 'All'
      }).appendTo('#SelectFilter');
      for(var object of data){
          $("<option>", {
              'value': object,
              'text': object
          }).appendTo('#SelectFilter');
      }

      $("#SelectFilter").on('change', function() {
          if(this.value === "all")generatePage(API, 1);
          else generatePage(API + "/category/" + this.value, 1);
      })


  });
}

// Component function which renders the whole page
function generatePage(link, sig){
    renderPagination(12, link);
    pagination(1, 12, link + ( sig ? "?" : '&'));

}

// Render the page when all files loaded
$(document).ready(function(){
    renderCategories();
    generatePage(API, 1);
});

//------- Binding events -------

// Binding the search event
$( "#search" ).bind( "change", function(e) {
    var keyword = e.target.value;
    generatePage(API + '/search?q=' + keyword, 0);
});


