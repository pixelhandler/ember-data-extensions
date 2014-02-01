var env, store, adapter, SuperUser;
var originalAjax, passedUrl, passedVerb, passedHash;

module("mixins - EmbeddedAdapter", {
  setup: function() {
    Ember.run.begin();
    SuperUser = DS.Model.extend();

    env = setupStore({
      superUser: SuperUser,
      adapter: DS.EmbeddedAdapter
    });

    store = env.store;
    adapter = env.adapter;

    passedUrl = passedVerb = passedHash = null;
    Ember.run.end();
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

test('buildURL - decamelizes names', function() {
  equal(adapter.buildURL('superUser', 1), "/super_users/1");
});

test('ajaxError - returns invalid error if 422 response', function() {
  var error = new DS.InvalidError({ name: "can't be blank" });

  var jqXHR = {
    status: 422,
    responseText: JSON.stringify({ errors: { name: "can't be blank" } })
  };

  equal(adapter.ajaxError(jqXHR), error.toString());
});

test('ajaxError - invalid error has camelized keys', function() {
  var error = new DS.InvalidError({ firstName: "can't be blank" });

  var jqXHR = {
    status: 422,
    responseText: JSON.stringify({ errors: { first_name: "can't be blank" } })
  };

  equal(adapter.ajaxError(jqXHR), error.toString());
});

test('ajaxError - returns ajax response if not 422 response', function() {
  var jqXHR = {
    status: 500,
    responseText: "Something went wrong"
  };

  equal(adapter.ajaxError(jqXHR), jqXHR);
});
