// JS OOP in four layers...

// Layer 1: basic building blocks--objects

// Object Literals (p.198)
// Object literals allow you to directly create plain objects (direct instances of Object). 
// The following code uses an object literal to assign an object to the variable jane. 
	var jane = {
	    name: 'Jane',
	    describe: function () {
	        return 'Person named '+this.name;  // (1)
	    },  // (2)
	};


// Dot operator (p.199)
	jane.name  // get property `name`-- 'Jane'

	jane.describe  // get property `describe` -- [Function]


// Bracket operator (p.202)
// While the dot operator works with fixed property keys, 
// the bracket operator allows you to refer to a property via an expression.
	var obj = { someProperty: 'abc' };
	obj['some' + 'Property'] // 'abc'
	var propKey = 'someProperty';
	obj[propKey] // 'abc'

	// ...works with methods too...
	var obj = { myMethod: function () { return true } };
	obj['myMethod']() // true

	//...set properties too...
	obj['anotherProperty'] = 'def';
	obj.anotherProperty // 'def'


// Getting and Defining Properties via Descriptors (p.224)
	Object.defineProperty(obj, propKey, propDesc)
	Object.defineProperties(obj, propDescObj)
	Object.getOwnPropertyDescriptor(obj, propKey)
	Object.create(proto, propDescObj?)

	var obj = {};
	Object.defineProperty(obj, 'canBeDeleted', {
	    value: 123,
	    configurable: true
	});
	Object.defineProperty(obj, 'cannotBeDeleted', {
	    value: 456,
	    configurable: false
	});


// Getting and setting the prototype (p.217)
	Object.create(proto, propDescObj?)
	Object.getPrototypeOf(obj)


// Iteration and detection of properties (p.217)
	var obj = { 'not an identifier': 1, prop: 2 };

	Object.keys(obj);  // ["not an identifier", "prop"]
	Object.getOwnPropertyNames(obj);  // ["not an identifier", "prop"]

	Object.prototype.hasOwnProperty.call(obj, propKey) // boolean
	propKey in obj // boolean


// Calling Functions While Setting this: call(), apply(), and bind()
	var jane = {
	    name: 'Jane',
	    sayHelloTo: function (otherName) {
	        'use strict';
	        console.log(this.name+' says hello to '+otherName);
	    }
	};


// Call
	Function.prototype.call(thisValue, arg1?, arg2?, ...)

	// The following three invocations are equivalent:
	jane.sayHelloTo('Tarzan');
	jane.sayHelloTo.call(jane, 'Tarzan');
	var func = jane.sayHelloTo;
	func.call(jane, 'Tarzan');

//Apply
	Function.prototype.apply(thisValue, argArray)

	// The following three invocations are equivalent:
	jane.sayHelloTo('Tarzan');
	jane.sayHelloTo.apply(jane, ['Tarzan']);
	var func = jane.sayHelloTo;
	func.apply(jane, ['Tarzan']);

//Bind
	Function.prototype.bind(thisValue, arg1?, ..., argN?)

	function func() {
	    console.log('this: '+this);
	    console.log('arguments: '+Array.prototype.slice.call(arguments));
	}
	var bound = func.bind('abc', 1, 2);

	bound(3) // this: abc; arguments: 1,2,3

	// The following three invocations of sayHelloTo are all equivalent:
	jane.sayHelloTo('Tarzan');
	var func1 = jane.sayHelloTo.bind(jane);
	func1('Tarzan');
	var func2 = jane.sayHelloTo.bind(jane, 'Tarzan');
	func2();


// How to properly extract a method from an object:
	var counter = {
	    count: 0,
	    inc: function () {
	        this.count++;
	    }
	}

	// Fail...because upon calling as a function, 'this' is global.
		var func = counter.inc;
		func()
		counter.count  // 0

	// Correct...
		var func3 = counter.inc.bind(counter);
		func3()
		counter.count  // 1 it worked!


	// Same applies to callbacks too...

	function callIt(callback) {
    	callback();
	}

	callIt(counter.inc) // TypeError: Cannot read property 'count' of undefined

	// As before, we fix things via bind():
		callIt(counter.inc.bind(counter))
		counter.count  // one more than before




// Layer 2: The prototype relationship between objects--prototype chains

