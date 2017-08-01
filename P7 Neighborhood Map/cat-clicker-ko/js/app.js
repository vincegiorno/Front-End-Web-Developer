var ViewModel = function () {
  this.clickCount = ko.observable(0);
  this.name = ko.observable('Tabby');
  this.imgSrc = ko.observable('img/434164568_fea0ad4013_z.jpg');
  this.imgAttribution = ko.observable('https://www.flickr.com/photos/bigtallguy/434164568');

  this.incrementCounter = function () {
      this.clickCount(this.clickCount() + 1);
  };
};

ko.applyBindings(new ViewModel());