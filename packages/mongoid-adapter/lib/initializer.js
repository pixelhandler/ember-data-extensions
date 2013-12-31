/**
  @module ember-data
  @submodule mongoid-adapter
**/
Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "mongoidAdapter",

    initialize: function(container, application) {
      application.register('serializer:mongoid', DS.MongoidSerializer);
      application.register('adapter:mongoid', DS.MongoidAdapter);
    }
  });
});