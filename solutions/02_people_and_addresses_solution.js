var db = require('monk')('localhost/association-objects')
var people = db.get('people')
var employers = db.get('employers')
var addresses = db.get('addresses')

var joinPersonAddress = function (people, addresses) {
  people.forEach(function (person) {
    addresses.forEach(function (address) {
      if(person.addressId.toString() === address._id.toString()) {
        person.address = address
      }
    })
  })
  return people
}

people.find().then(function (people) {
  var addressIds = people.map(function (person) { return person.addressId })
  addresses.find({_id: {$in: addressIds}}).then(function (addresses) {
    console.log(joinPersonAddress(people, addresses))
  }).then(function () {
    db.close()
  })
})
