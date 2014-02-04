/* packages/mixins/lib/embedded_in_model_mixin.js */
(function(Ember, DS) {

/**
  @module ember-data
  @submodule mixins
**/

/**
  DS.EmbeddedInModelMixin

  @class EmbeddedInModelMixin
  @namespace DS
*/
DS.EmbeddedInModelMixin = Ember.Mixin.create({

  embeddedDirtyTracker: (function(obj, path) {
    var _this = this;
    if (this.get(path) === 'root.loaded.updated.uncommitted') {
      return this.eachRelationship(function(relation) {
        var _relation;
        _relation = _this.get(relation);
        if ((_relation != null) && _relation.toString().indexOf('Promise') < 0) {
          return _relation.transitionTo('updated.uncommitted');
        }
      });
    }
  }).observes('currentState.stateName')

});

}(Ember, DS));


;