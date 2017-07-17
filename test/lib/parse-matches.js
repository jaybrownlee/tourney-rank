'use strict'

const stream = require('stream')
const tap = require('tap')
const parseMatches = require('../../lib/parse-matches')
const Tournament = require('../../lib/tournament')
const test = tap.test

const STREAM_ERR = /stream is required and must an instance of stream.Readable/
const TOURNAMENT_ERR =
  /tournament is required and must an instance of Tournament/

test('parseMatches with valid args', (t) => {
  var readable = new stream.Readable()
  const tournament = new Tournament()

  parseMatches(readable, tournament, (err) => {
    t.error(err)
    t.equal(tournament.matchCount, 1, 'matchCount')
    t.equal(tournament.teamCount, 2, 'teamCount')

    const expect =
      [
        { rank: 1, name: 'Falcons', points: 3}
      , { rank: 2, name: 'Snakes', points: 0}
      ]

    t.deepEqual(tournament.getRanking(), expect, 'getRanking')
    t.end()
  })

  readable.push('Falcons 3, Snakes 0\n')
  readable.push(null)
})

test('parseMatches without Readable stream', (t) => {
  parseMatches({}, new Tournament(), (err) => {
    t.type(err, Error, 'error')
    t.match(err.message, STREAM_ERR, 'error message')
    t.end()
  })
})

test('parseMatches without Tournament', (t) => {
  parseMatches(new stream.Readable(), {}, (err) => {
    t.type(err, Error, 'error')
    t.match(err.message, TOURNAMENT_ERR, 'error message')
    t.end()
  })
})
