YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DS.EmbeddedAdapter",
        "DS.EmbeddedMixin",
        "DS.EmbeddedSerializer",
        "DS.UnderscoredAdapterMixin",
        "DS.UnderscoredSerializer"
    ],
    "modules": [
        "embedded-adapter",
        "ember-data",
        "mixins"
    ],
    "allModules": [
        {
            "displayName": "embedded-adapter",
            "name": "embedded-adapter",
            "description": "DS.EmbeddedAdapter extends the DS.RESTSerializer adding mixin:\nDS.UnderscoredAdapterMixin"
        },
        {
            "displayName": "ember-data",
            "name": "ember-data"
        },
        {
            "displayName": "mixins",
            "name": "mixins",
            "description": "DS.EmbeddedMixin supports serializing embedded records.\n\nTo set up embedded records, include the mixin into a serializer then\ndefine embedded (model) relationships.\n\nBelow is an example of a per type serializer (post type).\n\n```js\nApp.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {\n  attrs: {\n    author: {embedded: 'always'},\n    comments: {embedded: 'always'}\n  }\n})\n```\n\nCurrently only `{embedded: 'always'}` records are supported."
        }
    ]
} };
});