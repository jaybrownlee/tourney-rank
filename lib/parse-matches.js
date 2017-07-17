'use strict'

const readline = require('readline')
const Readable = require('stream').Readable
const Tournament = require('./tournament')

const validLineRegex = new RegExp(/^[a-z ]+ [0-9]+, [a-z ]+ [0-9]+$/i)

function addMatch(tournament, teams, cb) {
  try {
    tournament.addMatch(teams[0], teams[1])
    cb()
  } catch (err) {
    return cb(err)
  }
}

module.exports = function parseMatches(stream, tournament, cb) {
  let lineCount = 0

  if (!(stream instanceof Readable)) {
    const msg = 'stream is required and must an instance of stream.Readable'
    const err = new Error(msg)
    return setImmediate(cb, err)
  }

  if (!(tournament instanceof Tournament)) {
    const msg = 'tournament is required and must an instance of Tournament'
    const err = new Error(msg)
    return setImmediate(cb, err)
  }

  const errors = []
  const lineReader = readline.createInterface({
    input: stream
  })

  lineReader.on('close', () => {
    if (errors.length) {
      const err = new Error('ERROR: unable to process file')
      err.code = 'EINVAL'
      err.errors = errors
      return cb(err)
    }
    cb()
  })

  lineReader.on('line', (input) => {
    lineCount++
    const line = input.trim()

    if (!validLineRegex.test(line)) {
      const msg = `line ${lineCount} - does not match the required format:
        ${line}`
      return errors.push(msg)
    }

    const teams = line.split(',')
    const team1 = parseTeam(teams[0])
    const team2 = parseTeam(teams[1])

    addMatch(tournament, [team1, team2], (err) => {
      if (err) {
        const msg = `line ${lineCount} - ${err.message}:
          ${line}`
        errors.push(msg)
      }
    })
  })
}

function parseTeam(input) {
  const idx = input.lastIndexOf(' ')
  const name = input.slice(0, idx).trim()
  const score = parseInt(input.slice(idx).trim())

  return {
    name: name
  , score: score
  }
}
