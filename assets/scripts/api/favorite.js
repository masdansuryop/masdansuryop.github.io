function showSavedClubs () {
  getAllSavedClub().then(function (clubs) {
    let clubsHTML = ''
    if (clubs.length !== 0) {
      clubs.forEach(function (team) {
        clubsHTML += `
                    <div class='col s6 m4 l3'>
                        <div class='card club-card'>
                          <div class='club-content club-content-favorite' data-id='${team.id}'>
                          <div class='card-image'>
                            <img src='${team.crestUrl}'>
                          </div>
                          <div class='card-content center'>
                            <span class='card-title'>${team.shortName}</span>
                            <p>${team.venue}</p>
                          </div>
                          </div>
                          <div class='card-action center delete-favorite-club' data-id='${team.id}'>
                            Delete
                          </div>
                        </div>
                    </div>
                  `
      })
    } else {
      clubsHTML += '<p>Belum ada Club yang ditambahkan ke favorite.</p>'
    }
    
    $('.preloader-background').delay(1000).fadeOut('slow')
    $('.preloader-wrapper').delay(1000).fadeOut()
              
    document.getElementById('clubs').innerHTML = clubsHTML

    document.getElementById('all-club').style.display = 'block'
    document.getElementById('detail-club').style.display = 'none'
  })
}

function showSavedClubById (id) {
  getSavedFavoriteClubById(id).then(function (data) {
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
  })
}

async function showSavedFixtureClubById (id) {
  getSavedFixtureClubById(id).then(async function (data) {
    let fixturesHTML = ''
    data.matches.forEach(async function (match) {
    // for (const match of data.matches) {
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

      fixturesHTML += await `
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
      document.getElementById('fixtures').innerHTML = fixturesHTML
    })
    $('.preloader-background').delay(1000).fadeOut('slow')
    $('.preloader-wrapper').delay(1000).fadeOut()
  })
}