// Creating a new object with a given prototype
Object.create(proto, propDescObj?)

	var PersonProto = {
	    describe: function () {
	        return 'Person named '+this.name;
	    }
	};
	var jane = Object.create(PersonProto, {
	    name: { value: 'Jane', writable: true }
	});

	jane.describe() //'Person named Jane'

// But you frequently just create an empty object and then manually add properties, because descriptors are verbose:
	var jane = Object.create(PersonProto);
	jane.value = 'Jane';


// Read tht prototype of an object:
	Object.getPrototypeOf(obj)

// Checking whether one object a prototype of another one:
	Object.prototype.isPrototypeOf(obj)

	// ex.
	var A = {};
	var B = Object.create(A);
	var C = Object.create(B);
	A.isPrototypeOf(C) // true
	C.isPrototypeOf(A) // false

// Listing Own Property Keys

Object.getOwnPropertyNames(obj) // returns the keys of all own properties of obj.

Object.keys(obj) //returns the keys of all enumerable own properties of obj.


// Checking Whether a Property Exists

	// Returns true if obj has a property whose key is propKey. Inherited properties are included in this test.
	propKey in obj

	// Returns true if the receiver (this) has an own (noninherited) property whose key is propKey.
	Object.prototype.hasOwnProperty(propKey)


// To iterate over property keys:

	// Combine for-in with hasOwnProperty():
	for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        console.log(key);
	    }
	}

	// Combine Object.keys() or Object.getOwnPropertyNames() with forEach() array iteration:
	var obj = { first: 'John', last: 'Doe' };
	// Visit non-inherited enumerable keys
	Object.keys(obj).forEach(function (key) {
	    console.log(key);
	});

	// To iterate over property values or over (key, value) pairs:
	// Iterate over the keys, and use each key to retrieve the corresponding value.



// Copying an Object
	// To create an identical copy of an object, you need to get two things right:
		// 1) The copy must have the same prototype as the original.
		// 2) The copy must have the same properties, with the same attributes as the original.

		// The following function performs such a copy:
		function copyObject(orig) {
		    // 1. copy has same prototype as orig
		    var copy = Object.create(Object.getPrototypeOf(orig));

		    // 2. copy has all of orig’s properties
		    copyOwnPropertiesFrom(copy, orig);

		    return copy;
		}

		// The properties are copied from orig to copy via this function:
		function copyOwnPropertiesFrom(target, source) {
		    Object.getOwnPropertyNames(source)  // (1)
		    .forEach(function(propKey) {  // (2)
		        var desc = Object.getOwnPropertyDescriptor(source, propKey); // (3)
		        Object.defineProperty(target, propKey, desc);  // (4)
		    });
		    return target;
		};

	// Set the prototype:
	Object.create(proto)

	var PersonProto = {
		describe: function() {
			return "Person named " + this.name;
		}
	};
	var jane = Object.create(PersonProto);
	jane.name = "Jane";
	jane.describe() // "Person named Jane"

	// Get the prototype:
	Object.getPrototypeOf(obj)

	Object.getPrototypeOf(jane) === PersonProto //true


// Protecting Objects: it affects the own properties, 
// but not the values of those properties. (p.229)

	// Prevent Extentions: make it impossible to add properties to obj.
	Object.preventExtentions(obj)
	var obj = { foo: 'a' };
	Object.preventExtensions(obj);
	// Now adding a property fails 

	// You check whether an object is extensible via:
	Object.isExtenible(obj)

	// Sealing: prevents extensions and makes all properties “unconfigurable.”
	// You can still change properties but not attributes
	Object.seal(obj)

	// Check whether an object is sealed:
	Object.isSealed

	// Freezing: makes all properties nonwritable and seals obj.
	// obj is not extensible and all properties are read-only.
	Object.freeze(obj)

	// You check whether an object is frozen via:
	Object.isFrozen

	// Other Object methods...
	Object.defineProperties
	Object.getOwnPropertyDescriptor




// Layer 3: Constructors—Factories for Instances
// The objects a constructor creates are called its instances. 
// Such instances have the same structure, consisting of two parts:
// 1. Data is instance-specific and stored in the own properties of the instance objects
// 2. Behavior is shared by all instances—they have a common prototype object with methods.

	// Part 1:
	function Person(name) {
		this.name = name;
	}

	// Part 2: The object in Person.prototype becomes the prototype of all instances of Person. 
	Person.prototype.describe = function () {
		return 'Person named '+this.name;
	};



