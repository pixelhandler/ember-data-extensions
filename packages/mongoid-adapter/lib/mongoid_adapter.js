(function(Ember, DS) {

/**
  @module ember-data
  @submodule mongoid-adapter
**/

/**
  The MongoidAdapter is a subclass of the ActiveModelAdapter

  @class MongoidAdapter
  @constructor
  @namespace DS
  @extends DS.ActiveModelAdapter
**/

DS.MongoidAdapter = DS.ActiveModelAdapter.extend({
  MongoidAdapter: 'mongoid'
});

}(Ember, DS));