/* packages/mixins/lib/underscored_adapter_mixin.js */
(function(Ember, DS) {

/**
  @module ember-data
  @submodule mixins
**/

/**
  The `UnderscoredAdapterMixin` is intended use when creating a subclass of the
  DS.RESTAdapter.

  Based on `activemodel-adapter` package, supports `hasMany` and `belongsTo`
  records embedded in JSON payloads, designed to work out of the box with the
  [active_model_serializers](http://github.com/rails-api/active_model_serializers)
  Ruby gem.

  [Mongoid](https://github.com/mongoid/mongoid) supports using `embeds_many` and
  `embeds_one` in (Rails) models. Also `has_one` and `has_many` can be used with
  `ActiveModel::Serializers`. Choose an option for embedding ids or object(s).

  Use to create an adapter based on the DS.RESTAdapter by making consistent use of
  the camelization, decamelization and pluralization methods to normalize the
  serialized JSON into a format that is compatible with a conventional Rails backend
  and Ember Data.

  ## JSON Structure

  The UnderscoredAdapterMixin expects the JSON payload from your server to follow
  the REST adapter conventions substituting underscored keys for camelCased ones.

  ### Conventional Names

  Attribute names in your JSON payload should be the underscored versions of
  the attributes in your Ember.js models.

  For example, if you have a `Person` model:

  ```js
  App.FamousPerson = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    occupation: DS.attr('string')
  });
  ```

  The JSON returned should look like this:

  ```js
  {
    "famous_person": {
      "first_name": "Barack",
      "last_name": "Obama",
      "occupation": "President"
    }
  }
  ```

  @class UnderscoredAdapterMixin
  @constructor
  @namespace DS
**/

DS.UnderscoredAdapterMixin = Ember.Mixin.create({
  /**
    The UnderscoredAdapterMixin overrides the `pathForType` method to build
    underscored URLs by decamelizing and pluralizing the object type name.

    ```js
      this.pathForType("famousPerson");
      //=> "famous_people"
    ```

    @method pathForType
    @param {String} type
    @return String
  */
  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    return Ember.String.pluralize(decamelized);
  }
});

}(Ember, DS));


;