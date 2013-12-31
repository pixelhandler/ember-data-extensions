/**
  @module ember-data
  @submodule activemodel-adapter
**/
Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "activeModelMongoidAdapter",

    initialize: function(container, application) {
      application.register('serializer:ams_mongoid', DS.ActiveModelMongoidSerializer);
      application.register('adapter:ams_mongoid', DS.ActiveModelMongoidAdapter);
    }
  });
});