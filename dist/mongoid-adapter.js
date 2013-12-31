/* packages/mixins/lib/has_many_embedded_records_mixin.js */
(function(Ember, DS) {

var get = Ember.get;
var forEach = Ember.EnumerableUtils.forEach;

/**
  @module ember-data
  @submodule mixins
**/

/**
  The HasManyEmbeddedRecordsMixin allows you to add embedded record support to your
  serializers.
  To set up embedded records, you include the mixin into the serializer and then
  define your embedded relations.

  ```js
  App.PostSerializer = DS.ActiveModelSerializer.extend(DS.HasManyEmbeddedRecordsMixin, {
    attrs: {
      comments: {embedded: 'always'}
    }
  })
  ```

  Currently only `{embedded: 'always'}` records are supported.

  @class HasManyEmbeddedRecordsMixin
  @namespace DS
*/
DS.HasManyEmbeddedRecordsMixin = Ember.Mixin.create({

  /**
    Serialize `hasMany` relationship when it is configured as embedded objects.

    This example of a post model has many comments:

    ```js
    Post = DS.Model.extend({
      title:    DS.attr('string'),
      body:     DS.attr('string'),
      comments: DS.hasMany('comment')
    });

    Comment = DS.Model.extend({
      body:     DS.attr('string'),
      post:     DS.belongsTo('post')
    });
    ```

    Use a custom (type) serializer for the post model to configure embedded comments

    ```js
    App.PostSerializer = DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
      attrs: {
        comments: {embedded: 'always'}
      }
    })
    ```

    A payload with an attribute configured for embedded records can serialize
    the records together under the root attribute's payload:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "body": "I want this for my ORM, I want that for my template language..."
        "comments": [{
          "id": "1",
          "body": "Rails is unagi"
        }, {
          "id": "2",
          "body": "Omakase O_o"
        }]
      }
    }
    ```

    @method serializeHasMany
    @param {DS.Model} record
    @param {Object} json
    @param relationship
  */
  serializeHasMany: function(record, json, relationship) {
    var attr = relationship.key, config = this.get('attrs');

    if (!config || !isEmbedded(config[attr])) {
      this._super(record, json, relationship);
      return;
    }
    var key = this.keyForAttribute(attr);
    json[key] = get(record, attr).map(function(relation) {
      var data = relation.serialize(),
          primaryKey = get(this, 'primaryKey');

      data[primaryKey] = get(relation, primaryKey);
      if (data.id === null) {
        delete data.id;
      }
      return data;
    }, this);
  },

  /**
    Extract embedded objects in an array when an attr is configured for embedded,
    and add them as side-loaded objects instead.

    A payload with an attr configured for embedded records needs to be extracted:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "comments": [{
          "id": "1",
          "body": "Rails is unagi"
        }, {
          "id": "2",
          "body": "Omakase O_o"
        }]
      }
    }
    ```

    Ember Data is expecting a payload with compound document (side-loaded) like:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "comments": ["1", "2"]
      },
      "comments": [{
        "id": "1",
        "body": "Rails is unagi"
      }, {
        "id": "2",
        "body": "Omakase O_o"
      }]
    }
    ```

    The payload's `comments` attribute represents records in a `hasMany` relationship

    @method extractArray
    @param {DS.Store} store
    @param {subclass of DS.Model} primaryType
    @param {Object} payload
    @return {Array<Object>} The primary array that was returned in response
      to the original query.
  */
  extractArray: function(store, primaryType, payload) {
    var root = this.keyForAttribute(primaryType.typeKey),
        partials = payload[Ember.String.pluralize(root)];

    forEach(partials, function(partial) {
      updatePayloadWithEmbedded.call(this, store, primaryType, payload, partial);
    }, this);

    return this._super(store, primaryType, payload);
  },

  /**
    Extract embedded objects out of the payload for a single object
    and add them as sideloaded objects instead.

    @method extractSingle
    @param {DS.Store} store
    @param {subclass of DS.Model} primaryType
    @param {Object} payload
    @param {String} recordId
    @param {'find'|'createRecord'|'updateRecord'|'deleteRecord'} requestType
    @return Object the primary response to the original request
  */
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var root = this.keyForAttribute(primaryType.typeKey),
        partial = payload[root];

    updatePayloadWithEmbedded.call(this, store, primaryType, payload, partial);

    return this._super(store, primaryType, payload, recordId, requestType);
  }
});

// checks config for embedded flag
function isEmbedded(config) {
  return config && (config.embedded === 'always' || config.embedded === 'load');
}


// chooses a relationship kind to branch which function is used to update payload
// does not change payload if attr is not embedded
function updatePayloadWithEmbedded(store, type, payload, partial) {
  var attrs = get(this, 'attrs');

  if (!attrs) {
    return;
  }
  type.eachRelationship(function(key, relationship) {
    var config = attrs[key];

    if (isEmbedded(config)) {
      if (relationship.kind === "hasMany") {
        updatePayloadWithEmbeddedHasMany.call(this, store, key, relationship, payload, partial);
      }
    }
  }, this);
}

// handles embedding for `hasMany` relationship
function updatePayloadWithEmbeddedHasMany(store, primaryType, relationship, payload, partial) {
  var serializer = store.serializerFor(relationship.type.typeKey),
      primaryKey = get(this, 'primaryKey');

  // underscore forces the embedded records to be side loaded.
  // it is needed when main type === relationship.type
  var embeddedTypeKey = '_' + Ember.String.pluralize(relationship.type.typeKey);
  var expandedKey = this.keyForRelationship(primaryType, relationship.kind);
  var attribute  = this.keyForAttribute(primaryType);
  var ids = [];

  if (!partial[attribute]) {
    return;
  }

  payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];

  forEach(partial[attribute], function(data) {
    var embeddedType = store.modelFor(relationship.type.typeKey);
    updatePayloadWithEmbedded.call(serializer, store, embeddedType, payload, data);
    ids.push(data[primaryKey]);
    payload[embeddedTypeKey].push(data);
  });

  partial[expandedKey] = ids;
  delete partial[attribute];
}

}(Ember, DS));


