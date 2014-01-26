(function(Ember, DS) {

var get = Ember.get;
var forEach = Ember.EnumerableUtils.forEach;

/**
  @module ember-data
  @submodule mixins
**/

/**
  DS.EmbeddedMixin supports serializing embedded records.

  To set up embedded records, include the mixin into a serializer then
  define embedded (model) relationships.

  Below is an example of a per type serializer (post type).

  ```js
  App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
    attrs: {
      author: {embedded: 'always'},
      comments: {embedded: 'always'}
    }
  })
  ```

  Currently only `{embedded: 'always'}` records are supported.

  @class EmbeddedMixin
  @namespace DS
*/
DS.EmbeddedMixin = Ember.Mixin.create({

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
    App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
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
    App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
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

    To embed the ids for a related object (using a hasMany relationship):
    ```js
    App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
      attrs: {
        comments: {embedded: 'ids'}
      }
    })
    ```

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "body": "I want this for my ORM, I want that for my template language..."
        "comments": ["1", "2"]
      }
    }
    ```

    @method serializeHasMany
    @param {DS.Model} record
    @param {Object} json
    @param relationship
  */
  serializeHasMany: function(record, json, relationship) {
    var attr = relationship.key, config = this.get('attrs'), key;

    if (!config || (!isEmbedded(config[attr]) && !hasEmbeddedIds(config[attr]))) {
      this._super(record, json, relationship);
      return;
    }
    if (hasEmbeddedIds(config[attr])) {
      key = this.keyForRelationship(attr, relationship.kind);
      json[key] = get(record, attr).mapBy(get(this, 'primaryKey'));
    } else {
      key = this.keyForAttribute(attr);
      json[key] = get(record, attr).map(function(relation) {
        var data = relation.serialize(),
            primaryKey = get(this, 'primaryKey');

        data[primaryKey] = get(relation, primaryKey);
        if (data.id === null) {
          delete data.id;
        }
        return data;
      }, this);
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
  }
});

// checks config for embedded flag
function isEmbedded(config) {
  return config && (config.embedded === 'always' || config.embedded === 'load');
}

// checks config for included ids flag
function hasEmbeddedIds(config) {
  return config && (config.embedded === 'ids');
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
      if (relationship.kind === "hasMany") {
        updatePayloadWithEmbeddedHasMany.call(this, store, key, relationship, payload, partial);
      }
      if (relationship.kind === "belongsTo") {
        updatePayloadWithEmbeddedBelongsTo.call(this, store, key, relationship, payload, partial);
      }
    }
  }, this);
}

// handles embedding for `hasMany` relationship
function updatePayloadWithEmbeddedHasMany(store, primaryType, relationship, payload, partial) {
  var serializer = store.serializerFor(relationship.type.typeKey);
  var primaryKey = get(this, 'primaryKey');
  var attr = relationship.type.typeKey;
  // underscore forces the embedded records to be side loaded.
  // it is needed when main type === relationship.type
  var embeddedTypeKey = '_' + Ember.String.pluralize(attr);
  var expandedKey = this.keyForRelationship(primaryType, relationship.kind);
  var attribute  = this.keyForAttribute(primaryType);
  var ids = [];

  if (!partial[attribute]) {
    return;
  }

  payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];

  forEach(partial[attribute], function(data) {
    var embeddedType = store.modelFor(attr);
    updatePayloadWithEmbedded.call(serializer, store, embeddedType, payload, data);
    ids.push(data[primaryKey]);
    payload[embeddedTypeKey].push(data);
  });

  partial[expandedKey] = ids;
  delete partial[attribute];
}

// handles embedding for `belongsTo` relationship
function updatePayloadWithEmbeddedBelongsTo(store, primaryType, relationship, payload, partial) {
  var attrs = this.get('attrs');

  if (!attrs ||
    !(isEmbedded(attrs[Ember.String.camelize(primaryType)]) || isEmbedded(attrs[primaryType]))) {
    return;
  }
  var attr = relationship.type.typeKey;
  var serializer = store.serializerFor(relationship.type.typeKey);
  var primaryKey = get(serializer, 'primaryKey');
  var embeddedTypeKey = Ember.String.pluralize(attr);
  var expandedKey = serializer.keyForRelationship(primaryType, relationship.kind);
  var attribute = serializer.keyForAttribute(primaryType);

  if (!partial[attribute]) {
    return;
  }
  payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];
  var embeddedType = store.modelFor(relationship.type.typeKey);
  for (var key in partial) {
    if (partial.hasOwnProperty(key) && key.camelize() === attr) {
      updatePayloadWithEmbedded.call(serializer, store, embeddedType, payload, partial[key]);
    }
  }
  partial[expandedKey] = partial[attribute].id;
  // Need to move an embedded `belongsTo` object into a pluralized collection
  payload[embeddedTypeKey].push(partial[attribute]);
  // Need a reference to the parent so relationship works between both `belongsTo` records
  partial[attribute][relationship.parentType.typeKey + '_id'] = partial.id;
  delete partial[attribute];
}

}(Ember, DS));