// The constructor Property of Instances

// By default, each function C contains an instance prototype object C.prototype whose
// property constructor points back to C:
	function C() {}
	C.prototype.constructor === C //true

// Because the constructor property is inherited from the prototype by each instance,
// you can use it to get the constructor of an instance:
   var o = new C();
   o.constructor //function C() {}

// Creating similar objects
// This is how you create a new object, y, that has the same constructor as an existing
// object, x:
	function Constr() {}
	var x = new Constr();
	var y = new x.constructor();
	console.log(y instanceof Constr); // true

// Avoid:
	C.prototype = {
		method1: function (...) { ... },
	};

// Prefer:
	C.prototype.method1 = function (...) { ... };


// The following two are equivalent:
	value instanceof Constr
	Constr.prototype.isPrototypeOf(value)


// Level 4 Inheritance Between Constructors

// Inheriting instance properties.
	// When Sub is invoked via new, its implicit parameter this refers to a fresh instance. It
	// first passes that instance on to Super (1), which adds its instance properties. Afterward,
	// Sub sets up its own instance properties (2,3). The trick is not to invoke Super via new,
	// because that would create a fresh superinstance. Instead, we call Super as a function and
	// hand in the current (sub)instance as the value of this.
	function Sub(prop1, prop2, prop3, prop4) {
		Super.call(this, prop1, prop2); // (1)
		this.prop3 = prop3; // (2)
		this.prop4 = prop4; // (3)
	}

// Inheriting prototype properties.

	// Shared properties such as methods are kept in the instance prototype.
	// The solution is to give Sub.prototype the prototype Super.prototype.
	// This is the code that achieves that:
	Sub.prototype = Object.create(Super.prototype);
	Sub.prototype.constructor = Sub;
	Sub.prototype.methodB = ...;
	Sub.prototype.methodC = ...;

	// Object.create() produces a fresh object whose prototype is Super.prototype. Afterward,
	// we add Sub’s methods.


// Ensuring that instanceof works
	// Every instance of Sub must also be an instance of Super.
	// Similarly, subInstance is also an instance of Super.
	subInstance instanceof Sub
	Sub.prototype.isPrototypeOf(subInstance)
	subInstance instanceof Super
	Super.prototype.isPrototypeOf(subInstance)

// Overriding a method to adapt one of Super’s methods in Sub.
// We override a method in Super.prototype by adding a method with the same name
// to Sub.prototype.methodB
	Sub.prototype.methodB = ...;	

// Making supercalls: if we have overridden one of Super’s methods, we may need to
// call the original method from Sub.

	// 1. Super.prototype: Start your search in Super.prototype, the prototype of Sub.pro
	// totype (the home object of the current method Sub.prototype.methodB).
	// 2. methodB: Look for a method with the name methodB.
	// 3. call(this, ...): Call the method found in the previous step, and maintain the
	// current this.
	Sub.prototype.methodB = function (x, y) {
		var superResult = Super.prototype.methodB.call(this, x, y); // (1)
		return this.prop3 + ' ' + superResult;
	}


// Avoid Hardcoding the Name of the Superconstructor
// Assign the superprototype to a property of Sub:

	Sub._super = Super.prototype;

// Then calling the superconstructor and a supermethod looks as follows:
	function Sub(prop1, prop2, prop3, prop4) {
		Sub._super.constructor.call(this, prop1, prop2);
		this.prop3 = prop3;
		this.prop4 = prop4;
	}
	Sub.prototype.methodB = function (x, y) {
		var superResult = Sub._super.methodB.call(this, x, y);
		return this.prop3 + ' ' + superResult;
	}


