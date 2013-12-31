exports.config = {
  paths: {
    public: 'dist',
    watched: [
      'packages/activemodel-adapter/lib',
      'packages/activemodelmongoid-adapter/lib',
      'packages/mixins/lib',
      'packages/mongoid-adapter/lib'
    ]
  },
  files: {
    javascripts: {
      joinTo: {
        // activemodel-adapter
        'activemodel-adapter.js': /^packages\/activemodel-adapter\/lib/,
        'embedded-records-mixin.js': /^packages\/activemodel-adapter\/lib\/system\/embedded_records_mixin\.js$/,

        // activemodelmongoid-adapter
        'activemodelmongoid-adapter.js': /^packages\/activemodelmongoid\-adapter\/lib/,
        'embedded-records-mongoid-mixin.js': /^packages\/activemodelmongoid-adapter\/lib\/embedded_records_mongoid_mixin\.js$/,

        // mixins
        'has-many-embedded-records-mixin.js': /^packages\/mixins\/lib\/has_many_embedded_records_mixin\.js$/,
        'has-one-embedded-records-mixin.js': /^packages\/mixins\/lib\/has_one_embedded_records_mixin\.js$/,

        // mongoid-adapter
        'mongoid-adapter.js': /^packages\/(mixins|mongoid\-adapter)\/lib/
      },
      order: {
        before: [
          // activemodel-adapter
          'packages/activemodel-adapter/lib/system/embedded_records_mixin.js',
          'packages/activemodel-adapter/lib/system/active_model_serializer.js',
          'packages/activemodel-adapter/lib/system/active_model_adapter.js',
          'packages/activemodel-adapter/lib/initializers.js',

          // activemodelmongoid-adapter
          'packages/activemodelmongoid-adapter/lib/embedded_records_mongoid_mixin.js',
          'packages/activemodelmongoid-adapter/lib/active_model_mongoid_serializer.js',
          'packages/activemodelmongoid-adapter/lib/active_model_mongoid_adapter.js',
          'packages/activemodelmongoid-adapter/lib/initializer.js',

          // mixins
          'packages/mixins/lib/has_many_embedded_records_mixin.js',
          'packages/mixins/lib/has_one_embedded_records_mixin.js',

          // mongoid-adapter
          'packages/mongoid-adapter/lib/mongoid_serializer.js',
          'packages/mongoid-adapter/lib/mongoid_adapter.js',
          'packages/mongoid-adapter/lib/initializer.js'
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

            // activemodelmongoid-adapter
            'activemodelmongoid-adapter.min.js': /^packages\/activemodelmongoid\-adapter\/lib/,
            'embedded-records-mongoid-mixin.min.js': /^packages\/activemodelmongoid-adapter\/lib\/embedded_records_mongoid_mixin\.js$/,

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
