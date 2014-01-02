YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DS.EmbeddedJSONAdapter",
        "DS.EmbeddedJSONMixin",
        "DS.EmbeddedJSONSerializer"
    ],
    "modules": [
        "embedded-json-adapter",
        "ember-data"
    ],
    "allModules": [
        {
            "displayName": "embedded-json-adapter",
            "name": "embedded-json-adapter",
            "description": "The EmbeddedJSONAdapter is a subclass of the RESTAdapter designed to integrate\nwith a JSON API that uses an underscored naming convention instead of camelCasing.\nIt has been designed to work out of the box with the\n[active_model_serializers](http://github.com/rails-api/active_model_serializers)\nRuby gem.\n\nThis adapter extends the DS.RESTAdapter by making consistent use of the camelization,\ndecamelization and pluralization methods to normalize the serialized JSON into a\nformat that is compatible with a conventional Rails backend and Ember Data.\n\n## JSON Structure\n\nThe ActiveModelAdapter expects the JSON returned from your server to follow\nthe REST adapter conventions substituting underscored keys for camelcased ones.\n\n### Conventional Names\n\nAttribute names in your JSON payload should be the underscored versions of\nthe attributes in your Ember.js models.\n\nFor example, if you have a `Person` model:\n\n```js\nApp.FamousPerson = DS.Model.extend({\n  firstName: DS.attr('string'),\n  lastName: DS.attr('string'),\n  occupation: DS.attr('string')\n});\n```\n\nThe JSON returned should look like this:\n\n```js\n{\n  \"famous_person\": {\n    \"first_name\": \"Barack\",\n    \"last_name\": \"Obama\",\n    \"occupation\": \"President\"\n  }\n}\n```"
        },
        {
            "displayName": "ember-data",
            "name": "ember-data"
        }
    ]
} };
});