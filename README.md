# Extensions for Ember Data

[![Build Status](https://travis-ci.org/pixelhandler/ember-data-extensions.png)](https://travis-ci.org/pixelhandler/ember-data-extensions)


## Packages

The goal of this repository is to share packages as extensions to the Ember Data project.
Specifically: adapters, serializers, mixins for supporting various backend data storage systems.


### activemodel-adapter

`ActiveModelAdapter`, `ActiveModelSerializer`, and `EmbeddedRecordsMixin` are extracted from
[Ember Data's activemodel-adapter package](https://github.com/emberjs/data/tree/master/packages/activemodel-adapter)

The ActiveModelAdapter is a subclass of the RESTAdapter designed to integrate
with a JSON API that uses an underscored naming convention instead of camelCasing.
It has been designed to work out of the box with the
[active_model_serializers](http://github.com/rails-api/active_model_serializers) Ruby gem

See the `/dist` directory for built files (ready to download/use).

* [activemodel-adapter.js](dist/activemodel-adapter.js)
* [activemodel-adapter.min.js](dist/activemodel-adapter.min.js)
* [embedded-records-mixin.js](dist/embedded-records-mixin.js)
* [embedded-records-mixin.min.js](dist/embedded-records-mixin.min.js)

The 'embedded_records_mixin.js' file can be used independently from the ActiveModelSerializer.


### activemodelmongoid-adapter

An extension of `activemodel-adapter` with support for embedded `hasMany` and `belongsTo` 
relationships embedded in JSON payloads. 

Uses both `embeds_many` and `embeds_one` in model classes for persistance with Rails and 
[Mongoid](https://github.com/mongoid/mongoid).

See [proposal on discuss](http://discuss.emberjs.com/t/extend-ds-activemodelserializer-support-for-embedded-objects-belongsto-relationship-using-embeds-one).

* [activemodelmongoid-adapter.js](dist/activemodelmongoid-adapter.js)
* [activemodelmongoid-adapter.min.js](dist/activemodelmongoid-adapter.min.js)
* [embedded-records-mongoid-mixin.js](dist/embedded-records-mongoid-mixin.js)
* [embedded-records-mongoid-mixin.min.js](dist/embedded-records-mongoid-mixin.min.js)


### mixins

Work in progress...

The goal is to break down `EmbeddedRecordsMongoidMixin` into only separate mixins for using
`embeds_one` and `embeds_many` in (rails/mongoid) model classes.

`HasManyEmbeddedRecordsMixin` is based on `EmbeddedRecordsMixin` for use with
[active_model_serializers gem](https://github.com/rails-api/active_model_serializers)

* [has-many-embedded-records-mixin.js](dist/has-many-embedded-records-mixin.js)
* [has-many-embedded-records-mixin.min.js](dist/has-many-embedded-records-mixin.min.js)

`HasOneEmbeddedRecordsMixin` is based on `EmbeddedRecordsMixin` for use with
[Mongoid](https://github.com/mongoid/mongoid)

* [has-one-embedded-records-mixin.js](dist/has-one-embedded-records-mixin.js)
* [has-one-embedded-records-mixin.min.js](dist/has-one-embedded-records-mixin.min.js)


### mongoid-adapter

Work in progress... 

The goal is to break down 'activemodelmongoid-adapter' into only an extension of
'activemodel-adapter'.

The `MongoidAdapter` is a subclass of the ActiveModelAdapter designed to integrate
with [Mongoid](https://github.com/mongoid/mongoid) also using the 
[active_model_serializers](http://github.com/rails-api/active_model_serializers) Ruby gem. Mongoid supports using `embeds_one` when serializing.

* [mongoid-adapter.js](dist/mongoid-adapter.js)
* [mongoid-adapter.min.js](dist/mongoid-adapter.min.js)

Supports embedded records by extending ActiveModelSerializer with mixins: 
`HasOneEmbeddedRecordsMixin` and `HasManyEmbeddedRecordsMixin`.


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


### Ember Data

When using the `make install` command... a copy of 'ember-data.js' is downloaded to the 
'/bower_components/ember-data' directory, which replaces the file fetched via bower. 
This build of Ember data is based on a branch without the activemodel-adapter package <https://github.com/pixelhandler/data/tree/remove-activemodel-adapter>, See 
[ember-data PR #1615](https://github.com/emberjs/data/pull/1615).

The activemodel-adapter.js file can be used with Ember Data beta, or Canary versions. 
Likely there will be a console warning that the `activeModelAdapter` has already been defined.


## Code Quality

`make lint` or...

* `jshint packages/activemodel-adapter/lib/*`
* `jshint packages/activemodel-adapter/tests/*`

Uses JSHint, when using commands to build or test, i.e. `make`, `make prod` or `make test` the jshint check is performed first.


## Documentation

`make doc` or...

* `yuidoc ./packages/activemodel-adapter/lib/* -c yuidoc.json --server` (you can append a port number e.g. `--server 8888`, the default port is 3000)

Docs are generated from source using [yuidoc](https://github.com/yui/yuidoc).


### Development

A recent/current version of Node.js is required for using the build and test tools.

#### Troubleshooting

If you have trouble using the default `make install` command perhaps try the following:

You may need to use sudo for the following:

1. `npm install -g bower`
1. `npm install -g testem`
1. `npm install -g brunch`
1. `npm install -g jshint`

Then try:

1. `npm install`
1. `bower install`
