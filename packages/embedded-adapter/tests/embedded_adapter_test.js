var env, store, adapter, serializer;
var passedUrl, passedVerb, passedHash;

module("embedded-adapter - Adapter", {
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

function ajaxResponse(value) {
  adapter.ajax = function(url, verb, hash) {
    passedUrl = url;
    passedVerb = verb;
    passedHash = hash;

    return Ember.RSVP.resolve(value);
  };
}

test("adapter is in the container", function() {
  ok(env.container.lookup('adapter:_embedded'), 'Can lookup adapter:_embedded');
});

test('ajaxError - returns invalid error if 422 response', function() {
  expect(1);
  var actualError, expectedError = new DS.InvalidError({ name: "can't be blank" });

  var jqXHR = {
    status: 422,
    responseText: JSON.stringify({ errors: { name: "can't be blank" } })
  };

  Ember.run(function () {
    actualError = adapter.ajaxError(jqXHR);
    equal(actualError, expectedError.toString(), '422 Error handled by adapter ajaxError method');
  });

});

test('ajaxError - returns invalid error if 404 response', function() {
  expect(1);
  var actualError, expectedError = new DS.InvalidError({ '404': 'Not Found' });

  var jqXHR = {
    status: 404,
    responseText: ''
  };

  Ember.run(function () {
    actualError = adapter.ajaxError(jqXHR);
    equal(actualError.errors.toString(), expectedError.errors.toString(), 'DS.InvalidError with 404 created with jqXHR.status-404');
  });

});

test('ajaxError - invalid error has camelized keys', function() {
  expect(1);
  var actualError, expectedError = new DS.InvalidError({ firstName: "can't be blank" });

  var jqXHR = {
    status: 422,
    responseText: JSON.stringify({ errors: { first_name: "can't be blank" } })
  };

  Ember.run(function () {
    actualError = adapter.ajaxError(jqXHR);
    equal(actualError, expectedError.toString(), '422 error has camelized keys');
  });
});

test('ajaxError - returns ajax response if not 404/422 response (e.g. 500)', function() {
  expect(1);
  var actualError;
  var jqXHR = {
    status: 500,
    responseText: "Something went wrong"
  };

  Ember.run(function () {
    actualError = adapter.ajaxError(jqXHR);
    equal(actualError, jqXHR, 'ajaxError returned jqXHR object given 500 status');
  });
});
