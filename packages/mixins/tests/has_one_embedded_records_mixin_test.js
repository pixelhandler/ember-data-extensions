var get = Ember.get, set = Ember.set;
var HomePlanet, league, SuperVillain, superVillain, SecretLab, EvilMinion, Comment, env;

module("mixins - HasOneEmbeddedRecordsMixin", {
  setup: function() {
    Ember.run.begin();
    SuperVillain = DS.Model.extend({
      firstName:     DS.attr('string'),
      lastName:      DS.attr('string'),
      homePlanet:    DS.belongsTo("homePlanet"),
      secretLab:     DS.belongsTo("secretLab"),
      evilMinions:   DS.hasMany("evilMinion")
    });
    HomePlanet = DS.Model.extend({
      name:          DS.attr('string'),
      villains:      DS.hasMany('superVillain')
    });
    SecretLab = DS.Model.extend({
      minionCapacity: DS.attr('number'),
      vicinity:       DS.attr('string'),
      superVillain:   DS.belongsTo('superVillain')
    });
    EvilMinion = DS.Model.extend({
      superVillain: DS.belongsTo('superVillain'),
      name:         DS.attr('string')
    });
    Comment = DS.Model.extend({
      body: DS.attr('string'),
      root: DS.attr('boolean'),
      children: DS.hasMany('comment')
    });
    env = setupStore({
      superVillain:   SuperVillain,
      homePlanet:     HomePlanet,
      secretLab:      SecretLab,
      evilMinion:     EvilMinion,
      comment:        Comment
    });
    env.store.modelFor('superVillain');
    env.store.modelFor('homePlanet');
    env.store.modelFor('secretLab');
    env.store.modelFor('evilMinion');
    env.store.modelFor('comment');
    env.container.register('serializer:application', DS.ActiveModelSerializer.extend(DS.HasOneEmbeddedRecordsMixin));
    env.container.register('serializer:ams',         DS.ActiveModelSerializer.extend(DS.HasOneEmbeddedRecordsMixin));
    env.container.register('adapter:ams',    DS.ActiveModelAdapter);
    env.amsSerializer = env.container.lookup("serializer:ams");
    env.amsAdapter    = env.container.lookup("adapter:ams");
    Ember.run.end();
  },

  teardown: function() {
    Ember.run(function() {
      env.store.destroy();
    });
  }
});

test("extractSingle with embedded object (belongsTo relationship)", function() {
  //expect(4);
  env.container.register('adapter:superVillain', DS.ActiveModelAdapter);
  env.container.register('serializer:superVillain', DS.ActiveModelSerializer.extend(DS.HasOneEmbeddedRecordsMixin, {
    attrs: {
      secretLab: {embedded: 'always'}
    }
  }));

  var serializer = env.container.lookup("serializer:superVillain");

  var json_hash = {
    super_villain: {
      id: "1",
      first_name: "Tom",
      last_name: "Dale",
      home_planet_id: "123",
      evil_minion_ids: ["1", "2", "3"],
      secret_lab: {
        minion_capacity: 5000,
        vicinity: "California, USA",
        id: "101"
      }
    }
  };

  var json = serializer.extractSingle(env.store, SuperVillain, json_hash);

  deepEqual(json, {
    "id": "1",
    "firstName": "Tom",
    "lastName": "Dale",
    "homePlanet": "123",
    "evilMinions": ["1", "2", "3"],
    "secretLab": "101"
  });

  env.store.find("secretLab", 101).then(async(function(secretLab) {
    equal(secretLab.get('id'), '101');
    equal(secretLab.get('minionCapacity'), 5000);
    equal(secretLab.get('vicinity'), 'California, USA');
  }));
});

test("serialize with embedded object (belongsTo relationship)", function() {
  env.container.register('adapter:superVillain', DS.ActiveModelAdapter);
  env.container.register('serializer:superVillain', DS.ActiveModelSerializer.extend(DS.HasOneEmbeddedRecordsMixin, {
    attrs: {
      secretLab: {embedded: 'always'}
    }
  }));
  var serializer = env.container.lookup("serializer:superVillain");

  // records with an id, persisted

  var tom = env.store.createRecord(
    SuperVillain,
    { firstName: "Tom", lastName: "Dale", id: "1",
      secretLab: env.store.createRecord(SecretLab, { minionCapacity: 5000, vicinity: "California, USA", id: "101" }),
      homePlanet: env.store.createRecord(HomePlanet, { name: "Villain League", id: "123" })
    }
  );

  var json = serializer.serialize(tom);
  deepEqual(json, {
    first_name: get(tom, "firstName"),
    last_name: get(tom, "lastName"),
    home_planet_id: get(tom, "homePlanet").get("id"),
    secret_lab: {
      id: get(tom, "secretLab").get("id"),
      minion_capacity: get(tom, "secretLab").get("minionCapacity"),
      vicinity: get(tom, "secretLab").get("vicinity")
    }
  });
});

test("serialize with embedded object (belongsTo relationship, new no id)", function() {
  env.container.register('adapter:superVillain', DS.ActiveModelAdapter);
  env.container.register('serializer:superVillain', DS.ActiveModelSerializer.extend(DS.HasOneEmbeddedRecordsMixin, {
    attrs: {
      secretLab: {embedded: 'always'}
    }
  }));

  var serializer = env.container.lookup("serializer:superVillain");

  // records without ids, new

  var tom = env.store.createRecord(
    SuperVillain,
    { firstName: "Tom", lastName: "Dale",
      secretLab: env.store.createRecord(SecretLab, { minionCapacity: 5000, vicinity: "California, USA" }),
      homePlanet: env.store.createRecord(HomePlanet, { name: "Villain League", id: "123" })
    }
  );

  var json = serializer.serialize(tom);
  deepEqual(json, {
    first_name: get(tom, "firstName"),
    last_name: get(tom, "lastName"),
    home_planet_id: get(tom, "homePlanet").get("id"),
    secret_lab: {
      minion_capacity: get(tom, "secretLab").get("minionCapacity"),
      vicinity: get(tom, "secretLab").get("vicinity")
    }
  });
});

test("when related record is not present, serialize embedded record (with a belongsTo relationship) as null", function() {
  env.container.register('adapter:superVillain', DS.ActiveModelAdapter);
  env.container.register('serializer:superVillain', DS.ActiveModelSerializer.extend(DS.HasOneEmbeddedRecordsMixin, {
    attrs: {
      secretLab: {embedded: 'always'}
    }
  }));
  var serializer = env.container.lookup("serializer:superVillain");

  var tom = env.store.createRecord(
    SuperVillain,
    { firstName: "Tom", lastName: "Dale", id: "1",
      homePlanet: env.store.createRecord(HomePlanet, { name: "Villain League", id: "123" })
    }
  );

  var json = serializer.serialize(tom);
  deepEqual(json, {
    first_name: get(tom, "firstName"),
    last_name: get(tom, "lastName"),
    home_planet_id: get(tom, "homePlanet").get("id"),
    secret_lab: null
  });
});