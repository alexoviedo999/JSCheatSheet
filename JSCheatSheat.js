// Javascript Study Guide/Cheatsheet 
	// Distilled from JSAll.js


// Arrays

// Array Literal
	var arr = [ 'a', 'b', 'c' ]; // array literal
	arr[0] // get element 0 --> 'a'
	arr[0] = 'x'; // set element 0 --> arr
	arr // [ 'x', 'b', 'c' ]


// Creating Arrays
// You create an array via an array literal:
	var myArray = [ 'a', 'b', 'c' ];


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

	// Remove the element at index 0 and return it.
	Array.prototype.shift()
	// The indices of subsequent elements are decremented by 1:
	var arr = [ 'a', 'b' ];
	arr.shift() // 'a'
	arr // [ 'b' ]

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




// Rules to determin THIS keyword:

	// THIS always references an object.
	// THIS is set by the call site.

	// Order of precidence for setting THIS:
	// 1: Was the function called with 'new'? If so use that object.
	//		The 'new' keyword turns a function call into a constructor call.
	//    There are four things that occur when the 'new' keyword is put in front
	//		of a function call:
	//		1) A brand new object will be created
	//    2) The new object gets linked to another object via the prototype.
	//		3) The new object's 'THIS' gets bound for the purposed of that function call.
	//		4) If that function does not otherwise return anything then it will implicitly 
	//			 insert a 'return THIS'.
	// 2: Explicit Binding Rule: Was the function called with 'call', 'apply', or 'bind' 
	//    specifying and explicit this? If so use that object.
	// 3: Implicit Binding Rule: Was the function called via a containing/owning 
	//    object (context)? If so use that object.
	// 4: DEFAULT: global object (except strict mode, 
	// in which case it will be 'undefined').

		// Ex.

		function foo() {
			console.log(this.bar);
		};

		var bar = "bar1";
		var o2 = { bar: "bar2", foo: foo };
		var o3 = { bar: "bar3", foo: foo };
		var o4 = { bar: "bar4" }

		foo(); 				// #4: "bar1"
		o2.foo(); 		// #3 "bar2"
		o3.foo(); 		// #3 "bar3"
		foo.call(o4); // #2 "bar4"




// Scope

	// Javascript has lexical scope, which means "compile-time" scope.
	// Create new scope with functions, catch blocks, 
	// and ES6: curly braces with 'let'. 



// Hoisting

	// Function declarations ( function(){...} ) get hoisted to the top.
	// Variables get hoisted under function declarations (left side only).
	// Function expressions ( var a = function() {...} ) do not get hoisted.



// Closure 

	// Definition: when a function remembers its lexical scope even
	// even when it's executed outside of its lexica scope.
	// Closure is created when an inner function is transported outside
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



// Objects

// A condtructor makes an object LINKED TO its own prototype.

// Prototype linking happens in two ways:
//	1) Through the second step of the 'new' keyword
//  2) Through Objec.create()

// 3 ways to find out where an object's prototype points to:

		ai.__proto__;
		Object.getPrototypeOf(a1);
		a1.constructor.prototype;

// Ex 1
	
	function Foo(who) {
		this.me = who;
	}

	Foo.prototype.identify = function() {
		return "I am " + this.me;
	};

	function Bar(who) {
		Foo.call(this, who);
	}

	// Bar.prototype = new Foo() is also a way but it also 
	// calls Foo and adds the this.me property from Foo. 
	// Or...
	Bar.prototype = Object.create(Foo.prototype);
	// Object.create() does the first two steps that the "new" 
	// keywords does: 1) Create a new object, 2) link it.


	Bar.prototype.speak = function() {
		alert("Hello, " + this.identify() + ".");
	};

	var b1 = new Bar("b1");
	var b2 = new Bar("b2");

	b1.speak(); // alerts: 'Hello , Iam b1'
	b2.speak(); // alerts: 'Hello , Iam b2'

	// b1 linked --> Bar.prototype linked --> Foo.prototype



















		















