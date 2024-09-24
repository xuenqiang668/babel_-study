(function () {
    'use strict';
  
    const arrowFunction = () => {
      console.log('Hello My name is 19Qingfeng');
    };
  
    arrowFunction();
  })();
  
  /*
build after

  (function () {
  var arrowFunction = function arrowFunction() {
    console.log('Hello My name is 19Qingfeng');
  };
  arrowFunction();
})();

  
  
  */