;/* packages/mixins/lib/has_one_embedded_records_mixin.js */
(function(Ember, DS) {

var get = Ember.get;
var forEach = Ember.EnumerableUtils.forEach;

/**
  @module ember-data
  @submodule mixins
**/

/**
  The HasOneEmbeddedRecordsMixin allows you to add embedded record support to your
  serializers.
  To set up embedded records, you include the mixin into the serializer and then
  define your embedded relations.

  ```js
  App.PostSerializer = DS.ActiveModelSerializer.extend(DS.HasOneEmbeddedRecordsMixin, {
    attrs: {
      author: {embedded: 'always'}
    }
  })
  ```

  Currently only `{embedded: 'always'}` records are supported.

  @class HasOneEmbeddedRecordsMixin
  @namespace DS
*/
DS.HasOneEmbeddedRecordsMixin = Ember.Mixin.create({

  /**
    Serialize `belongsTo` relationship when it is configured as an embedded object.

    This example of an author model belongs to a post model:

    ```js
    Post = DS.Model.extend({
      title:    DS.attr('string'),
      body:     DS.attr('string'),
      author:   DS.belongsTo('author')
    });

    Author = DS.Model.extend({
      name:     DS.attr('string'),
      post:     DS.belongsTo('post')
    });
    ```

    Use a custom (type) serializer for the post model to configure embedded author

    ```js
    App.PostSerializer = DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
      attrs: {
        author: {embedded: 'always'}
      }
    })
    ```

    A payload with an attribute configured for embedded records can serialize
    the records together under the root attribute's payload:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "author": {
          "id": "2"
          "name": "dhh"
        }
      }
    }
    ```

    @method serializeBelongsTo
    @param {DS.Model} record
    @param {Object} json
    @param relationship
  */
  serializeBelongsTo: function(record, json, relationship) {
    var attr = relationship.key, config = this.get('attrs');

    if (!config || !isEmbedded(config[attr])) {
      this._super(record, json, relationship);
      return;
    }
    var key = this.keyForAttribute(attr);
    var embeddedRecord = record.get(attr);
    if (!embeddedRecord) {
      json[key] = null;
    } else {
      json[key] = embeddedRecord.serialize();
      var id = embeddedRecord.get('id');
      if (id) {
        json[key].id = id;
      }
      var parentKey = this.keyForAttribute(relationship.parentType.typeKey);
      if (parentKey) {
        removeId(parentKey, json[key]);
      }
      delete json[key][parentKey];
    }
  },

  /**
    Extract an embedded object from the payload for a single object
    and add the object in the compound document (side-loaded) format instead.

    A payload with an attribute configured for embedded records needs to be extracted:

    ```js
    {
      "post": {
        "id": 1
        "title": "Rails is omakase",
        "author": {
          "id": 2
          "name": "dhh"
        }
        "comments": []
      }
    }
    ```

    Ember Data is expecting a payload with a compound document (side-loaded) like:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "author": "2"
        "comments": []
      },
      "authors": [{
        "id": "2"
        "post": "1"
        "name": "dhh"
      }]
      "comments": []
    }
    ```

    The payload's `author` attribute represents an object with a `belongsTo` relationship.
    The `post` attribute under `author` is the foreign key with the id for the post

    @method extractSingle
    @param {DS.Store} store
    @param {subclass of DS.Model} primaryType
    @param {Object} payload
    @param {String} recordId
    @param {'find'|'createRecord'|'updateRecord'|'deleteRecord'} requestType
    @return Object the primary response to the original request
  */
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var root = this.keyForAttribute(primaryType.typeKey),
        partial = payload[root];

    updatePayloadWithEmbedded.call(this, store, primaryType, payload, partial);

    return this._super(store, primaryType, payload, recordId, requestType);
  }
});

// checks config for embedded flag
function isEmbedded(config) {
  return config && (config.embedded === 'always' || config.embedded === 'load');
}

// used to remove id (foreign key) when embedding
function removeId(key, json) {
  var idKey = key + '_id';
  if (json.hasOwnProperty(idKey)) {
    delete json[idKey];
  }
}

// chooses a relationship kind to branch which function is used to update payload
// does not change payload if attr is not embedded
function updatePayloadWithEmbedded(store, type, payload, partial) {
  var attrs = get(this, 'attrs');

  if (!attrs) {
    return;
  }
  type.eachRelationship(function(key, relationship) {
    var config = attrs[key];

    if (isEmbedded(config)) {
      if (relationship.kind === "belongsTo") {
        updatePayloadWithEmbeddedBelongsTo.call(this, store, key, relationship, payload, partial);
      }
    }
  }, this);
}

// handles embedding for `belongsTo` relationship
function updatePayloadWithEmbeddedBelongsTo(store, primaryType, relationship, payload, partial) {
  var attrs = this.get('attrs');

  if (!attrs ||
    !(isEmbedded(attrs[Ember.String.camelize(primaryType)]) || isEmbedded(attrs[primaryType]))) {
    return;
  }
  var serializer = store.serializerFor(relationship.type.typeKey),
      primaryKey = get(serializer, 'primaryKey'),
      embeddedTypeKey = Ember.String.pluralize(relationship.type.typeKey),
      expandedKey = serializer.keyForRelationship(primaryType, relationship.kind),
      attribute = serializer.keyForAttribute(primaryType);

  if (!partial[attribute]) {
    return;
  }
  payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];
  var embeddedType = store.modelFor(relationship.type.typeKey);
  partial[expandedKey] = partial[attribute].id;
  // Need to move an embedded `belongsTo` object into a pluralized collection
  payload[embeddedTypeKey].push(partial[attribute]);
  // Need a reference to the parent so relationship works between both `belongsTo` records
  partial[attribute][relationship.parentType.typeKey + '_id'] = partial.id;
  delete partial[attribute];
}

}(Ember, DS));


