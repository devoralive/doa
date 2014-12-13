module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        jslint: {
            grunt: {
                src: ['Gruntfile.js'],
                directives: {
                    predef: [
                        'module',
                        'require'
                    ]
                }
            },
            specs: {
                src: ['test/**/*.js'],
                directives: {
                    node: true,
                    nomen: true,
                    predef: [
                        'define',
                        'require',
                        'it',
                        'expect',
                        '__dirname',
                        'describe',
                        'xdescribe',
                        'spyOn',
                        'jasmine',
                        'sessionStorage',
                        'window',
                        'before',
                        'beforeEach',
                        'after',
                        'afterEach',
                        'xit',
                        'xdescribe'
                    ]
                }
            },
            sources: {
                src: ['src/**/*.js'],
                directives: {
                    browser: true,
                    predef: [
                        'define',
                        'require'
                    ]
                }
            }
        },

        jasmine: {
            default: {
                src: 'src/**/*.js',
                options: {
                    specs: 'test/**/*.spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        baseUrl: './',
                        requireConfigFile: 'test/require.config.js'
                    }
                }
            },
            coverage: {
                src: '<%= jasmine.default.src %>',
                options: {
                    specs: '<%= jasmine.default.options.specs %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/json/coverage.json',
                        report: [
                            {type: 'lcov', options: {dir: 'coverage'}},
                            {type: 'text-summary'}
                        ],
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            baseUrl: './',
                            requireConfigFile: 'test/require.config.js'
                        }
                    }
                }
            }
        },
        coveralls: {
            options: {
                src: 'coverage/lcov.info',
                force: true
            }
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */\n' +
                        'require.config({\n' +
                        '    paths: {\n' +
                        '        \'doa/abstract\': \'doa\',\n' +
                        '        \'doa/class\': \'doa\',\n' +
                        '        \'doa/function\': \'doa\',\n' +
                        '        \'doa/interface\': \'doa\',\n' +
                        '        \'doa/trait\': \'doa\',\n' +
                        '    }\n' +
                        '});\n',
                separator: '',
                process: function (src, filepath) {
                    return '\n/* ' + filepath + ' */\n' + src;
                }
            },
            dist: {
                src: ['src/doa.js', 'src/doa/*.js'],
                dest: 'buid/doa.js'
            }
        }
    });


    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('test', ['jshint', 'jslint', 'jasmine:coverage']);
    grunt.registerTask('travis', ['jshint', 'jslint', 'jasmine:coverage', 'coveralls']);
};