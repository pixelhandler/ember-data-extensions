# Extensions for Ember Data

[![Build Status](https://travis-ci.org/pixelhandler/ember-data-extensions.png?branch=master)](https://travis-ci.org/pixelhandler/ember-data-extensions)

## Using Bower

For info: `bower info ember-data-extensions`

To install the repo in your projects 'bower_components' directory:

    bower install ember-data-extensions

Use the files in the 'dist' directory.

### Add to your project's bower.json as a dependency:

```
{
  "name": "your project",
  "dependencies": {
    "jquery": "~1.10.2",
    "handlebars": "~1.3.0",
    "ember": "~1.3.1",
    "ember-data": "~1.0.0-beta.6",
    "ember-data-extensions": "~1.0.0-beta.6"
  }
}
```

* See: [Bower.io](http://bower.io)


## Online Docs

* [Generated docs](http://pixelhandler.github.io/ember-data-extensions/docs/)
* [Wiki](https://github.com/pixelhandler/ember-data-extensions/wiki)


## Ember Data compatability

The releases (tags) will follow Ember Data's versions, see the [releases] page

[releases]: https://github.com/pixelhandler/ember-data-extensions/releases

## Packages

The goal of this repository is to share packages as extensions to the Ember Data project.
Specifically: adapters, serializers, mixins for supporting various backend data storage systems.

See the `/dist` directory for built files (ready to download/use).


### embedded-adapter

An fork of `activemodel-adapter` with support for embedded `hasMany` and `belongsTo` 
relationships embedded in JSON payloads. The ActiveModelAdapter and ActiveModelSerializer
were converted to mixins (and extended for supporting embedded belongsTo relationships).

The `ActiveModelAdapter` is a subclass of the RESTAdapter designed to integrate
with a JSON API that uses an underscored naming convention instead of camelCasing.
It has been designed to work out of the box with the
[active_model_serializers](http://github.com/rails-api/active_model_serializers) Ruby gem

[Mongoid](https://github.com/mongoid/mongoid) supports using `embeds_many` and `embeds_one`
in (Rails) models. Also `has_one` and `has_many` can be used with `ActiveModel::Serializers`. 
There are various embedded options, ids or objects.

Like the ActiveModelAdapter/Serializer the EmbeddedAdapter/Serializer extends the
RESTAdapter/Serializer using mixins for supporting embedded records. See
[proposal on discuss](http://discuss.emberjs.com/t/extend-ds-activemodelserializer-support-for-embedded-objects-belongsto-relationship-using-embeds-one).

**Builds:**

* [embedded-adapter.js](dist/embedded-adapter.js)
* [embedded-adapter.min.js](dist/embedded-adapter.min.js)

_Note: `EmbeddedMixin`, `UnderscoredAdapterMixin` and `UnderscoredSerializer` are included
in the build, along with an application initializer (name: `embeddedAdapter`). Thanks to 
Bradley Priest (and the Ember.js community) for the `ActiveModelAdapter`, which provides a
large portion of support for embedded records in JSON payloads. The embedded-json-adapter
and embedded-json-mixin are forks of the activemodel-adapter package._


### mixins

The mixins can be used independently from the `EmbeddedSerializer`.

**[Builds](dist):**

* [embedded-mixin.js](dist/embedded-mixin.js)
* [embedded-mixin.min.js](dist/embedded-mixin.min.js)
* [underscored-adapter-mixin.js](dist/underscored-adapter-mixin.js)
* [underscored-adapter-mixin.min.js](dist/underscored-adapter-mixin.min.js)
* [underscored-serializer-mixin.js](dist/underscored-serializer-mixin.js)
* [underscored-serializer-mixin.min.js](dist/underscored-serializer-mixin.min.js)
* [embedded_in_model_mixin.js](dist/embedded_in_model_mixin.js)
* [embedded_in_model_mixin.min.js](dist/embedded_in_model_mixin.min.js)
* [model_with_embedded_mixin.js](dist/model_with_embedded_mixin.js)
* [model_with_embedded_mixin.min.js](dist/model_with_embedded_mixin.min.js)

See the [embedded-adapter/initializer.js](packages/embedded-adapter/lib/initializer.js)
file as an example implemenation for a custom adapter/serializer based on using mixins
for supporting an API that uses snake_case properties and embedded related objects in
arrays or as plain objects.


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

`make test` or... Run tests with command `testem` (dev) or `testem ci` (uses for Travis build)

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

* `jshint packages/mixins/lib/*`
* `jshint packages/mixins/tests/*`

Uses JSHint, when using commands to build or test, i.e. `make`, `make prod` or `make test`
the jshint check is performed first.


## Code Coverage Report

[Blanket.js](http://blanketjs.org) with grunt a task is used for running code coverage reports
during continuous integration tooling w/ Travis.

To execute reports locally, use `make coverage` or...

    open http://localhost:8080/tests/coverage.html?coverage=true
    python -m SimpleHTTPServer 8080

_the `open` command above works on mac, use <Control-c> to quit_

The coverage report (Blanket.js results) shows a list of files. Click a file to inspect code, 
red lines are not reached when tests execute.

See:

* [blanket.js](http://blanketjs.org)
* [grunt-blanket-qunit](https://github.com/ModelN/grunt-blanket-qunit)


## Continuous Integration (CI)

See [Travis CI report](https://travis-ci.org/pixelhandler/ember-data-extensions)

Use command: `make ci` to execute build and execute tests locally.

Options for CI: `testem ci` or `grunt blanket_qunit --verbose`


## Grunt

The [Gruntfile.js](Gruntfile.js) default task is `blanket_qunit` which exectutes the QUnit
and Blanket.js test reports. The blanket_qunit task has an option for `threshold` which is
the acceptable percentage of code coverage (e.g. 97%).


## Documentation

`make doc` or...

* `yuidoc ./packages/activemodel-adapter/lib/* -c yuidoc.json --server` (you can append a port number e.g. `--server 8888`, the default port is 3000)

Docs are generated from source using [yuidoc](https://github.com/yui/yuidoc).

`make docfiles` is used to generante files for the gh-pages branch of this repo,
**[generated docs](http://pixelhandler.github.io/ember-data-extensions/docs/)**

See the [wiki](https://github.com/pixelhandler/ember-data-extensions/wiki) for notes on usage.


## Development

A recent/current version of Node.js is required for using the build and test tools.

### PhantomJS

Headless testing is done with phantomjs.

NPM can install phantomjs, execute `sudo npm install phantomjs -g`

Or, To install with brew, execute `brew install phantomjs`.

* See: [Homebrew]

[Homebrew]: http://brew.sh

Be sure your executable path resolves to the version of phanomjs you expect to use.


### Troubleshooting

If you have trouble using the default `make install` command perhaps try the following:

You may need to use sudo for the following:

1. `npm install -g bower`
1. `npm install -g testem`
1. `npm install -g brunch`
1. `npm install -g jshint`
1. `npm install -g grunt`
1. `npm install -g grunt-cli`
1. `npm install -g grunt-blanket-qunit --save-dev`

Then try:

1. `npm install`
1. `bower install`


### Makefile

Various tasks (targets) for building, testing and continuous integration.

* `make lint`: lints all files in the 'packages' directory w/ jshint
* `make test`: starts `testem` and watches packages for changes to re-run test suites
  * use any local browser: [http://localhost:7357/](http://localhost:7357/)
* `make coverage`: starts python server with code coverage report, [http://localhost:8080/tests/coverage.html?coverage=true](http://localhost:8080/tests/coverage.html?coverage=true)
* `make ci`: Run all tests in w/ output for continuous integration (uses phantomjs)
* `make`: builds packages to '/dist' directory
* `make prod`: builds optimized packages to '/dist' directory
* `make dist`: Build all packages for distribution in '/dist' directory
* `make clean`: empties '/dist' directory
* `make doc`: browse documentation from source code [http://localhost:3333](http://localhost:3333)
* `make docfiles`: generate (html) documentation from source code, use w/ gh-pages branch 

_See the 'Troubleshooting' section above if you are unable to execute `make ci`_


### Config files

* [config.js](config.js) is used by brunch.io build tools
* [testem.json](testem.json) is used for testing w/ both developer and ci modes
* [Gruntfile.js](Gruntfile.js) supports code coverage/testing tools used with continuous integration
* [yuidoc.json](yuidoc.json) is for generating documentation from source code using yuidocjs
* [bower.json](bower.json) is used to install dependencies (Ember.js, etc.)
* [.travis.yml](.travis.yml) is used for continuous integration with [travis-ci.org](https://travis-ci.org/pixelhandler/ember-data-extensions)
* [.jshintrc](.jshintrc) is used for code quality w/ jshint
