define(['doa!implement:specs/interface.mock'], {
    param: undefined,

    paramOnConstruct: '',

    construct: function (param) {
        'use strict';
        this.paramOnConstruct = param;
    },

    getParam: function () {
        'use strict';
        return this.param;
    },

    setParam: function (param) {
        'use strict';
        this.param = param;
    }
});
