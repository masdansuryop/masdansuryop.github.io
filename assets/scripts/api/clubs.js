function getClubs () {
  const page = window.location.hash.substr(1)

  return new Promise(function (resolve, reject) {
    if ('caches' in window) {
      caches.match(ENDPOINT_CLUBS).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            console.log('Gunakan aset dari cache :', response.url)
            showClubs(data)
            resolve(data)
          })
        }
      })
    }

    fetchAPI(ENDPOINT_CLUBS)
      .then(data => {
        console.log('Memuat aset dari server :', ENDPOINT_CLUBS)
        if (page === 'home' || page === '') {
          data.teams.forEach(function (team) {
            var teamObj = new Object()

            teamObj.id = team.id
            teamObj.shortName = team.shortName
            teamObj.tla = team.tla
            teamObj.crestUrl = team.crestUrl

            saveClubs(teamObj)
          })
        } else {
          showClubs(data)
          resolve(data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  })
}

async function showClubs (data) {
  document.getElementById('all-club').style.display = 'block'
  document.getElementById('detail-club').style.display = 'none'

  const page = window.location.hash.substr(1)

  let clubsHTML = ''
  for (const team of data.teams) {
    const savedClub = await getSavedFavoriteClubById(team.id)
    let btnAttribute = ''
    let valueButton = ''
    if (savedClub !== undefined) {
      btnAttribute = 'delete-favorite-club'
      valueButton = 'Delete'
    } else {
      btnAttribute = 'favorite'
      valueButton = 'Favorite'
    }
    clubsHTML += `
                  <div class='col s6 m4 l3'>
                      <div class='card club-card'>
                        <div class='club-content club-content-all' data-id='${team.id}'>
                        <div class='card-image'>
                          <img src='${team.crestUrl}'>
                        </div>
                        <div class='card-content center'>
                          <span class='card-title'>${team.shortName}</span>
                          <p>${team.venue}</p>
                        </div>
                        </div>
                        <div class='card-action center ${btnAttribute}' data-id='${team.id}'>
                          ${valueButton}
                        </div>
                      </div>
                  </div>
                `
  }
  if (page === 'clubs') {
    $('.preloader-background').delay(1000).fadeOut('slow')
    $('.preloader-wrapper').delay(1000).fadeOut()
  }
  document.getElementById('clubs').innerHTML = clubsHTML
}

function getClubById (id) {
  return new Promise(function (resolve, reject) {
    if ('caches' in window) {
      caches.match(`${BASE_URL}teams/${id}`).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            console.log('Gunakan aset dari cache :', response.url)
            showClubById(data)
            resolve(data)
          })
        }
      })
    }

    fetchAPI(`${BASE_URL}teams/${id}`)
      .then(data => {
        console.log('Memuat aset dari server :', `${BASE_URL}teams/${id}`)
        showClubById(data)
        resolve(data)
      })
      .catch(error => {
        console.log(error)
      })
  })
}

function showClubById (data) {
  document.getElementById('all-club').style.display = 'none'
  document.getElementById('detail-club').style.display = 'block'
  
  const clubHeaderHTML = `
                        <div class='col s12 m6 page-title card-logo'>
                          <img src='${data.crestUrl}'>
                        </div>
                        <div class='col s12 m6 page-title card-information'>
                          <h5>${data.shortName}</h5>
                          <p>${data.venue}<p>
                          <p>${data.website}<p>
                          <p>${data.phone}<p>
                        </div>
                      `

  let clubPlayerHTML = ''
  let positionBefore = ''
  data.squad.forEach(function (player) {
    if (player.role === 'COACH') {
      player.position = 'Coach'
    }

    if (player.position !== positionBefore) {
      clubPlayerHTML += `
                        <tr>
                          <th colspan='3'>${player.position}</th>
                        </tr>
                      `
    }

    clubPlayerHTML += `
                      <tr>
                        <td class='center'><i class='material-icons'>person</i></td>
                        <td>${player.name}</td>
                        <td>
                          <span>${player.nationality}</span>
                        </td>
                      </tr>
                    `
    positionBefore = player.position
  })
  document.getElementById('club-header').innerHTML = clubHeaderHTML
  document.getElementById('club-player').innerHTML = clubPlayerHTML
}