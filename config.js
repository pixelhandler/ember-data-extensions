exports.config = {
  paths: {
    public: 'dist',
    watched: ['packages/mixins/lib', 'packages/mongoid-adapter/lib', 'packages/activemodel-adapter/lib']
  },
  files: {
    javascripts: {
      joinTo: {
        // activemodel-adapter
        'activemodel-adapter.js': /^packages\/activemodel-adapter\/lib/,
        'embedded-records-mixin.js': /^packages\/activemodel-adapter\/lib\/system\/embedded_records_mixin\.js$/,

        // mongoid-adapter
        'mongoid-adapter.js': /^packages\/(mixins|mongoid\-adapter)\/lib/,

        // mixins
        'has-many-embedded-records-mixin.js': /^packages\/mixins\/lib\/has_many_embedded_records_mixin\.js$/,
        'has-one-embedded-records-mixin.js': /^packages\/mixins\/lib\/has_one_embedded_records_mixin\.js$/
      },
      order: {
        before: [
          // activemodel-adapter
          'packages/activemodel-adapter/lib/system/embedded_records_mixin.js',
          'packages/activemodel-adapter/lib/system/active_model_serializer.js',
          'packages/activemodel-adapter/lib/system/active_model_adapter.js',
          'packages/activemodel-adapter/lib/initializers.js',

          // mixins
          'packages/mixins/lib/has_many_embedded_records_mixin.js',
          'packages/mixins/lib/has_one_embedded_records_mixin.js',

          // mongoid-adapter
          'packages/mongoid-adapter/lib/mongoid_serializer.js',
          'packages/mongoid-adapter/lib/mongoid_adapter.js',
          'packages/mongoid-adapter/lib/initializer.js',
        ]
      }
    }
  },
  modules: {
    wrapper: function(path, data) {
      return [
        "/* ", path, " */",
        "\n",
        data,
        "\n\n"
      ].join('');
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
            // activemodel-adapter
            'activemodel-adapter.min.js': /^packages\/activemodel-adapter\/lib/,
            'embedded-records-mixin.min.js': /^packages\/activemodel-adapter\/lib\/system\/embedded_records_mixin\.js$/,

            // mongoid-adapter
            'mongoid-adapter.min.js': /^packages\/(mixins|mongoid\-adapter)\/lib/,

            // mixins
            'has-many-embedded-records-mixin.min.js': /^packages\/mixins\/lib\/has_many_embedded_records_mixin\.js$/,
            'has-one-embedded-records-mixin.min.js': /^packages\/mixins\/lib\/has_one_embedded_records_mixin\.js$/
          }
        }
      }
    }
  }
};
