/**
  @module ember-data
  @submodule embedded-adapter
**/

/**
  DS.EmbeddedSerializer extends the DS.RESTSerializer adding mixins:
  DS.UnderscoredSerializer, DS.EmbeddedMixin

  @class EmbeddedSerializer
  @constructor
  @namespace DS
  @extends DS.RESTSerializer
**/

DS.EmbeddedSerializer = DS.RESTSerializer.extend(
  DS.UnderscoredSerializer,
  DS.EmbeddedMixin
);
