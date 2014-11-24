# doa

[![GitHub version](https://badge.fury.io/gh/devoralive%2Fdoa.svg)](http://badge.fury.io/gh/devoralive%2Fdoa) [![Code Climate](https://codeclimate.com/github/devoralive/doa/badges/gpa.svg)](https://codeclimate.com/github/devoralive/doa)

JavaScript class library based on requirejs.

##Use doa

**Object declaration :**
```Javascript
define({
	/* private param declaration */
	param: 'this param is private',

	/* public param not implemented yet */
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
require(['doa!object:your/object'], function (YourObject) {
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
define(['doa!extend:your/parent'], {
	/*comming soon not implemented yet */
	getParentParam: function () {
		return this.parent.param;
	}
});
```

**Trait:**
```Javascript
define(['doa!trait:your/trait'], {
	/* comming soon not implemented yet */
});
```