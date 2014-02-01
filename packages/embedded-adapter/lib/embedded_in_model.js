/**
  @module ember-data
  @submodule embedded-adapter
**/

/**
  DS.EmbeddedInModel extends the DS.Model adding mixin:
  DS.EmbeddedInModelMixin

  @class EmbeddedInModel
  @constructor
  @namespace DS
  @extends DS.Model
**/
DS.EmbeddedInModel = DS.Model.extend(DS.EmbeddedInModelMixin);