// Example: Constructor Inheritance in Use

	function Person(name) {
		this.name = name;
	}

	Person.prototype.describe = function () {
		return 'Person called '+this.name;
	};

	// We now want to create the constructor Employee as a subconstructor of Person. We do
	// so manually, which looks like this:
	function Employee(name, title) {
		Person.call(this, name);
		this.title = title;
	}
	Employee.prototype = Object.create(Person.prototype);
	Employee.prototype.constructor = Employee;
	Employee.prototype.describe = function () {
		return Person.prototype.describe.call(this)+' ('+this.title+')';
	};
	// Here is the interaction:
	var jane = new Employee('Jane', 'CTO');
	jane.describe() // Person called Jane (CTO)
	jane instanceof Employee // true
	jane instanceof Person // true

	// The utility function subclasses() from the previous section makes the code of Employee 
	// slightly simpler and avoids hardcoding the superconstructor Person:
	function copyOwnPropertiesFrom(target, source) {
		Object.getOwnPropertyNames(source) // (1)
		.forEach(function(propKey) { // (2)
		var desc = Object.getOwnPropertyDescriptor(source, propKey); // (3)
		Object.defineProperty(target, propKey, desc); // (4)
		});
		return target;
	};

	function subclasses(SubC, SuperC) {
		var subProto = Object.create(SuperC.prototype);
		// Save `constructor` and, possibly, other methods
		copyOwnPropertiesFrom(subProto, SubC.prototype);
		SubC.prototype = subProto;
		SubC._super = SuperC.prototype;
	};

	function Employee(name, title) {
		Employee._super.constructor.call(this, name);
		this.title = title;
	}

	Employee.prototype.describe = function () {
		return Employee._super.describe.call(this)+' ('+this.title+')';
	};
	subclasses(Employee, Person);

	// Antipattern: The Prototype Is an Instance of the Superconstructor
	// Before ECMAScript 5 and Object.create(), an often-used solution was to create the
	// subprototype by invoking the superconstructor:
	Sub.prototype = new Super(); // Don’t do this
	// This is not recommended, the prototype will have all of Super’s instance properties, 
	// which it has no use for.  It's much better to use Object.create()



	// Rules to determin THIS keyword:

	// 1: Was the function called with 'new'?
	// 2: Was the function called with 'call', 'apply', or 'bind' 
	//    specifying and explicit this?
	// 3: Was the function called via a containing/owning 
	//    object (context)?
	// 4: DEFAULT: global object (except strict mode).



// Arrays

// Array Literal
	var arr = [ 'a', 'b', 'c' ]; // array literal
	arr[0] // get element 0 --> 'a'
	arr[0] = 'x'; // set element 0 --> arr
	arr // [ 'x', 'b', 'c' ]


// Remove and append array elements

	// Array length
	var arr = [ 'a', 'b', 'c' ];
	arr.length // 3
	arr.length = 2; // remove an element
	arr // [ 'a', 'b' ]
	arr[arr.length] = 'd'; // append an element
	arr // [ 'a', 'b', 'd' ]

	// Array push
	var arr = [ 'a', 'b' ];
	arr.push('d') // 3
	arr // [ 'a', 'b', 'd' ]

// Arrays Can Also Have Properties
// Arrays are objects and can have object properties
// although they are not considered array elements:
	var arr = [ 'a', 'b' ];
	arr.foo = 123;
	arr // [ 'a', 'b' ]
	arr.foo // 123

// Creating Arrays
// You create an array via an array literal:
	var myArray = [ 'a', 'b', 'c' ];



// The Array Constructor

// Creating an empty array with a given length
// An empty array with a given length has only holes in it! Thus, it rarely makes sense to
// use this version of the constructor:
	var arr = new Array(2);
	arr.length // 2
	arr // two holes plus trailing comma (ignored!) --> [ , ,]

// Initializing an array with elements (avoid!)
	// This way of invoking Array is similar to an array literal:
	var arr1 = new Array('a', 'b', 'c'); // The same as ['a', 'b', 'c']:
	// The problem is that you can’t create arrays with a single number in them, 
	// because that is interpreted as creating an array whose length is the number:
	new Array(2) // alas, not [ 2 ] --> [ , ,]
	new Array(5.7) // alas, not [ 5.7 ] --> RangeError: Invalid array length
	new Array('abc') // ok --> [ 'abc' ]


// The in Operator and Indices
// The in operator detects whether an object has a property with a given key. But it can
// also be used to determine whether a given element index exists in an array. For example:
	var arr = [ 'a', , 'b' ];
	0 in arr // true
	1 in arr // false
	10 in arr // false


