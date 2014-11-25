define(['doa!extend:specs/abstract.mock', 'doa!implement:specs/interface.mock'], {
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

    getAbstractParam: function () {
        'use strict';
        return this.parent.param;
    },

    setParam: function (param) {
        'use strict';
        this.param = param;
    }
});
