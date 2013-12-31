var get = Ember.get, set = Ember.set;
var HomePlanet, league, SuperVillain, superVillain, EvilMinion, YellowMinion, DoomsdayDevice, MediocreVillain, env;

module("mongoid-adapter - MongoidSerializer", {
  setup: function() {
    SuperVillain = DS.Model.extend({
      firstName:     DS.attr('string'),
      lastName:      DS.attr('string'),
      homePlanet:    DS.belongsTo("homePlanet"),
      evilMinions:   DS.hasMany("evilMinion")
    });
    HomePlanet = DS.Model.extend({
      name:          DS.attr('string'),
      superVillains: DS.hasMany('superVillain', {async: true})
    });
    EvilMinion = DS.Model.extend({
      superVillain: DS.belongsTo('superVillain'),
      name:         DS.attr('string')
    });
    YellowMinion = EvilMinion.extend();
    DoomsdayDevice = DS.Model.extend({
      name:         DS.attr('string'),
      evilMinion:   DS.belongsTo('evilMinion', {polymorphic: true})
    });
    MediocreVillain = DS.Model.extend({
      name:         DS.attr('string'),
      evilMinions:  DS.hasMany('evilMinion', {polymorphic: true})
    });
    env = setupStore({
      superVillain:   SuperVillain,
      homePlanet:     HomePlanet,
      evilMinion:     EvilMinion,
      yellowMinion:   YellowMinion,
      doomsdayDevice: DoomsdayDevice,
      mediocreVillain: MediocreVillain
    });
    env.store.modelFor('superVillain');
    env.store.modelFor('homePlanet');
    env.store.modelFor('evilMinion');
    env.store.modelFor('yellowMinion');
    env.store.modelFor('doomsdayDevice');
    env.store.modelFor('mediocreVillain');
    env.container.register('serializer:application', DS.MongoidSerializer);
    env.container.register('serializer:mongoid', DS.MongoidSerializer);
    env.container.register('adapter:mongoid', DS.MongoidAdapter);
    env.mongoidSerializer = env.container.lookup("serializer:mongoid");
    env.mongoidAdapter    = env.container.lookup("adapter:mongoid");
  },

  teardown: function() {
    Ember.run(function() {
      env.store.destroy();
    });
  }
});

test("extractSingle", function() {
  env.container.register('adapter:superVillain', DS.MongoidAdapter);

  var json_hash = {
    home_planet:   {id: "1", name: "Umber", super_villain_ids: [1]},
    super_villains:  [{
      id: "1",
      first_name: "Tom",
      last_name: "Dale",
      home_planet_id: "1"
    }]
  };

  var json = env.mongoidSerializer.extractSingle(env.store, HomePlanet, json_hash);

  deepEqual(json, {
    "id": "1",
    "name": "Umber",
    "superVillains": [1]
  });

  env.store.find("superVillain", 1).then(async(function(minion){
    equal(minion.get('firstName'), "Tom");
  }));
});

test("extractArray", function() {
  env.container.register('adapter:superVillain', DS.MongoidAdapter);

  var json_hash = {
    home_planets: [{id: "1", name: "Umber", super_villain_ids: [1]}],
    super_villains: [{id: "1", first_name: "Tom", last_name: "Dale", home_planet_id: "1"}]
  };

  var array = env.mongoidSerializer.extractArray(env.store, HomePlanet, json_hash);

  deepEqual(array, [{
    "id": "1",
    "name": "Umber",
    "superVillains": [1]
  }]);

  env.store.find("superVillain", 1).then(async(function(minion){
    equal(minion.get('firstName'), "Tom");
  }));
});

test("serialize polymorphic", function() {
  var tom = env.store.createRecord(YellowMinion,   {name: "Alex", id: "124"});
  var ray = env.store.createRecord(DoomsdayDevice, {evilMinion: tom, name: "DeathRay"});

  var json = env.mongoidSerializer.serialize(ray);

  deepEqual(json, {
    name:  "DeathRay",
    _type: "YellowMinion",
    evil_minion_id: "124"
  });
});

test("extractPolymorphic hasMany", function() {
  env.container.register('adapter:yellowMinion', DS.ActiveModelAdapter);
  MediocreVillain.toString   = function() { return "MediocreVillain"; };
  YellowMinion.toString = function() { return "YellowMinion"; };

  var json_hash = {
    mediocre_villain: {id: 1, name: "Dr Horrible", evil_minions: [{ type: "yellow_minion", id: 12}] },
    evil_minions:    [{id: 12, name: "Alex", doomsday_device_ids: [1] }]
  };

  var json = env.mongoidSerializer.extractSingle(env.store, MediocreVillain, json_hash);

  deepEqual(json, {
    "id": 1,
    "name": "Dr Horrible",
    "evilMinions": [{
      type: "yellowMinion",
      id: 12
    }]
  });
});

test("extractPolymorphic", function() {
  env.container.register('adapter:yellowMinion', DS.ActiveModelAdapter);
  EvilMinion.toString   = function() { return "EvilMinion"; };
  YellowMinion.toString = function() { return "YellowMinion"; };

  var json_hash = {
    doomsday_device: {id: 1, name: "DeathRay", evil_minion: { _type: "YellowMinion", id: 12}},
    evil_minions:    [{id: 12, name: "Alex", doomsday_device_ids: [1] }]
  };

  var json = env.mongoidSerializer.extractSingle(env.store, DoomsdayDevice, json_hash);

  deepEqual(json, {
    "id": 1,
    "name": "DeathRay",
    "evilMinion": {
      _type: "YellowMinion",
      id: 12
    }
  });
});

test("extractPolymorphic when the related data is not specified", function() {
  var json = {
    doomsday_device: {id: 1, name: "DeathRay"},
    evil_minions:    [{id: 12, name: "Alex", doomsday_device_ids: [1] }]
  };

  json = env.mongoidSerializer.extractSingle(env.store, DoomsdayDevice, json);

  deepEqual(json, {
    "id": 1,
    "name": "DeathRay",
    "evilMinion": undefined
  });
});

test("extractPolymorphic hasMany when the related data is not specified", function() {
  var json = {
    mediocre_villain: {id: 1, name: "Dr Horrible"}
  };

  json = env.mongoidSerializer.extractSingle(env.store, MediocreVillain, json);

  deepEqual(json, {
    "id": 1,
    "name": "Dr Horrible",
    "evilMinions": undefined
  });
});

test("extractPolymorphic does not break hasMany relationships", function() {
  var json = {
    mediocre_villain: {id: 1, name: "Dr. Evil", evil_minions: []}
  };

  json = env.mongoidSerializer.extractSingle(env.store, MediocreVillain, json);

  deepEqual(json, {
    "id": 1,
    "name": "Dr. Evil",
    "evilMinions": []
  });
});
