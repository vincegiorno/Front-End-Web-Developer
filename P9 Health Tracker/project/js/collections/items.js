/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    // Todo Collection
    // ---------------

    // The collection of todos is backed by *localStorage* instead of a remote
    // server.
    var Items = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: app.Item,

        search: function (keyword) {
            var searchURL = 'https://api.nal.usda.gov/ndb/search/?format=json' +
                '&q=' + keyword + '&max=3&sort=r&ds=Standard%20Reference' +
                '&api_key=v7BGy4B7LOlJgqGoNg2N3uooQU5YnBMgx7dtgc1g';

            $.getJSON(searchURL, function (data) {
                var foodIDs = '';
                data.list.item.forEach(function (item) {
                    foodIDs += `&ndbno=${item.ndbno}`;
                });
                var foodURL = 'https://api.nal.usda.gov/ndb/V2/reports?format=json' +
                    foodIDs + '&type=f' +
                    '&api_key=v7BGy4B7LOlJgqGoNg2N3uooQU5YnBMgx7dtgc1g';
                $.getJSON(foodURL, function (data) {
                    console.log(data);
                });
            });
        },

        // Generate the attributes for a new Todo item.
        newAttributes: function (data) {
            return {
                title: this.$input.val().trim(),
                order: app.todos.nextOrder(),
                completed: false
            };
        }
    });

    // Create our global collection of **Todos**.
    app.Items = new Items();
})();
