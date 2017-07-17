'use strict'

const tap = require('tap')
const Tournament = require('../../lib/tournament')
const test = tap.test

const TEAM_ERR = /team is required and must be an object/
const NAME_ERR = /team name is required and must be a string/
const SCORE_ERR = /team score is required and must be an unsigned integer/
const DUPLICATE_TEAM_ERR = /a team is playing itself/

test('Tournament', (t) => {
  t.doesNotThrow(() => {
    new Tournament()
  }, 'constructor')

  t.doesNotThrow(() => {
    const team1 = {
      name: 'Tornados'
    , score: 0
    }
    const team2 = {
      name: 'Typhoons'
    , score: 2
    }

    new Tournament().addMatch(team1, team2)
  }, 'tournament.addMatch with valid arguments')

  const tournament = new Tournament()
  t.equal(tournament.matchCount, 0, 'matchCount initialized to 0')
  t.equal(tournament.teamCount, 0, 'teamCount initialized to 0')

  const ERR_CASES = [
    [ null
    , { name: 'Typhoons', score: 2}
    , TEAM_ERR]
  , [ '123'
    , { name: 'Typhoons', score: 2}
    , TEAM_ERR]
  , [ { name: 'Tornados', score: 1}
    , true
    , TEAM_ERR]
  , [ undefined
    , { name: 'Typhoons', score: 2}
    , TEAM_ERR]
  , [ { name: 'Tornados', score: -1}
    , { name: 'Typhoons', score: 2}
    , SCORE_ERR]
  , [ { name: 'Tornados', score: '3'}
    , { name: 'Typhoons', score: 2}
    , SCORE_ERR]
  , [ { name: 'Tornados', score: 3.2}
    , { name: 'Typhoons', score: 3}
    , SCORE_ERR]
  , [ { name: 'Tornados', score: 1}
    , { name: 'Typhoons', score: null}
    , SCORE_ERR]
  , [ { name: 'Tornados', score: true}
    , { name: 'Typhoons', score: 2}
    , SCORE_ERR]
  , [ { name: 'Tornados', score: 1}
    , { name: 'Typhoons', score: {}}
    , SCORE_ERR]
  , [ { name: 'Tornados', score: ''}
    , { name: 'Typhoons', score: 2}
    , SCORE_ERR]
  , [ { name: 'Tornados', score: 1}
    , { name: 'Typhoons', score: undefined}
    , SCORE_ERR]
  , [ { name: 'Tornados1', score: 1}
    , { name: 'Typhoons', score: 2}
    , NAME_ERR]
  , [ { name: 1, score: 1}
    , { name: 'Typhoons', score: 2}
    , NAME_ERR]
  , [ { name: 'Tornados', score: 1}
    , { name: null, score: 2}
    , NAME_ERR]
  , [ { name: 'Tornados', score: 1}
    , { name: true, score: 2}
    , NAME_ERR]
  , [ { name: {}, score: 1}
    , { name: 'Typhoons', score: 2}
    , NAME_ERR]
  , [ { name: 1, score: 1}
    , { name: '', score: 2}
    , NAME_ERR]
  , [ { name: undefined, score: 1}
    , { name: 'Typhoons', score: 2}
    , NAME_ERR]
  , [ { name: 'Typhoons', score: 1}
    , { name: 'Typhoons', score: 2}
    , DUPLICATE_TEAM_ERR]
  ]

  t.test('tournament.addMatch throws if args are invalid', (tt) => {
    let count = 0
    for (const [team1, team2, message] of ERR_CASES) {
      count++
      tt.throws(() => {
        tournament.addMatch(team1, team2)
      }, message, `case ${count}: ${message}`)
    }

    tt.end()
  })

  t.end()
})
