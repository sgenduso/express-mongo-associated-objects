var db = require('monk')('localhost/association-objects')
var people = db.get('people')
var employers = db.get('employers')
var addresses = db.get('addresses')

var employerData = [
  {
    name: "Goldner-Labadie",
    line1: "64984 Deckow Forks",
    cityStateZip: "O'Reillyfort, TN 85460"
  },
  {
    name: "Bogisich, Mitchell and Auer",
    line1: "597 Kurtis Neck",
    cityStateZip: "Terrytown, VT 73919"
  },
  {
    name: "Zieme-Murphy",
    line1: "2184 Wilford Mission",
    cityStateZip: "South Erich, IA 38564"
  },
  {
    name: "Schumm, Beahan and Leannon",
    line1: "79692 Amber Mall",
    cityStateZip: "Lake Jaiden, ME 54925-2222"
  },
  {
    name: "Douglas LLC",
    line1: "88407 Randi Manors",
    cityStateZip: "Erictown, OK 41715-9894"
  },
  {
    name: "Beahan, Rogahn and Walsh",
    line1: "2823 Heidenreich Centers",
    cityStateZip: "Feestshire, NV 35335"
  },
  {
    name: "Kuvalis-Dickens",
    line1: "42166 Jaclyn Forge",
    cityStateZip: "Murphyside, OK 49023-3200"
  },
  {
    name: "Aufderhar, Cruickshank and Hills",
    line1: "637 Guadalupe Trace",
    cityStateZip: "Lake Johathanside, CO 34804"
  },
  {
    name: "Kohler Inc",
    line1: "82219 Genoveva Shore",
    cityStateZip: "Laceyberg, MO 22504-6563"
  },
  {
    name: "Schmidt and Sons",
    line1: "1564 Carmen Orchard",
    cityStateZip: "Kutchland, MN 88074"
  }
]

var personData = [
  {
    name: 'Lourdes Ziemann',
    line1: "651 Adriel Wall",
    cityStateZip: "North Ocie, AZ 39762",
    employers: [
      'Goldner-Labadie',
      'Zieme-Murphy',
      'Douglas LLC',
      'Kuvalis-Dickens',
      'Kohler Inc',
    ]
  },
  {
    name: 'Malika Wilkinson',
    line1: "197 Stark Expressway",
    cityStateZip: "Friedastad, NC 55690",
    employers: [
      'Goldner-Labadie',
      'Bogisich, Mitchell and Auer',
      'Zieme-Murphy',
      'Schumm, Beahan and Leannon',
    ]
  },
  {
    name: 'Manley Williamson',
    line1: "884 Lehner Trail",
    cityStateZip: "Berryview, ID 83540-5530",
    employers: [ ]
  },
  {
    name: 'Albina Stokes',
    line1: "16027 Buford Radial",
    cityStateZip: "East Norberthaven, NC 69675-1417",
    employers: [
      'Kohler Inc',
      'Schmidt and Sons',
    ]
  },
  {
    name: 'Vickie Parisian',
    line1: "880 Johns Corners",
    cityStateZip: "Schuppehaven, VA 40212-0373",
    employers: [
      'Zieme-Murphy',
      'Beahan, Rogahn and Walsh',
      'Kohler Inc',
    ]
  },
  {
    name: 'Rhiannon Lindgren',
    line1: "47801 Savion Hill",
    cityStateZip: "West Bricefort, MT 70284",
    employers: [
      'Beahan, Rogahn and Walsh',
      'Kuvalis-Dickens',
    ]
  },
  {
    name: 'Michele Nader',
    line1: "749 Keeling Parkway",
    cityStateZip: "Urbanberg, AZ 94913-7459",
    employers: [
      'Zieme-Murphy',
      'Schmidt and Sons',
      'Schumm, Beahan and Leannon',
    ]
  },
  {
    name: 'Pearl Cremin',
    line1: "74350 Hudson Ways",
    cityStateZip: "Angelicamouth, VA 57254-6045",
    employers: [
      'Aufderhar, Cruickshank and Hills',
    ]
  },
  {
    name: 'Miss Marty Bernier',
    line1: "2715 Franecki Springs",
    cityStateZip: "Rautown, NM 43930-3181",
    employers: [
      'Douglas LLC',
      'Bogisich, Mitchell and Auer',
      'Zieme-Murphy',
    ]
  },
  {
    name: 'Andreanne Reichert',
    line1: "24682 Shea Ports",
    cityStateZip: "Dillonville, LA 73995",
    employers: [
      'Schmidt and Sons',
    ]
  }
]

Promise.all([
  people.remove({}),
  employers.remove({}),
  addresses.remove({}),
]).then(function () {
  return Promise.all(employerData.map(function (employer) {
    return addresses.insert({line1: employer.line1, cityStateZip: employer.cityStateZip}).then(function (address) {
      return employers.insert({name: employer.name, addressId: address._id})
    })
  })).then(function () {
    return employers.find({})
  })
}).then(function (employers) {
  var indexed = employers.reduce(function(result, employer){
    result[employer.name] = employer
    return result
  }, {})

  return Promise.all(personData.map(function (person) {
    return addresses.insert({line1: person.line1, cityStateZip: person.cityStateZip}).then(function (address) {
      return people.insert({
        name: person.name,
        addressId: address._id,
        employerIds: person.employers.map(function (employer) {
          return indexed[employer]._id
        })
      })
    })
  }))
}).then(function () {
  db.close()
})
