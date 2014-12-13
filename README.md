[![GitHub version](https://badge.fury.io/gh/devoralive%2Fdoa.svg)](http://badge.fury.io/gh/devoralive%2Fdoa) [![Code Climate](https://codeclimate.com/github/devoralive/doa/badges/gpa.svg)](https://codeclimate.com/github/devoralive/doa) [![Build Status](https://travis-ci.org/devoralive/doa.svg?branch=master)](https://travis-ci.org/devoralive/doa) [![Coverage Status](https://img.shields.io/coveralls/devoralive/doa.svg)](https://coveralls.io/r/devoralive/doa)

##Use doa

**Object declaration :**
```Javascript
define({
    /* private param declaration */
    param: 'this param is private',

    /* public param declaration */
    public: {
        publicParam: 'this param is public'
    },

    /* object constructor */
    construct: function (some, params) {

    },

    /* add accessor for your param */
    getParam: function () {
        return this.param;
    },

    setParam: function (param) {
        this.param = param;
    }
});
```

**Object requirement :**
```Javascript
require(['doa!class:your/object'], function (YourObject) {
    var myObjectInstance = new YourObject('contruct', 'params');
});
```

**Interface:**
```Javascript
define(['doa!implement:your/interface'], {
    /* object implementing your/interface */
});
```

**Extend:**
```Javascript
/**
 * Parent class
 */
define({
    param: '',

    setParentParam: function () {
        return this.param;
    }
});
/**
 * Class that extend the abstract class
 */
define(['doa!extend:your/parent'], {
    getParentParam: function () {
        return this.parent.param;
    }
});
```

**Trait:**
```Javascript
define(['doa!trait:your/trait'], {
});
```

###Project installation :

**Install nodejs and npm**

http://nodejs.org/


**Install grunt-cli and bower**

```
npm install -g grunt-cli bower
```

**Install node dependencies**
```
npm install --save-dev
```

**Download bower dependenies**
```
bower install --dev
```

###Grunt commands :
**Checking the code**
```
grunt test
```
**Run only the test with coverage**
```
grunt jasmine:coverage
```
the default jasmine action doesn't work actualy, use only coverage action