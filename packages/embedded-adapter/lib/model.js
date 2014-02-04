/*
DS.ModelEmbedded = DS.Model.extend({

  embeddedDirtyTracker: function (obj, path) {
    if (this.get(path) === 'root.loaded.updated.uncommitted') {
      this._eachRelationshipNotPromised(this._relationDirtyTransition, true);
    }
  }.observes('currentState.stateName'),

  embeddedDirtyNotifier: function (obj, path) {
    if (this.get(path) === 'root.loaded.saved') {
      this._eachRelationshipNotPromised(this._relationContentRollback, true);
    }
  }.observes('currentState.stateName'),

  save: function () {
    return this._super().then(function (model) {
      model._eachRelationshipNotPromised(model._relationContentRollback);
    });
  },

  _eachRelationshipNotPromised: function (callback, subclassesOnly) {
    var _this = this;
    this.eachRelationship(function (relation) {
      var _relation = _this.get(relation);
      // TODO check w/ detectInstance?
      if ((_relation != null) && _relation.toString().indexOf('Promise') < 0) {
        if (subclassesOnly) {
          if (DS.ModelEmbedded.detectInstance(_relation)) {
            callback.call(_this, _relation);
          }
        } else {
          callback.call(_this, _relation);
        }
      }
    });
  },

  _relationDirtyTransition: function (relation) {
    relation.transitionTo('updated.uncommitted');
  },

  _relationContentRollback: function (relation) {
    relation.content.forEach(function (item) {
      item.rollback();
    });
  }
});
*/
