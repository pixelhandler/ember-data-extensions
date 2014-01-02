# Extensions for Ember Data

[![Build Status](https://travis-ci.org/pixelhandler/ember-data-extensions.png)](https://travis-ci.org/pixelhandler/ember-data-extensions)


## Packages

The goal of this repository is to share packages as extensions to the Ember Data project.
Specifically: adapters, serializers, mixins for supporting various backend data storage systems.

See the `/dist` directory for built files (ready to download/use).


### embedded-json-adapter

An fork of `activemodel-adapter` with support for embedded `hasMany` and `belongsTo` 
relationships embedded in JSON payloads. 

The `ActiveModelAdapter` is a subclass of the RESTAdapter designed to integrate
with a JSON API that uses an underscored naming convention instead of camelCasing.
It has been designed to work out of the box with the
[active_model_serializers](http://github.com/rails-api/active_model_serializers) Ruby gem

[Mongoid](https://github.com/mongoid/mongoid) supports using `embeds_many` and `embeds_one`
in (Rails) models. Also `has_one` and `has_many` can be used with `ActiveModel::Serializers`. 
There are various embedded options, ids or objects.

Like the ActiveModelAdapter/Serializer the EmbeddedJSONAdapter/Serializer extends the
RESTAdapter/Serializer using a mixin for support of embedded records. See
[proposal on discuss](http://discuss.emberjs.com/t/extend-ds-activemodelserializer-support-for-embedded-objects-belongsto-relationship-using-embeds-one).

**Builds:**

* [embedded-json-adapter.js](dist/embedded-json-adapter.js)
* [embedded-json-adapter.min.js](dist/embedded-json-adapter.min.js)

_Note: `EmbeddedJSONMixin` is included in the build. Embedding objects/arrays 1 level deep
is supported. Thanks to Bradley Priest (and the Ember.js community) for the `ActiveModelAdapter`, which
provides a large portion of support for embedded records in JSON payloads. The embedded-json-adapter
and embedded-json-mixin are forks of the activemodel-adapter package._


### mixins

The 'embedded-json-mixin.js' file can be used independently from the `EmbeddedJSONSerializer`.

**Builds:**

* [embedded-json-mixin.js](dist/embedded-json-mixin.js)
* [embedded-json-mixin.min.js](dist/embedded-json-mixin.min.js)


# Contributing

Below are notes for using this repository to developing extensions for Ember Data.


## Install

`make install` or...

1. Clone this repo
1. `npm install` installs brunch and testem
1. Fetch dependencies - `bower install`


## Build

`make` or...

Build command: `brunch b` creates a file for distribution in the `/dist` directory.

* See brunch docs, [commands](https://github.com/brunch/brunch/blob/stable/docs/commands.md)
* The 'config.js' file is used for the (brunch) build.


### Production Build

`make prod` or...

Build command to create an optimized file: `brunch build --optimize`


## Test

`make test` or...

Run tests with command `testem` (dev) or `testem ci` (uses for Travis build)

* See [testem docs](https://github.com/airportyh/testem)

* Ember Data test helpers copied/adapted from the 
[ember_configuration.js](https://github.com/emberjs/data/blob/master/tests/ember_configuration.js) 
file in the Ember Data project


## Dependencies

Ember.js, jQuery, Handlebars, Ember Data

See the [package.json](package.json)


### Bower

* Bower is used to fetch Ember.js with the command: `bower install`
* Update Ember with command: `bower update`


## Code Quality

`make lint` or...

* `jshint packages/activemodel-adapter/lib/*`
* `jshint packages/activemodel-adapter/tests/*`

Uses JSHint, when using commands to build or test, i.e. `make`, `make prod` or `make test` the jshint check is performed first.


## Documentation

`make doc` or...

* `yuidoc ./packages/activemodel-adapter/lib/* -c yuidoc.json --server` (you can append a port number e.g. `--server 8888`, the default port is 3000)

Docs are generated from source using [yuidoc](https://github.com/yui/yuidoc).

The gh-pages branch of this repo includes the [generated
docs](http://pixelhandler.github.io/ember-data-extensions/)

See the [wiki](./wiki) for notes on usage.


## Development

A recent/current version of Node.js is required for using the build and test tools.


### Troubleshooting

If you have trouble using the default `make install` command perhaps try the following:

You may need to use sudo for the following:

1. `npm install -g bower`
1. `npm install -g testem`
1. `npm install -g brunch`
1. `npm install -g jshint`

Then try:

1. `npm install`
1. `bower install`


### Makefile

Various tasks (targets) for building, testing and continuous integration.

* `make lint`: lints all files in the 'packages' directory w/ jshint
* `make test`: starts `testem` and watches packages for changes to re-run test suites
  * use any local browser: [http://localhost:7357/](http://localhost:7357/)
* `make ci`: Run all tests in w/ output for continuous integration (uses phantomjs)
* `make`: builds packages to '/dist' directory
* `make prod`: builds optimized packages to '/dist' directory
* `make dist`: Build all packages for distribution in '/dist' directory
* `make clean`: empties '/dist' directory
* `make doc`: browse documentation from source code [http://localhost:3333](http://localhost:3333)
* `make docfiles`: generate (html) documentation from source code, use w/ gh-pages branch 


### Config files

* [config.js](config.js) is used by brunch.io build tools
* [testem.json](testem.json) is used for testing w/ both developer and ci modes
* [yuidoc.json](yuidoc.json) is for generating documentation from source code using yuidocjs
* [bower.json](bower.json) is used to install dependencies (Ember.js, etc.)
* [.travis.yml](.travis.yml) is used for continuous integration with [travis-ci.org](https://travis-ci.org/pixelhandler/ember-data-extensions)
* [.jshintrc](.jshintrc) is used for code quality w/ jshint
