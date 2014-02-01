(function(Ember, DS) {

var get = Ember.get;

/**
  @module ember-data
  @submodule mixins
**/

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
  }).observes('currentState.stateName')

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
  if (!record || record.toString().indexOf('Promise') > 0) return;
  var kind = relationship.kind;
  if (kind === 'belongsTo') {
    rollback(record);
  } else if (kind === 'hasMany') {
    record.content.forEach(rollback);
  }
}

// Call the model's rollback method
function rollback(model) {
  model.rollback();
}

// Transition related record(s) to dirty state
function transitionRelatedToDirty(relationship, record) {
  if (!record || record.toString().indexOf('Promise') > 0) return;
  var kind = relationship.kind;
  if (kind === 'belongsTo') {
    transitionToDirty(record);
  } else if (kind === 'hasMany') {
    record.content.forEach(transitionToDirty);
  }
}

// Transition record to dirty state
function transitionToDirty(record) {
  record.transitionTo('updated.uncommitted');
}

}(Ember, DS));
