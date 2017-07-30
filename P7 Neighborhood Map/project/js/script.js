
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/' +
        'streetview?size=600x300&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // Your NY Times AJAX requests goes here
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/' +
        'articlesearch.json?q=' + cityStr + '&sort=newest&api-' +
        'key=5db20e7e6b674f3fa4cb51d23c62ea8b';
    $.getJSON(nytimesUrl, function (data) {

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        var articles = data.response.docs;
        var article;
        for (var i = 0; i < articles.length; i++) {
            article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        };
    }).error(function (e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });


    var wikiUrl = 'http:'

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=query&titles=beijing&prop=revisions&rvprop=content&format=json',
        dataType: 'jsonp',
        success: function(data) {
            console.log(data);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
