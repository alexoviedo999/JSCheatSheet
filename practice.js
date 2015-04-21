

$(document).ready(function(){



function AnimalMaker(name) {
  return {   
    speak: function () { 
      console.log("my name is ", name); 
    } 
  }; 
};

var animalNames = ['joe', 'tom', 'paul'];
var farm = [];

var makeAnimmals = function(){
	for(var i=0; i<animalNames.length; i++){
		// var name = animalNames[i];
		farm.push(AnimalMaker(animalNames[i]));
	}
}

var sayName = function(){
	for(var i=0; i<farm.length; i++){
		farm[i].speak();
	}
}



});

