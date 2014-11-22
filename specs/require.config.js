require.config({
    urlArgs: 'cb=' + Math.random(),
    paths: {
        doa: 'src/doa',
        es5shim: 'node_modules/es5-shim'
    },
    shim: {
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});