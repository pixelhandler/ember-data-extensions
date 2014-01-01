exports.config = {
  paths: {
    'public': 'dist',
    watched: [
      'packages/embedded-json-adapter/lib',
      'packages/mixins/lib'
    ]
  },
  files: {
    javascripts: {
      joinTo: {
        // embedded-json-adapter
        'embedded-json-adapter.js': /(^packages\/embedded\-json\-adapter\/lib|^packages\/mixins\/lib\/embedded_json_mixin\.js$)/,

        // mixins
        'embedded-json-mixin.js': /^packages\/mixins\/lib\/embedded_json_mixin\.js$/
      },
      order: {
        before: [
          // mixins
          'packages/mixins/lib/embedded_json_mixin.js',

          // embedded-json-adapter
          'packages/embedded-json-adapter/lib/embedded_json_serializer.js',
          'packages/embedded-json-adapter/lib/embedded_json_adapter.js',
          'packages/embedded-json-adapter/lib/initializer.js'
        ]
      }
    }
  },
  modules: {
    wrapper: function(path, data) {
      return ["/* ", path, " */", "\n", data, "\n"].join('');
    },
    definition: false,
    addSourceURLs: true
  },
  optimize: false,
  sourceMaps: false,
  overrides: {
    production: {
      optimize: true,
      sourceMaps: false,
      files: {
        javascripts: {
          joinTo: {
            // embedded-json-adapter
            'embedded-json-adapter.min.js': /^packages\/embedded\-json\-adapter\/lib|^packages\/mixins\/lib\/embedded_json_mixin\.js/,

            // mixins
            'embedded-json-mixin.min.js': /^packages\/mixins\/lib\/embedded_json_mixin\.js$/
          }
        }
      }
    }
  }
};
