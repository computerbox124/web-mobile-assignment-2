
const API = 'https://dummyjson.com/products/'
//Support function for fetchign data
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
//Support function for getting product
function getProduct(link){
    return fetchData(link).then( function(data){
        return {
            data
        };

    })

}

//Support function for parsing query parameters
function getQueryParams(url){
    var ind = 0;
    for(ind = 0; ind < url.length; ind++)
    {
        if(url[ind] === '='){ind++; break};
    }
    var objectID = '';
    for(; ind < url.length; ind++){
        objectID += url[ind];
    }
    return objectID;
}

//When page is opened it renders needed information in card div
$(document ).ready(function() {
  var objectID = getQueryParams(document.URL);
  getProduct(API + objectID).then(function(data){
      data = data.data;
      $("#card-img").attr('src', data.thumbnail).attr('class', 'rounded mx-auto d-block');
      $("#card-title").text(data.title);
      $("#card-text").text(data.description);
      $("#card-price").text("Price: " + data.price + "$");
      $("#card-discount").text("Discount: " + data.discountPercentage + "%");
      $("#card-stock").text(data.stock + " items left !");
      for(var j = 0; j < data.images.length; j++)
      {
          $('<img>', {
              src: data.images[j],
              class: 'rounded mx-auto d-block'
          })
              .on('mouseenter',function(){this.style = 'border-color: black;border-style: groove'})
              .on('mouseleave',function(){ this.style = '';})
              .on('click', function(){
                  $("#card-img").attr('src', this.src).attr('class', 'rounded mx-auto d-block');
              })
              .appendTo('#card-gallery');
      }


  });
});