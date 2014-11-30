# Ember-cli-parse

Simple wrapper for the `parse-cli` package.  Allows usage of divshot deployment from an ember-cli app with ease.

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

### Deploy

```bash
ember parse push
```

By default, the `--environment=production` option will be set for the Ember CLI build step. If
you'd like to specify the development environment, you can do so with the following command:

```bash
ember parse push --environment=development
```

#### Specifying the Parse environmnet

The default Parse environment is `development`, however you can push directly to staging:

```bash
ember parse push staging
```

Or production:

```bash
ember parse push production
```

## Contributing

### Running Tests

* `npm test`

## License

MIT
