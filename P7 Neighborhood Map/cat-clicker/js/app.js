$(function () {

    var model = [
        {
            name: 'Lin',
            clickCount: 0,
            url: 'image/cat_picture1.jpg'
        },
        {
            name: 'Martian',
            clickCount: 0,
            url: 'image/cat_picture2.jpeg'
        },
        {
            name: 'Baby',
            clickCount: 0,
            url: 'image/cat_picture3.jpeg'
        }
    ];

    var octopus = {
        getCat: function (cat) {
            
        },

        init: function () {
            viewList.render();
            viewDisplay.init();
        }
    };

    var viewList = {
        render: function () {
            this.$nameList = $('#nameList');
            var $nameList = this.$nameList,
                nameTemplate = $('script[data-template="name"]').html(),
                singleCat;

            model.forEach(function (cat) {
               singleCat = nameTemplate.replace(/{{name}}/g, cat.name);
               $nameList.append(singleCat);
            });
        }
    };

    var viewDisplay = {
        init: function () {
            viewList.$nameList.on('click', '.singleCat', function () {
                octopus.getCat($(this).html());
            });
            
            this.render();
        },
        
        render: function () {
            
        }
    };

    octopus.init();
});