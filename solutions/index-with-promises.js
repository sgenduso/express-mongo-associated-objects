var express = require('express');
var router = express.Router();
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

var joinEmployerAddress = function (employers, addresses) {
  employers.forEach(function (employer) {
    addresses.forEach(function (address) {
      if(employer.addressId.toString() === address._id.toString()) {
        employer.address = address
      }
    })
  })
  return employers
}

var joinPersonEmployer = function (people, employers) {
  var indexed = employers.reduce(function (result, employer) {
    result[employer._id.toString()] = employer
    return result
  }, {})
  people.forEach(function (person) {
    person.employers = person.employerIds.map(function (_id) {
      return indexed[_id.toString()]
    })
  })
  return people
}

router.get('/', function(req, res, next) {

  people.find({}).then(function (people) {
    var addressIds = people.map(function (person) { return person.addressId })
    addresses.find({_id: {$in: addressIds}}).then(function (peopleAddresses) {
      joinPersonAddress(people, peopleAddresses)

      var employerIds = people.reduce(function (result, person) {
        return result.concat(person.employerIds)
      }, [])

      employers.find({_id: {$in: employerIds}}).then(function (employers) {
        joinPersonEmployer(people, employers)
        var employerAddressIds = employers.map(function (employer) {
          return employer.addressId
        })
        addresses.find({_id: {$in: employerAddressIds}}).then(function (employerAddresses) {
          joinEmployerAddress(employers, employerAddresses)
          res.render('index', { people: people });
        })
      })
    })
  })

});

module.exports = router;
