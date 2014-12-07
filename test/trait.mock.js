define({
    sayHello: function () {
        'use strict';
        return 'Hello ' + this.param;
    },

    sayHelloFunction: function () {
        'use strict';
        return 'Hello ' + this.getParam();
    }
});