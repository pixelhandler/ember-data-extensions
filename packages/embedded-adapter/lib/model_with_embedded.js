/**
  @module ember-data
  @submodule embedded-adapter
**/

/**
  DS.ModelWithEmbedded extends the DS.Model adding mixin:
  DS.ModelWithEmbeddedMixin

  @class ModelWithEmbedded
  @constructor
  @namespace DS
  @extends DS.Model
**/
DS.ModelWithEmbedded = DS.Model.extend(DS.ModelWithEmbeddedMixin);
