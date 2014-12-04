define(['doa!extend:specs/abstract.mock', 'doa!implement:specs/interface.mock'], {
    param: undefined,

    paramOnConstruct: '',

    public: {
        public_param: 'public param'
    },

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
        return this.parent.abstract_param;
    },

    setParam: function (param) {
        'use strict';
        this.param = param;
    },

    setPublicParam: function (param) {
        'use strict';
        this.public_param = param;
    }
});
