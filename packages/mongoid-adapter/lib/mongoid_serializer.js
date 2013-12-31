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
