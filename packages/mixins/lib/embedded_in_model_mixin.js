(function(Ember, DS) {

/**
  @module ember-data
  @submodule mixins
**/
var stateName = 'currentState.stateName';

/**
  DS.EmbeddedInModelMixin

  @class EmbeddedInModelMixin
  @namespace DS
*/
DS.EmbeddedInModelMixin = Ember.Mixin.create({

  embeddedDirtyTracker: (function(obj, path) {
    if (this.get('isDirty')) {
      var _this = this;
      this.eachRelationship(function (relation) {
        if (typeof this.then === 'function') { return; }
        var record = _this.get(relation);
        if (record && (!record.get('isLoading') && !record.get('isDirty'))) {
          dirtyTransition.call(record);
        }
      });
    }
  }).observes(stateName)

});

function dirtyTransition() {
  var _this = this;
  Ember.run(function () {
    _this.transitionTo('updated.uncommitted');
  });
}

}(Ember, DS));
