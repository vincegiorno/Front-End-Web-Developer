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