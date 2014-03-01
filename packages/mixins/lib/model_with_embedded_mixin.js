(function(Ember, DS) {

/**
  @module ember-data
  @submodule mixins
**/
var get = Ember.get;

var stateName = 'currentState.stateName';

/**
  DS.ModelWithEmbeddedMixin

  @class ModelWithEmbeddedMixin
  @namespace DS
*/
DS.ModelWithEmbeddedMixin = Ember.Mixin.create({

  /**
    Observes state changes and notifies related objects to change state

    When record becomes dirty the embeddedNotifier
    notifies embedded records to transition to dirty state

    When record is saved the embeddedNotifier
    notifies embedded records to rollback to a saved state

    @method embeddedNotifier
  **/
  embeddedNotifier: (function(obj, path) {
    var serializer = this.store.serializerFor(this.constructor),
      config = serializer.get('attrs');

    if (!config) return;
    if (this.get(path) === 'root.loaded.updated.uncommitted') {
      enumerateRelationships.call(this, config, serializer, transitionRelatedToDirty);
    } else if (this.get(path) === 'root.loaded.saved') {
      enumerateRelationships.call(this, config, serializer, rollbackRelated);
    }
  }).observes(stateName)

});

// Check config for embedded flag
function isEmbedded(config) {
  return config && (config.embedded === 'always' || config.embedded === 'load');
}

// Enumerate over relationship objects, check serializer's config
// execute a callback when relationship is embedded
function enumerateRelationships(config, serializer, callback) {
  var relationshipsByName = get(this.constructor, 'relationshipsByName');
  var relationships = relationshipsByName.values;
  for (var relation in relationships) {
    if (!relationships.hasOwnProperty(relation)) continue;
    var key = relationships[relation].key;
    if (!config || !isEmbedded(config[serializer.keyForAttribute(key)])) continue;
    callback(relationships[relation], this.get(key));
  }
}

// Rollback related record
function rollbackRelated(relationship, record) {
  if (!record || isPromise(record)) return;
  var kind = relationship.kind;
  if (kind === 'belongsTo') {
    rollback(record);
  } else if (kind === 'hasMany') {
    record.content.forEach(rollback);
  }
}

function isPromise(record) {
  return typeof record.then === 'function';
}

// Call the model's rollback method
function rollback(model) {
  if (model.get(stateName).match(/saved/) === null) {
    Ember.run(function () {
      model.rollback();
    });
  }
}

// Transition related record(s) to dirty state
function transitionRelatedToDirty(relationship, record) {
  if (!record || isPromise(record)) return;
  var kind = relationship.kind;
  if (kind === 'belongsTo') {
    transitionToDirty(record);
  } else if (kind === 'hasMany') {
    record.content.forEach(transitionToDirty);
  }
}

function transitionToDirty(record) {
  if (isPromise(this)) { return this; }
  if (!record.get('isLoading') && !record.get('isDirty')) {
    dirtyTransition.call(record);
  }
}

function dirtyTransition() {
  var _this = this;
  Ember.run(function () {
    // Transition record to dirty state
    _this.transitionTo('updated.uncommitted');
  });
}

}(Ember, DS));
