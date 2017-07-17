# tourney-rank

Consume soccer tournament match results and output all teams in rank order.

## Installation

#### install globally and link bin as "tourney-rank"
```bash
$ cd tourney-rank
$ npm install -g
```

#### install without global link
```bash
$ cd tourney-rank
$ npm install
```

## Usage

#### read input from stdin
```bash
$ tourney-rank < /path/to/file
```
or
```bash
$ node /bin/cmd.js < /path/to/file
```

#### read input from file
```bash
$ tourney-rank -f /path/to/file
```
or
```bash
$ node /bin/cmd.js -f /path/to/file
```

#### see all options
```bash
$ tourney-rank -h
```
or
```bash
$ node /bin/cmd.js -h
```

## Test

```bash
$ npm test
```

## Author

Jay Brownlee

## License

MIT (See `LICENSE` for more info)
