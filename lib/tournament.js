'use strict'

const teamNameRegex = new RegExp(/^[a-z ]+$/i)
const teamScoreRegex = new RegExp(/^[0-9]+$/)
const WIN_POINTS = 3
const DRAW_POINTS = 1

module.exports = class Tournament {
  constructor() {

    this._teams = new Map()
    this._matchCount = 0
  }

  get matchCount() {
    return this._matchCount
  }

  get teamCount() {
    return this._teams.size
  }

  addMatch(team1, team2) {
    this._initializeTeam(team1)
    this._initializeTeam(team2)
    this._matchCount++

    if (team1.name === team2.name) {
      throw new Error('a team is playing itself')
    }

    if (team1.score > team2.score) {
      return this._addPoints(team1.name, WIN_POINTS)
    }

    if (team2.score > team1.score) {
      return this._addPoints(team2.name, WIN_POINTS)
    }

    if (team1.score === team2.score) {
      this._addPoints(team1.name, DRAW_POINTS)
      this._addPoints(team2.name, DRAW_POINTS)
    }
  }

  getRanking() {
    const teams = []

    this._teams.forEach((v, k) => {
      teams.push({
        rank: null
      , name: k
      , points: v
      })
    })

    // Sort teams by total points, then by name when teams are tied.
    const rankedTeams = teams.sort((a, b) => {
      if (a.points === b.points) {
        return a.name > b.name
          ? 1
          : a.name < b.name
            ? -1
            : 0
      }

      return a.points < b.points
        ? 1
        : a.points > b.points
          ? -1
          : 0
    })

    let rank = 1

    // Assign tournament rank for each team.
    for (var i = 0; i < rankedTeams.length; i++) {

      if (i === 0) {
        rankedTeams[i].rank = 1
        continue
      }

      if (rankedTeams[i - 1].points === rankedTeams[i].points) {
        rankedTeams[i].rank = rankedTeams[i - 1].rank
        rank++
        continue
      }

      rankedTeams[i].rank = ++rank
    }

    return rankedTeams
  }

  _addPoints(name, points) {
    this._teams.set(name, this._teams.get(name) + points)
  }

  _initializeTeam(team) {
    if (!team || typeof team !== 'object') {
      throw new TypeError('team is required and must be an object')
    }

    if (!this._isTeamNameValid(team.name)) {
      throw new TypeError('team name is required and must be a string')
    }

    if (!this._isTeamScoreValid(team.score)) {
      const msg = 'team score is required and must be an unsigned integer'
      throw new TypeError(msg)
    }

    if (!this._teams.has(team.name)) {
      this._teams.set(team.name, 0)
    }
  }

  _isTeamScoreValid(val) {
    if (typeof val !== 'number') return false
    return teamScoreRegex.test(val.toString())
  }

  _isTeamNameValid(val) {
    if (typeof val !== 'string') return false
    return teamNameRegex.test(val)
  }
}
