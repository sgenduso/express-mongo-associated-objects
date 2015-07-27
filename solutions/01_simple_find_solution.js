var db = require('monk')('localhost/association-objects')
var people = db.get('people')
var employers = db.get('employers')
var addresses = db.get('addresses')

people.findOne({name: 'Lourdes Ziemann'}).then(function (person) {
  addresses.findOne({_id: person.addressId}).then(function (address) {
    person.address = address
    console.log(person);
  }).then(function () {
    db.close()
  })
})
