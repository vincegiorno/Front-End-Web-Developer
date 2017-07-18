var Car = function(loc) {
    this.loc = loc;
};
Car.prototype.move = function () {
    this.loc++;
};

var Van = function (loc) {
    Car.call(this, loc);
};
Van.prototype = Object.create(Car.prototype);
Van.prototype.constructor = Van;
Van.prototype.grab = function () {
    
};

var zed = new Car(3);
zed.move();

var amy = new Van(9);
amy.move();


// var Car = function (loc) {
//     var obj = {loc: loc};
//     obj.move = function () {
//         obj.loc++
//     };
//     return obj;
// };
//
// var Van = function (loc) {
//     var obj = Car(loc);
//     obj.grab = function () {
//
//     };
//     return obj;
// };
//
// var Cop = function (loc) {
//     var obj = Car(loc);
//     obj.call = function () {
//
//     };
//     return obj;
// };

// var amy = Van(1);
// amy.move();
// var ben = Van(9);
// ben.move();
// var cal = Cop(2);
// cal.move();
// cal.call();
//
// console.log(amy);
