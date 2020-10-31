/* eslint-disable no-undef */
const BASE_URL = 'https://api.football-data.org/v2/'
const API_KEY = '5b065c8137e243efa6877bd22365d590'
const LEAGUE_ID = 2021

const ENDPOINT_STANDINGS = `${BASE_URL}competitions/${LEAGUE_ID}/standings`
const ENDPOINT_FIXTURES = `${BASE_URL}competitions/${LEAGUE_ID}/matches?matchday=`
const ENDPOINT_CLUBS = `${BASE_URL}competitions/${LEAGUE_ID}/teams`

const fetchAPI = async url => {
  return await fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  })
    .then(res => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return Promise.reject(new Error(res.statusText))
      } else {
        return Promise.resolve(res)
      }
    })
    .then(res => res.json())
    .catch(err => {
      console.log(err)
    })
}
