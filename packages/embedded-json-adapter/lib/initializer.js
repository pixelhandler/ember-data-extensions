/**
  @module ember-data
  @submodule embedded-json-adapter
**/
Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "embeddedJSONAdapter",

    initialize: function(container, application) {
      application.register('serializer:embedded_json', DS.EmbeddedJSONSerializer);
      application.register('adapter:embedded_json', DS.EmbeddedJSONAdapter);
    }
  });
});
