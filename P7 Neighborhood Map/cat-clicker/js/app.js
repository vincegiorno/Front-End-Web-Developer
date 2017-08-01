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
        countCat: function (catName, catCount) {
            for (var i = 0; i < model.length; i++) {
                if (catName === model[i].name) {
                    model[i].clickCount += 1;
                    viewDisplay.render(catName);
                    return;
                }
            }
        },

        init: function () {
            viewDisplay.init();
            viewList.render();
            viewList.init();
        }
    };

    var viewList = {
        init: function () {
            this.$nameList.on('click', '.singleCat', function () {
                viewDisplay.render($(this).html());
            });
        },

        render: function () {
            this.$nameList = $('#nameList');
            var nameTemplate = $('script[data-template="name"]').html(),
                singleCat;

            model.forEach(function (cat) {
               singleCat = nameTemplate.replace(/{{name}}/g, cat.name);
               viewList.$nameList.append(singleCat);
            });
        }
    };

    var viewDisplay = {
        init: function () {
            this.$name = $('#name');
            this.$image = $('#image');
            this.$count = $('#count');

            this.$image.click(function () {
                octopus.countCat(viewDisplay.$name.html());
            });
        },

        render: function (catName) {
            for (var i = 0; i < model.length; i++) {
                if (catName === model[i].name) {
                    viewDisplay.$name.html(catName);
                    viewDisplay.$image.attr('src', model[i].url);
                    viewDisplay.$count.html(model[i].clickCount);
                    return;
                }
            }
        }
    };

    octopus.init();
});