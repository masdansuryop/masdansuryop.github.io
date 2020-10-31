function getStandings () {
  if ('caches' in window) {
    caches.match(ENDPOINT_STANDINGS).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log('Gunakan aset dari cache :', response.url)
          showStandings(data)
        })
      }
    })
  }

  fetchAPI(ENDPOINT_STANDINGS)
    .then(data => {
      console.log('Memuat aset dari server :', ENDPOINT_STANDINGS)
      showStandings(data)
    })
    .catch(error => {
      console.log(error)
    })
}

async function showStandings (data) {
  const page = window.location.hash.substr(1)
  let standingsHTML = ''
  for (const standing of data.standings[0].table) {
    let shortName = ''
    await getSavedClubById(standing.team.id).then(function (data) {
      shortName = data.shortName
    })
    if (page === 'standings') {
      const form = standing.form.split(',')
      standingsHTML += `
                        <tr>
                          <td class='standings-position'>${standing.position}</td>
                          <td class='standings-club'><img src='${standing.team.crestUrl}' height='20px'></td>
                          <td class='standings-club'>${shortName}</td>
                          <td class='standings-played'>${standing.playedGames}</td>
                          <td class='standings-won hide-on-small-only'>${standing.won}</td>
                          <td class='standings-drawn hide-on-small-only'>${standing.draw}</td>
                          <td class='standings-lost hide-on-small-only'>${standing.lost}</td>
                          <td class='standings-gf hide-on-small-only'>${standing.goalsFor}</td>
                          <td class='standings-ga hide-on-small-only'>${standing.goalsAgainst}</td>
                          <td class='standings-gd'>${standing.goalDifference}</td>
                          <td class='standings-points'><b>${standing.points}<b></td>
                          <td class='standings-form hide-on-med-and-down'>
                      `
      form.forEach(function (form) {
        let color = ''
        if (form === 'W') {
          color = 'green'
        } else if (form === 'D') {
          color = 'yellow'
        } else {
          color = 'red'
        }
        standingsHTML += `
                          <span class='badge ${color} white-text'>${form}</span>
                        `
      })

      standingsHTML += `
                          </td>
                        </tr>
                      `
    } else {
      standingsHTML += `
                        <tr>
                          <td class='standings-position'>${standing.position}</td>
                          <td class='standings-club'><img src='${standing.team.crestUrl}' height='20px'></td>
                          <td class='standings-club'>${shortName}</td>
                          <td class='standings-played'>${standing.playedGames}</td>
                          <td class='standings-gd'>${standing.goalDifference}</td>
                          <td class='standings-points'><b>${standing.points}<b></td>
                        </tr>
                      `
    }
  }
  if (page === 'standings') {
    $('.preloader-background').delay(1000).fadeOut('slow')
    $('.preloader-wrapper').delay(1000).fadeOut()
  }
  document.getElementById('standings').innerHTML = standingsHTML
}