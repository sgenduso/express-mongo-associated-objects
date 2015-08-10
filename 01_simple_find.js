var db = require('monk')('localhost/association-objects');
var people = db.get('people');
var employers = db.get('employers');
var addresses = db.get('addresses');

people.findOne({name: 'Pearl Cremin'}).then(function (person) {
  return addresses.findOne({_id: person.addressId}).then(function (address) {
    person.address = address;
    console.log(person.address);
  });
});
