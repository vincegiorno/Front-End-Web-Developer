/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
    'use strict';

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    app.AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: 'body',

        // Our template for the line of statistics at the bottom of the app.
        // statsTemplate: _.template($('#stats-template').html()),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            'keyup #search': 'search'
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function () {
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function () {
        },

        search: function () {
            var value = $('#search').val();
            app.Items.search(value);
        }
    });
})(jQuery);
