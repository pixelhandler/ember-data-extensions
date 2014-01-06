/**
  @module ember-data
  @submodule embedded-adapter
**/

/**
  DS.EmbeddedAdapter extends the DS.RESTSerializer adding mixin:
  DS.UnderscoredAdapterMixin

  @class EmbeddedAdapter
  @constructor
  @namespace DS
  @extends DS.RESTAdapter
**/

DS.EmbeddedAdapter = DS.RESTAdapter.extend(
  DS.UnderscoredAdapterMixin,
  { defaultSerializer: '_embedded' }
);

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

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "embeddedAdapter",

    initialize: function(container, application) {
      application.register('serializer:_embedded', DS.EmbeddedSerializer);
      application.register('adapter:_embedded', DS.EmbeddedAdapter);
    }
  });
});
