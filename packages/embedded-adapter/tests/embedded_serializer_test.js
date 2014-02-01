var env, store, adapter, serializer;

module("embedded-adapter - Serializer", {
  setup: function() {
    Ember.run.begin();

    env = setupStore({
      adapter: DS.EmbeddedAdapter,
      serializer: DS.EmbeddedSerializer
    });

    env.container.register('serializer:_embedded', DS.EmbeddedSerializer);
    env.container.register('adapter:_embedded', DS.EmbeddedAdapter);

    store = env.store;
    adapter = env.adapter;
    serializer = env.serializer;

    Ember.run.end();
  },
  teardown: function() {
    Ember.run(function() {
      env.store.destroy();
    });
  }
});

test("serializer is in the container", function() {
  ok(env.container.lookup('serializer:_embedded'), 'Can lookup serializer:_embedded');
});
