'use strict'

const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const tap = require('tap')
const bin = path.join(__dirname, '..', 'bin/cmd.js')
const exec = childProcess.exec
const test = tap.test

const fixtures = path.join(__dirname, 'fixtures')
const EMPTY_FILE_ERROR = 'unable to find any tournament matches' +
  '\ncheck the file and try again'

test('bin script', (t) => {
  t.test('success: with STDIN as source', (tt) => {
    const inputFixture = path.join(fixtures, 'valid-matches-in.txt')
    const outputFixture = path.join(fixtures, 'valid-matches-out.txt')
    const expect = fs.readFileSync(outputFixture, 'utf8')

    exec(`node ${bin} < ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)
      tt.equal(stderr, '', 'STDERR is empty')
      tt.equal(stdout, expect, 'results to STDOUT')
      tt.end()
    })
  })

  t.test('success: with --file argument as source', (tt) => {
    const inputFixture = path.join(fixtures, 'valid-matches-in.txt')
    const outputFixture = path.join(fixtures, 'valid-matches-out.txt')
    const expectedOutput = fs.readFileSync(outputFixture, 'utf8')

    exec(`node ${bin} -f ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)
      tt.equal(stderr, '', 'STDERR is empty')
      tt.equal(stdout, expectedOutput, 'results to STDOUT')
      tt.end()
    })
  })

  t.test('success: with --help argument', (tt) => {
    exec(`node ${bin} --help`, (err, stdout, stderr) => {
      tt.error(err)
      tt.equal(stderr, '', 'STDERR is empty')
      tt.match(stdout, /-h, --help/, 'help arg')
      tt.match(stdout, /-v, --version/, 'version arg')
      tt.match(stdout, /-f, --file/, 'file arg')
      tt.end()
    })
  })

  t.test('success: with --version argument', (tt) => {
    exec(`node ${bin} --version`, (err, stdout, stderr) => {
      tt.error(err)
      tt.equal(stderr, '', 'STDERR is empty')

      const expect = `tourney-rank v${require('../package').version}`
      tt.equal(stdout.trim(), expect, 'results to STDOUT')
      tt.end()
    })
  })

  t.test('fail: empty file on STDIN', (tt) => {
    const inputFixture = path.join(fixtures, 'empty.txt')
    exec(`node ${bin} < ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)
      tt.equal(stderr.trim(), EMPTY_FILE_ERROR, 'err message to STDERR')
      tt.equal(stdout, '', 'STDOUT is empty')
      tt.end()
    })
  })

  t.test('fail: empty file for --file argument', (tt) => {
    const inputFixture = path.join(fixtures, 'empty.txt')
    exec(`node ${bin} < ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)
      tt.equal(stderr.trim(), EMPTY_FILE_ERROR, 'err message to STDERR')
      tt.equal(stdout, '', 'STDOUT is empty')
      tt.end()
    })
  })

  t.test('fail: file not found for --file argument', (tt) => {
    const inputFixture = path.join(fixtures, 'missing-file')
    exec(`node ${bin} -f ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)

      const expect = `Unable to find file: ${inputFixture}`
      tt.equal(stderr.trim(), expect, 'err message to STDERR')
      tt.equal(stdout, '', 'STDOUT is empty')
      tt.end()
    })
  })

  t.test('fail: directory passed for --file argument', (tt) => {
    const inputFixture = path.join(fixtures)
    exec(`node ${bin} -f ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)

      const expect = `Unable to find file: ${inputFixture}`
      tt.equal(stderr.trim(), expect, 'err message to STDERR')
      tt.equal(stdout, '', 'STDOUT is empty')
      tt.end()
    })
  })

  t.test('fail: invalid formatting in file on STDIN', (tt) => {
    const inputFixture = path.join(fixtures, 'invalid-matches-in.txt')
    const outputFixture = path.join(fixtures, 'invalid-matches-out.txt')
    const expectedOutput = fs.readFileSync(outputFixture, 'utf8')

    exec(`node ${bin} < ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)

      tt.equal(stderr.trim(), expectedOutput.trim(), 'err messages to STDERR')
      tt.equal(stdout, '', 'STDOUT is empty')
      tt.end()
    })
  })

  t.test('fail: invalid formatting in file for --file argument', (tt) => {
    const inputFixture = path.join(fixtures, 'invalid-matches-in.txt')
    const outputFixture = path.join(fixtures, 'invalid-matches-out.txt')
    const expectedOutput = fs.readFileSync(outputFixture, 'utf8')

    exec(`node ${bin} -f ${inputFixture}`, (err, stdout, stderr) => {
      tt.error(err)

      tt.equal(stderr.trim(), expectedOutput.trim(), 'err messages to STDERR')
      tt.equal(stdout, '', 'STDOUT is empty')
      tt.end()
    })
  })

  t.end()
})