// Deleting Array Elements

	// Delete Operator
	Deleting array elements creates holes (the length property is not updated):
	var arr = [ 'a', 'b' ];
	arr.length // 2
	delete arr[1] // does not update length --> true
	arr // [ 'a', ]
	arr.length // 2

	// Also delete trailing array elements by decreasing an array’s length
	var arr = [ 'a', 'b', 'c' ];
	1 in arr // true
	arr[1] // 'b'
	arr.length = 1;
	arr // [ 'a' ]
	1 in arr // false
	arr[1] // undefined

	// To remove elements without creating holes 
	// (i.e., the indices of subsequent elements are decremented):
	Array.prototype.splice()
	var arr = ['a', 'b', 'c', 'd'];
	arr.splice(1, 2) // returns what has been removed --> [ 'b', 'c' ]
	arr // [ 'a', 'd' ]

	// Clearing arrays
	var arr = [ 'a', 'b', 'c' ];
	arr.length = 0;
	arr // []

	// Creating a new empty array is often faster:
	arr = [];

	// Clearing shared arrays
	// Setting an array’s length to zero affects everybody who shares the array:
	var a1 = [1, 2, 3];
	var a2 = a1;
	a1.length = 0;
	a1 // []
	a2 // []

	// In contrast, assigning an empty array doesn’t:
	var a1 = [1, 2, 3];
	var a2 = a1;
	a1 = [];
	a1 // []
	a2 // [ 1, 2, 3 ]

	// Get rid of holes in arrays
	// apply() turns each hole into an argument whose value is undefined


// Array Prototype Methods

	// Adding and Removing Elements (Destructive)

	Array.prototype.shift()
	// Removes the element at index 0 and returns it. 
	// The indices of subsequent elements are decremented by 1:
	var arr = [ 'a', 'b' ];
	arr.shift() // 'a'
	arr // [ 'b' ]

// Array methods

// http://colintoh.com/blog/5-array-methods-that-you-should-use-today
Array.prototype.indexOf
Array.prototype.lastIndexOf
Array.prototype.every
Array.prototype.some
Array.prototype.forEach
Array.prototype.map
Array.prototype.filter
Array.prototype.reduce
Array.prototype.reduceRight



// Closure 

	// Definition: when a function remembers its lexical scope even
	// even when it's executed outside of its lexica scope.
	// It's created when an inner function is transported outside
	// of the outer function.

	// Recipe 
	// 1) Create your parent function. ex. the checkscope function
	// 2) define some variables in the parents local scope...
	// 		(this can be accessed by the child function)
	//    .ex var innerVar = "local scope"
	// 3) define a function inside the parent function.
	// 		We call this a child.
	//    ex. the innerFunc function
	// 4) return that function from inside the parent function
	//    ex. where it says 'return innerFunc'

	//  Execution
	//  1) run parent function and save to a variable.  
	//     This variable will hold whatever that function RETURNS
	//  2) optional: check what that variable holds as its value. 
  //     (Hint: it should be the inner function)
  //  3) run the inner function.

		var scope = "global scope";
		
		function checkScope() { 
			var scope = 'local scope';

			function innerFunc() {
				return scope;
			};

			return innerFunc;
		};

		// Exectution
		var test = checkScope(); // execution #1
		test; // execution #2
		test(); // execution #3


		// Ex. 2
		function foo() {
			var bar = "bar";

			return function() {
				console.log(bar);
			};
		}
	
		function bam() {
			foo()();
		}

		bam();


		//Ex. 3
		function foo() {
			var bar = "bar";

			function baz() {
				console.log(bar);
			}

			bam(baz);
		}

		function bam(baz) {
			baz();
		}

		foo();


	// Modules

		// Characteristics: 
		// 	1) Must have an outer enclosure function.
		// 	2) Must return at least one reference to inner functions
		//     that have closure over the private scope.

		//  Classic Module Pattern:
				var foo = (function(){
					var o = { bar: "bar"};

					return {
						bar: function(){
							console.log(o.bar);
						};
					};
				})();

				foo.bar();  // "bar"

		// Modified (better) Module Pattern:
		// ** better because the ability to
		// reference/modify the returned object.

				var foo = (function(){
					var publicAPI = {
						bar: function(){
							publicAPI.baz();
						},
						baz: function(){
							console.log('baz');
						}
					};
					return publicAPI;
				})();

				foo.bar();  // "bax"




		// IIFE 