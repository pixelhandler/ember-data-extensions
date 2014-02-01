/**
  @module ember-data
  @submodule embedded-adapter
**/

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "embeddedAdapter",

    initialize: function(container, application) {
      application.register('serializer:_embedded', DS.EmbeddedSerializer);
      application.register('adapter:_embedded', DS.EmbeddedAdapter);
    }
  });
});