;/* packages/mongoid-adapter/lib/mongoid_serializer.js */
(function(Ember, DS) {

/**
  @module ember-data
  @submodule mongoid-adapter
**/

var get = Ember.get;
var forEach = Ember.EnumerableUtils.forEach;
var hasManyMixin = DS.HasManyEmbeddedRecordsMixin;
var hasOneMixin = DS.HasOneEmbeddedRecordsMixin;

/**
  The MongoidSerializer is a subclass of the ActiveModelSerializer.

  @class MongoidSerializer
  @constructor
  @namespace DS
  @extends DS.ActiveModelSerializer
**/
DS.MongoidSerializer = DS.ActiveModelSerializer.extend(hasManyMixin, hasOneMixin, {

  /**
    Serializes a polymorphic type as a fully capitalized model name.

    @method serializePolymorphicType
    @param {DS.Model} record
    @param {Object} json
    @param relationship
  */
  serializePolymorphicType: function(record, json, relationship) {
    var key = relationship.key,
        belongsTo = get(record, key);
    if (belongsTo) {
      key = this.keyForAttribute(key);
      json["_type"] = Ember.String.capitalize(belongsTo.constructor.typeKey);
    }
  }

});

}(Ember, DS));



;/* packages/mongoid-adapter/lib/mongoid_adapter.js */
(function(Ember, DS) {

/**
  @module ember-data
  @submodule mongoid-adapter
**/

/**
  The MongoidAdapter is a subclass of the ActiveModelAdapter

  @class MongoidAdapter
  @constructor
  @namespace DS
  @extends DS.ActiveModelAdapter
**/

DS.MongoidAdapter = DS.ActiveModelAdapter.extend({
  MongoidAdapter: 'mongoid'
});

}(Ember, DS));


;/* packages/mongoid-adapter/lib/initializer.js */
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


;