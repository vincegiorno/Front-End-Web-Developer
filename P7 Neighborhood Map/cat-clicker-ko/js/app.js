var Cat = function () {
    this.clickCount = ko.observable(0);
    this.name = ko.observable('Tabby');
    this.imgSrc = ko.observable('img/434164568_fea0ad4013_z.jpg');
    this.imgAttribution = ko.observable('https://www.flickr.com/photos/bigtallguy/434164568');
    this.nicknames = ko.observableArray(['Tabtab', 'T-Bone', 'Mr. T', 'Tabitha Tab Tabby Catty Cat']);

    this.title = ko.computed(function () {
        var title;
        var clicks = this.clickCount();
        if (clicks < 10) {
            title = 'Newborn';
        } else if (clicks < 50) {
            title = 'Infant';
        } else if (clicks < 100) {
            title = 'Child';
        } else if (clicks < 200) {
            title = 'Teen';
        } else if (clicks < 500) {
            title = 'Adult';
        } else {
            title = 'Ninja';
        }
        return title;
    }, this);

};

var ViewModel = function () {
    var self = this;

    this.currentCat = ko.observable(new Cat());

    this.incrementCounter = function () {
      self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };
};

ko.applyBindings(new ViewModel());