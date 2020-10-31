var dbPromised = idb.open('premier-league', 1, function (upgradeDb) {
  upgradeDb.createObjectStore('clubs', { keyPath: 'id' })
  upgradeDb.createObjectStore('favoriteClubs', { keyPath: 'id' })
  upgradeDb.createObjectStore('fixture')
})

function saveClubs (data) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction('clubs', 'readwrite')
      var store = tx.objectStore('clubs')

      store.put(data)

      return tx.complete
    })
    .then(function () {
      console.log('Clubs berhasil di simpan.')
    })
}

function saveFavoriteClub (data) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction('favoriteClubs', 'readwrite')
      var store = tx.objectStore('favoriteClubs')

      store.put(data)

      return tx.complete
    })
    .then(function () {
      console.log('Club berhasil di simpan.')
    })
}

function saveFixtureByClub (data, id) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction('fixture', 'readwrite')
      var store = tx.objectStore('fixture')
      console.log(data)
      store.put(data, id)

      return tx.complete
    })
    .then(function () {
      console.log('Fixture berhasil di simpan.')
      M.toast({html: 'Club berhasil di tambahkan ke favorite.', classes: 'main-color'})
    })
}

function getAllSavedClub () {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction('favoriteClubs', 'readonly')
        var store = tx.objectStore('favoriteClubs')
        return store.getAll()
      })
      .then(function (favoriteClubs) {
        resolve(favoriteClubs)
      })
  })
}

function getSavedClubById (id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction('clubs', 'readonly')
        var store = tx.objectStore('clubs')
        return store.get(id)
      })
      .then(function (clubs) {
        resolve(clubs)
      })
  })
}

function getSavedFavoriteClubById (id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction('favoriteClubs', 'readonly')
        var store = tx.objectStore('favoriteClubs')
        return store.get(id)
      })
      .then(function (favoriteClubs) {
        resolve(favoriteClubs)
      })
  })
}

function getSavedFixtureClubById (id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction('fixture', 'readonly')
        var store = tx.objectStore('fixture')
        return store.get(id)
      })
      .then(function (fixture) {
        resolve(fixture)
      })
  })
}

function deleteSavedClub (id) {
  dbPromised.then(function (db) {
    var tx = db.transaction('favoriteClubs', 'readwrite')
    var store = tx.objectStore('favoriteClubs')
    store.delete(id)
    return tx.complete
  }).then(function () {
    console.log('Item deleted')
  })
}

function deleteSavedFixture (id) {
  dbPromised.then(function (db) {
    var tx = db.transaction('fixture', 'readwrite')
    var store = tx.objectStore('fixture')
    store.delete(id)
    return tx.complete
  }).then(function () {
    console.log('Item deleted')
    M.toast({html: 'Club deleted from Favorite!', classes: 'pink-color'})
  })
}
