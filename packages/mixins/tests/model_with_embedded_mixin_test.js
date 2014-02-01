var env, store, adapter, serializer;
var get = Ember.get, set = Ember.set, ajax;
var SuperVillain, SecretLab, SecretWeapon, superVillain, secretLab, secretWeapon;

module('mixins - ModelWithEmbeddedMixin', {
  setup: function() {

    DS.EmbeddedAdapter.reopen({
      createRecord: resoveAjaxPromise,
      updateRecord: resoveAjaxPromise,
      deleteRecord: resoveAjaxPromise
    });

    SuperVillain = DS.Model.extend(DS.ModelWithEmbeddedMixin, {
      firstName:       DS.attr('string'),
      lastName:        DS.attr('string'),
      secretLab:       DS.belongsTo('secretLab'),
      secretWeapons:   DS.hasMany('secretWeapon'),

      notifiesEmbedded: ['secretLab', 'secretWeapon']
    });
    SecretLab = DS.Model.extend({
      minionCapacity:  DS.attr('number'),
      vicinity:        DS.attr('string'),
      superVillain:    DS.belongsTo('superVillain')
    });
    SecretWeapon = DS.Model.extend({
      name:            DS.attr('string'),
      superVillain:    DS.belongsTo('superVillain')
    });

    Ember.run.begin();

    env = setupStore({
      adapter:         DS.EmbeddedAdapter,
      serializer:      DS.EmbeddedSerializer,
      superVillain:    SuperVillain,
      secretLab:       SecretLab,
      secretWeapon:    SecretWeapon
    });

    env.container.register('serializer:_embedded', DS.EmbeddedSerializer);
    env.container.register('adapter:_embedded', DS.EmbeddedAdapter);

    env.store.modelFor('superVillain');
    env.store.modelFor('secretLab');
    env.store.modelFor('secretWeapon');

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

function resoveAjaxPromise(store, type, record) {
  var payload = {},
    serializer = store.serializerFor(record.constructor),
    rootKey = serializer.keyForAttribute(type.typeKey);

  payload[rootKey] = record.serialize();
  payload[rootKey].id = record.get('id');
  return Ember.RSVP.resolve(payload);
}

test('A dirty record causes its child (embedded/belongsTo) record to become dirty', function() {
  expect(5);

  env.container.register('adapter:superVillain', DS.EmbeddedAdapter);
  env.container.register('serializer:superVillain', DS.EmbeddedSerializer.extend({
    attrs: {
      secret_weapons: {embedded: 'always'},
      secret_lab: {embedded: 'always'}
    }
  }));

  store.push(SecretWeapon, {
    id: '1',
    name: 'Illudium Q-36 explosive space modulator',
    superVillain: '1'
  });
  store.push(SecretLab, {
    id: '1',
    minionCapacity: 1,
    vicinity: 'Intergalactic Flying Space Saucer',
    superVillain: '1'
  });
  store.push(SuperVillain, {
    id: '1',
    firstName: 'Marvin',
    lastName: 'the Martian',
    secretWeapons: ['1'],
    secretLab: '1'
  });

  store.find('superVillain', '1').then(async(function (superVillain) {
    var secretLab = superVillain.get('secretLab');

    equal(superVillain.get('isDirty'), false, 'superVillain is not dirty');
    equal(secretLab.get('isDirty'), false, 'secretLab is not dirty');

    superVillain.set('lastName', 'the Green Martian');

    equal(superVillain.get('lastName'), 'the Green Martian', 'superVillain has a changed lastName');
    equal(superVillain.get('isDirty'), true, 'superVillain is dirty');
    equal(secretLab.get('isDirty'), true, 'secretLab is dirty');
  }));
});

test('A dirty record causes its children (embedded/hasMany) records to become dirty', function() {
  expect(5);

  env.container.register('adapter:superVillain', DS.EmbeddedAdapter);
  env.container.register('serializer:superVillain', DS.EmbeddedSerializer.extend({
    attrs: {
      secret_weapons: {embedded: 'always'},
      secret_lab: {embedded: 'always'}
    }
  }));

  store.push(SecretWeapon, {
    id: '1',
    name: 'Illudium Q-36 explosive space modulator',
    superVillain: '1'
  });
  store.push(SecretLab, {
    id: '1',
    minionCapacity: 1,
    vicinity: 'Intergalactic Flying Space Saucer',
    superVillain: '1'
  });
  store.push(SuperVillain, {
    id: '1',
    firstName: 'Marvin',
    lastName: 'the Martian',
    secretWeapons: ['1'],
    secretLab: '1'
  });

  store.find('superVillain', '1').then(async(function (superVillain) {
    var secretWeapon = superVillain.get('secretWeapons').toArray().objectAt(0);

    equal(superVillain.get('isDirty'), false, 'superVillain is not dirty');
    equal(secretWeapon.get('isDirty'), false, 'secretWeapon is not dirty');

    superVillain.set('lastName', 'the Green Martian');

    equal(superVillain.get('lastName'), 'the Green Martian', 'superVillain has a changed lastName');
    equal(superVillain.get('isDirty'), true, 'superVillain is dirty');
    equal(secretWeapon.get('isDirty'), true, 'secretLab is dirty');
  }));
});

test('After a record is saved embedded records are rolled back to a save state', function () {
  expect(6);

  env.container.register('adapter:superVillain', DS.EmbeddedAdapter);
  env.container.register('serializer:superVillain', DS.EmbeddedSerializer.extend({
    attrs: {
      secret_weapons: {embedded: 'always'},
      secret_lab: {embedded: 'always'}
    }
  }));

  store.push(SecretWeapon, {
    id: '1',
    name: 'Illudium Q-36 explosive space modulator',
    superVillain: '1'
  });
  store.push(SecretLab, {
    id: '1',
    minionCapacity: 1,
    vicinity: 'Intergalactic Flying Space Saucer',
    superVillain: '1'
  });
  store.push(SuperVillain, {
    id: '1',
    firstName: 'Marvin',
    lastName: 'the Martian',
    secretWeapons: ['1'],
    secretLab: '1'
  });

  store.find('superVillain', '1').then(async(function (superVillain) {
    var secretWeapon = superVillain.get('secretWeapons').toArray().objectAt(0);
    var secretLab = superVillain.get('secretLab');

    superVillain.set('lastName', 'the Green Martian');
    secretLab.set('vicinity', 'Earth');
    secretWeapon.set('name', 'Kaboom');

    equal(superVillain.get('isDirty'), true, 'superVillain is dirty');
    equal(secretWeapon.get('isDirty'), true, 'secretWeapon is dirty');
    equal(secretLab.get('isDirty'), true, 'secretLab is dirty');

    superVillain.save().then(async(function (_superVillain) {
      equal(superVillain.get('isDirty'), false, 'superVillain is not dirty');
      equal(secretWeapon.get('isDirty'), false, 'secretWeapon is not dirty');
      equal(secretLab.get('isDirty'), false, 'secretLab is not dirty');
    }));
  }));
});
