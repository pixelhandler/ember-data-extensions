YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DS.EmbeddedJSONAdapter",
        "DS.EmbeddedJSONMixin",
        "DS.EmbeddedJSONSerializer"
    ],
    "modules": [
        "embedded-json-adapter",
        "ember-data",
        "mixins"
    ],
    "allModules": [
        {
            "displayName": "embedded-json-adapter",
            "name": "embedded-json-adapter",
            "description": "The `EmbeddedJSONAdapter` is a subclass of the RESTAdapter.\n\nA fork of `activemodel-adapter` with support for embedded `hasMany` and `belongsTo`\nrecords embedded in JSON payloads, designed to work out of the box with the\n[active_model_serializers](http://github.com/rails-api/active_model_serializers) Ruby gem.\n\n[Mongoid](https://github.com/mongoid/mongoid) supports using `embeds_many` and `embeds_one`\nin (Rails) models. Also `has_one` and `has_many` can be used with\n`ActiveModel::Serializers`. Choose an option for embedding ids or object(s).\n\nThis adapter extends the DS.RESTAdapter by making consistent use of the camelization,\ndecamelization and pluralization methods to normalize the serialized JSON into a\nformat that is compatible with a conventional Rails backend and Ember Data.\n\n## JSON Structure\n\nThe EmbeddedJSONAdapter expects the JSON payload from your server to follow\nthe REST adapter conventions substituting underscored keys for camelcased ones.\n\n### Conventional Names\n\nAttribute names in your JSON payload should be the underscored versions of\nthe attributes in your Ember.js models.\n\nFor example, if you have a `Person` model:\n\n```js\nApp.FamousPerson = DS.Model.extend({\n  firstName: DS.attr('string'),\n  lastName: DS.attr('string'),\n  occupation: DS.attr('string')\n});\n```\n\nThe JSON returned should look like this:\n\n```js\n{\n  \"famous_person\": {\n    \"first_name\": \"Barack\",\n    \"last_name\": \"Obama\",\n    \"occupation\": \"President\"\n  }\n}\n```"
        },
        {
            "displayName": "ember-data",
            "name": "ember-data"
        },
        {
            "displayName": "mixins",
            "name": "mixins",
            "description": "The EmbeddedJSONMixin allows you to add embedded record support to your serializers.\n\nTo set up embedded records, you include the mixin into the serializer and then\ndefine your embedded relations. The EmbeddedJSONSerializer is an example.\n\nBelow is an example of a per type serializer (post type).\n\n```js\nApp.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedJSONMixin, {\n  attrs: {\n    author: {embedded: 'always'},\n    comments: {embedded: 'always'}\n  }\n})\n```\n\nCurrently only `{embedded: 'always'}` records are supported."
        }
    ]
} };
});