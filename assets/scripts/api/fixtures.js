async function getFixtures () {
  const currentMatchday = await getCurrentMatchday()

  if ('caches' in window) {
    caches.match(ENDPOINT_FIXTURES + currentMatchday).then(await function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log('Gunakan aset dari cache :', response.url)
          showFixtures(data)
        })
      }
    })
  }

  fetchAPI(ENDPOINT_FIXTURES + currentMatchday)
    .then(data => {
      console.log('Memuat aset dari server :', ENDPOINT_FIXTURES + currentMatchday)
      showFixtures(data)
    })
    .catch(error => {
      console.log(error)
    })
}

async function showFixtures (data) {
  const page = window.location.hash.substr(1)
  let fixturesHTML = ''
  for (const match of data.matches) {
    let timeScore = ''
    if (match.status === 'FINISHED') {
      timeScore = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
    } else if (match.status === 'POSTPONED') {
      timeScore = 'TBC'
    } else {
      timeScore = moment(match.utcDate).format('HH:MM')
    }
    
    let homeLogo = ''
    let homeTla = ''
    let homeShortName = ''
    await getSavedClubById(match.homeTeam.id).then(function (data) {
      homeLogo = data.crestUrl
      homeTla = data.tla
      homeShortName = data.shortName
    })
    let awayLogo = ''
    let awayTla = ''
    let awayShortName = ''
    await getSavedClubById(match.awayTeam.id).then(function (data) {
      awayLogo = data.crestUrl
      awayTla = data.tla
      awayShortName = data.shortName
    })
    fixturesHTML += `
                      <div class='card match-card'>
                        <div class='card-content center'>
                          <div class='col s12 game-week'>
                            Game Week ${match.matchday}
                          </div>
                          <div class='col s12 match-date'>
                            ${moment(match.utcDate).format('dddd, DD MMMM YYYY')}
                          </div>
                          <div class='col s3 team-name'>
                            <span class='hide-on-small-only'>${homeShortName}</span>
                            <span class='hide-on-med-and-up'>${homeTla}</span>
                          </div>
                          <div class='col s2 team-logo'>
                            <img src='${homeLogo}'>
                          </div>
                          <div class='col s2 time-score'>
                            ${match.status === 'FINISHED' ? '<p class="time-info">FT</p>' : ''}
                            <span>${timeScore}</span>
                          </div>
                          <div class='col s2 team-logo'>
                            <img src='${awayLogo}'>
                          </div>
                          <div class='col s3 team-name'>
                            <span class='hide-on-small-only'>${awayShortName}</span>
                            <span class='hide-on-med-and-up'>${awayTla}</span>
                          </div>
                        </div>
                      </div>
                    `
  }
  if (page === 'home' || page === '' || page === 'fixtures') {
    $('.preloader-background').delay(1000).fadeOut('slow')
    $('.preloader-wrapper').delay(1000).fadeOut()
  }
  document.getElementById('fixtures').innerHTML = fixturesHTML
}

function getFixtureById (id) {
  return new Promise(function (resolve, reject) {
    if ('caches' in window) {
      caches.match(`${BASE_URL}teams/${id}/matches`).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            console.log('Gunakan aset dari cache :', response.url)
            showFixtureById(data)
            resolve(data)
          })
        }
      })
    }

    fetchAPI(`${BASE_URL}teams/${id}/matches`)
      .then(data => {
        console.log('Memuat aset dari server :',`${BASE_URL}teams/${id}/matches`)
        showFixtureById(data)
        resolve(data)
      })
      .catch(error => {
        console.log(error)
      })
  })
}

async function showFixtureById (data) {
  let fixturesHTML = ''
  for (const match of data.matches) {
    let timeScore = ''
    if (match.status === 'FINISHED') {
      timeScore = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
    } else if (match.status === 'POSTPONED') {
      timeScore = 'TBC'
    } else {
      timeScore = moment(match.utcDate).format('HH:MM')
    }
    
    let homeLogo = ''
    let homeTla = ''
    let homeShortName = ''
    await getSavedClubById(match.homeTeam.id).then(function (data) {
      homeLogo = data.crestUrl
      homeTla = data.tla
      homeShortName = data.shortName
    })
    let awayLogo = ''
    let awayTla = ''
    let awayShortName = ''
    await getSavedClubById(match.awayTeam.id).then(function (data) {
      awayLogo = data.crestUrl
      awayTla = data.tla
      awayShortName = data.shortName
    })
    fixturesHTML += `
                      <div class='card match-card'>
                        <div class='card-content center'>
                          <div class='col s12 game-week'>
                            Game Week ${match.matchday}
                          </div>
                          <div class='col s12 match-date'>
                            ${moment(match.utcDate).format('dddd, DD MMMM YYYY')}
                          </div>
                          <div class='col s3 team-name'>
                            <span class='hide-on-small-only'>${homeShortName}</span>
                            <span class='hide-on-med-and-up'>${homeTla}</span>
                          </div>
                          <div class='col s2 team-logo'>
                            <img src='${homeLogo}'>
                          </div>
                          <div class='col s2 time-score'>
                            ${match.status === 'FINISHED' ? '<p class="time-info">FT</p>' : ''}
                            <span>${timeScore}</span>
                          </div>
                          <div class='col s2 team-logo'>
                            <img src='${awayLogo}'>
                          </div>
                          <div class='col s3 team-name'>
                            <span class='hide-on-small-only'>${awayShortName}</span>
                            <span class='hide-on-med-and-up'>${awayTla}</span>
                          </div>
                        </div>
                      </div>
                    `
  }
  $('.preloader-background').delay(1000).fadeOut('slow')
  $('.preloader-wrapper').delay(1000).fadeOut()
  
  document.getElementById('fixtures').innerHTML = fixturesHTML
}

async function getCurrentMatchday () {
  if ('caches' in window) {
    caches.match(BASE_URL + 'competitions/2021').then(async function (response) {
      if (response) {
        const data = await response.json()
        console.log('Gunakan aset dari cache :', response.url)
        return data.currentSeason.currentMatchday
      }
    })
  }

  const response = await fetch(BASE_URL + 'competitions/2021', {
    method: 'GET',
    headers: {
      'X-Auth-Token': API_KEY
    }
  })

  console.log('Memuat aset dari server :', response.url)
  const data = await response.json()
  return data.currentSeason.currentMatchday
}