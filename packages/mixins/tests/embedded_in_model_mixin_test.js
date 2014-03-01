var env, store, adapter, serializer;
var get = Ember.get, set = Ember.set;
var SuperVillain, SecretLab, SecretWeapon, superVillain, secretLab, secretWeapon;

module('mixins - EmbeddedInModelMixin', {
  setup: function() {

    SuperVillain = DS.Model.extend({
      firstName:       DS.attr('string'),
      lastName:        DS.attr('string'),
      secretLab:       DS.belongsTo('secretLab'),
      secretWeapons:   DS.hasMany('secretWeapon')
    });
    SecretLab = DS.Model.extend(DS.EmbeddedInModelMixin, {
      minionCapacity:  DS.attr('number'),
      vicinity:        DS.attr('string'),
      superVillain:    DS.belongsTo('superVillain')
    });
    SecretWeapon = DS.Model.extend(DS.EmbeddedInModelMixin, {
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

test('A dirty (embedded/belongsTo) record causes its parent record to become dirty', function() {
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

    stop();
    Ember.run(function () {
      secretLab.set('vicinity', 'Earth');
      start();
    });

    equal(secretLab.get('vicinity'), 'Earth', 'secretLab has a changed vicinity');
    equal(secretLab.get('isDirty'), true, 'secretLab is dirty');
    equal(superVillain.get('isDirty'), true, 'superVillain is dirty');
  }));
});

test('A dirty (embedded/hasMany) record causes its parent record to become dirty', function() {
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

    stop();
    Ember.run(function () {
      secretWeapon.set('name', 'Kaboom');
      start();
    });

    equal(secretWeapon.get('name'), 'Kaboom', 'secretWeapon has a changed name');
    equal(secretWeapon.get('isDirty'), true, 'secretWeapon is dirty');
    equal(superVillain.get('isDirty'), true, 'superVillain is dirty');
  }));
});
