var db = require('monk')('localhost/association-objects');
var people = db.get('people');
var employers = db.get('employers');
var addresses = db.get('addresses');
