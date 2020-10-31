document.addEventListener("DOMContentLoaded", function () {
  // Activate sidebar nav
  const elems = document.querySelectorAll('.sidenav')
  M.Sidenav.init(elems)
  loadNav()

  function loadNav () {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) return

        // Muat daftar tautan menu
        document.querySelectorAll('.topnav, .sidenav').forEach(function (elm) {
          elm.innerHTML = xhttp.responseText
        })

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll('.sidenav a, .topnav a').forEach(function (elm) {
          elm.addEventListener('click', function (event) {
            // Tutup sidenav
            const sidenav = document.querySelector('.sidenav')
            M.Sidenav.getInstance(sidenav).close()

            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute('href').substr(1)
            loadPage(page)
          })
        })
      }
    }
    xhttp.open('GET', '/assets/pages/nav.html', true)
    xhttp.send()
  }

  // Load page content
  let page = window.location.hash.substr(1)
  if (page === '' || page === 'index.html') page = 'home'
  loadPage(page)

  function loadPage (page) {
    const xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {    
        const content = document.querySelector('#body-content')
        if (this.status === 200) {
          let menu = document.querySelectorAll('.menu')
          menu.forEach(element => {
            element.classList.remove('menu-active')
          });

          switch (page) {
            case 'home':
              $('.preloader-background').show()
              $('.preloader-wrapper').show()

              const elementHome = document.getElementById('menu-home')
              elementHome.classList.add('menu-active')

              getClubs()
              getFixtures()
              getStandings()
              
              break
            case 'fixtures':
              $('.preloader-background').show()
              $('.preloader-wrapper').show()

              const elementFixtures = document.getElementById('menu-fixtures')
              elementFixtures.classList.add('menu-active')

              getFixtures()

              break
            case 'standings':
              $('.preloader-background').show()
              $('.preloader-wrapper').show()

              const elementstandings = document.getElementById('menu-standings')
              elementstandings.classList.add('menu-active')

              getStandings()

              break
            case 'clubs':
              $('.preloader-background').show()
              $('.preloader-wrapper').show()

              const elementClubs = document.getElementById('menu-clubs')
              elementClubs.classList.add('menu-active')

              getClubs()

              break
            case 'favorite':
              $('.preloader-background').show()
              $('.preloader-wrapper').show()

              const elementFavorite = document.getElementById('menu-favorite')
              elementFavorite.classList.add('menu-active')

              showSavedClubs()
              
              break

            default:
              break
          }
          content.innerHTML = xhttp.responseText

          // Detail club
          $(document).on('click', '.club-content-all', function () {
              $('.preloader-background').show()
              $('.preloader-wrapper').show()

              const id = $(this).data('id')

              getClubById(id)
              getFixtureById(id)
          })

          // Save favorite club and fixture
          $(document).on('click', '.favorite', async function () {
              $('.preloader-background').show()
              $('.preloader-wrapper').show()
              
              const id = $(this).data('id')

              const clubItem = getClubById(id)
              const fixtureItem = getFixtureById(id)

              await clubItem.then(function (data) {
                saveFavoriteClub(data)
              })

              await fixtureItem.then(function (data) {
                data.id = id
                saveFixtureByClub(data, id)
              })

              await loadPage('favorite')
          })

          // Delete favorite club
          $(document).on('click', '.delete-favorite-club', async function () {
              const id = $(this).data('id')

              await deleteSavedClub(id)
              await deleteSavedFixture(id)

              location.reload()
          })

          // Detail favorite club
          $(document).on('click', '.club-content-favorite', function () {
              $('.preloader-background').show()
              $('.preloader-wrapper').show()

              const id = $(this).data('id')

              showSavedClubById(id)
              showSavedFixtureClubById(id)

              document.getElementById('all-club').style.display = 'none'
              document.getElementById('detail-club').style.display = 'block'
          })
        } else if (this.status === 404) {
          content.innerHTML = '<div class="container center">Halaman tidak ditemukan.</div>'
        } else {
          content.innerHTML = '<div class="container center">Ups.. halaman tidak dapat diakses.</div>'
        }
      }
    }
    xhttp.open('GET', '/assets/pages/' + page + '.html', true)
    xhttp.send()
  }
})
