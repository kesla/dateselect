var weekdays = exports.weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

Date.prototype.increaseYear = function(num) {
  this.setUTCFullYear(this.getUTCFullYear() + num);
}
Date.prototype.increaseMonth = function(num) {
  var str = this.getUTCFullYear()+"-"+(this.getUTCMonth()+num + 1)+"-"+
        this.getUTCDate()+"T"+this.getUTCHours()+":"+this.getUTCMinutes()+":"+
        this.getUTCSeconds()+"."+this.getUTCMilliseconds()+"Z";
  var date = new Date(str);
  this.setTime(date.getTime());
}
Date.prototype.increaseDay = function(num) {
  this.setUTCDate(this.getUTCDate() + num);
}
Date.prototype.increaseHour = function(num) {
  this.setUTCHours(this.getUTCHours() + num);
}

Date.prototype.increaseMinute = function(num) {
  this.setUTCMinutes(this.getUTCMinutes() + num);
}

Date.prototype.increaseSecond = function(num) {
  this.setUTCSeconds(this.getUTCSeconds() + num);
}

exports.ceilDate = function(date, delta){
  var ms = date.getTime();
  return new Date(Math.ceil(ms/delta)*delta);
}

exports.floorDate = function(date, delta){
  var ms = date.getTime();
  return new Date(Math.floor(ms/delta)*delta)
}
