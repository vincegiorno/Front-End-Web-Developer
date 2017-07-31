
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

    // 1600 pennsylvania ave, washington dc
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/' +
        'streetview?size=600x400&location=' + address;
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


    // Wikipeida AJAX request goes here
    var wikiUrl = 'https://en.wikipedia.org/w/api.' +
        'php?action=opensearch&search=' + cityStr +
        '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text('failed to get wikipedia resources');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        // jsonp: 'callback',
        success: function(response) {
            var articleList = response[1];

            var articleStr,
                url;
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                    articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
