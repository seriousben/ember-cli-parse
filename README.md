# Ember-cli-parse [![Build Status](https://next.travis-ci.org/seriousben/ember-cli-parse.svg)](https://next.travis-ci.org/seriousben/ember-cli-parse)

Simple wrapper for the `parse` binary.  Allows usage of parse deployment from an ember-cli app with ease.
At the moment this addon only targets static assets, but it could be improved in the future to support
server side deploys as well.

## Usage

### Installation

From within your Ember CLI application run:

```bash
npm install --save-dev ember-cli-parse
```

### Setting up Parse

From within your Ember CLI application run:

```bash
ember generate parse
```

#### Specifying the Parse application

The generator creates a config file in `config/parse.js`. Using it you can configure applications
to be used depending on the given environment. The production environment can automatically be setup
using environment variables.

```bash
export PARSE_APP_NAME="Your Parse App Name"
export PARSE_APP_ID="APP_ID"
export PARSE_MASTER_KEY="MASTER_KEY"
ember parse deploy
```

Or in one line:

```bash
PARSE_APP_NAME="Your Parse App Name" PARSE_APP_ID="APP_ID" PARSE_MASTER_KEY="MASTER_KEY" emer parse deploy
```

### Deploy

```bash
ember parse deploy
```

By default, the `--environment=development` option will be set for the Ember CLI build step. If
you'd like to specify the development environment, you can do so with the following command:

```bash
ember parse deploy --environment=development
```

## Contributing

### Running Tests

* `npm test`

## License

MIT
