var joinPersonAddress = function (people, addresses) {
  people.forEach(function (person) {
    addresses.forEach(function (address) {
      if(person.addressId === address._id) {
        person.address = address
      }
    })
  })
  return people
}

describe('joinPersonAddress', function () {

  it("sets the address property on the person object", function () {
    var people = [
      {_id: 'abc', name: 'Sue', addressId: '123'},
      {_id: 'def', name: 'Bob', addressId: '345'}
    ]

    var addresses = [
      {_id: '123', line1: 'Elm St'},
      {_id: '345', line1: 'Main St'}
    ]

    var expected = [
      {_id: 'abc', name: 'Sue', addressId: '123', address: {_id: '123', line1: 'Elm St'}},
      {_id: 'def', name: 'Bob', addressId: '345', address: {_id: '345', line1: 'Main St'}}
    ]

    expect(joinPersonAddress(people, addresses)).toEqual(expected)
  })

})
