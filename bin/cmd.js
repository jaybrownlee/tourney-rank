#!/usr/bin/env node

'use strict'

const fs = require('fs')
const nopt = require('nopt')
const path = require('path')
const help = require('help')
const parse = require('../lib/parse-matches')
const Tournament = require('../lib/tournament')
const usage = help()

const knownOpts = {
  file: path
, help: Boolean
, version: Boolean
}
const shortHand = {
  f: ['--file']
, h: ['--help']
, v: ['--version']
}

const options = nopt(knownOpts, shortHand)

if (options.help) {
  return usage()
}

if (options.version) {
  return console.log('tourney-rank', 'v' + require('../package').version)
}

if (options.file) {
  const fileName = options.file
  if (!fileExists(fileName)) {
    return console.error('Unable to find file:', fileName)
  }

  return outputRanking(fs.createReadStream(fileName, 'utf8'))
}

process.stdin.setEncoding('utf8')
return outputRanking(process.stdin)

function outputRanking(stream) {
  const tournament = new Tournament()
  parse(stream, tournament, (err) => {

    if (err) {
      if (err.code === 'EINVAL') {
        console.error(err.message)
        for (var i = 0; i < err.errors.length; i++) {
          console.error(err.errors[i])
        }
        return
      }
      return console.error(err)
    }

    if (!tournament.matchCount) {
      const msg = 'unable to find any tournament matches' +
        '\ncheck the file and try again'
      return console.error(msg)
    }

    const ranking = tournament.getRanking()
    for (var i = 0; i < ranking.length; i++) {
      const r = ranking[i]
      console.log(`${r.rank}. ${r.name} ${r.points}`)
    }
  })
}

function fileExists(filePath) {
  try {
    if (!fs.statSync(filePath).isFile()) {
      return false
    }
  }
  catch (err) {
    return false
  }

  return true
}
