exports.config = {
  paths: {
    'public': 'dist',
    watched: [
      'packages/embedded-adapter/lib',
      'packages/mixins/lib'
    ]
  },
  files: {
    javascripts: {
      joinTo: {
        // embedded-adapter
        'embedded-adapter.js': /(^packages\/embedded\-adapter\/lib|^packages\/mixins\/lib\/(embedded|underscored))/,

        // mixins
        'embedded-mixin.js': /^packages\/mixins\/lib\/embedded_mixin/,
        'underscored-adapter-mixin.js': /^packages\/mixins\/lib\/underscored_adapter/,
        'underscored-serializer-mixin.js': /^packages\/mixins\/lib\/underscored_serializer/
      },
      order: {
        before: [
          // mixins
          'packages/mixins/lib/underscored_adapter_mixin.js',
          'packages/mixins/lib/embedded_mixin.js',
          'packages/mixins/lib/underscored_serializer_mixin.js',

          // embedded-json-adapter
          'packages/embedded-adapter/lib/initializer.js'
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
            'embedded-adapter.min.js': /(^packages\/embedded\-adapter\/lib|^packages\/mixins\/lib\/(embedded|underscored))/,

            // mixins
            'embedded-mixin.min.js': /^packages\/mixins\/lib\/embedded_mixin\.js$/,
            'underscored-adapter-mixin.min.js': /^packages\/mixins\/lib\/underscored_adapter_mixin\.js$/,
            'underscored-serializer-mixin.min.js': /^packages\/mixins\/lib\/underscored_serializer_mixin\.js$/
          }
        }
      }
    }
  }
};
