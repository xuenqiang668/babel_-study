// 项目入口文件
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

const arr = [1];

// 使用了 Array.protototype.includes 方法
const result = arr.includes(2);
const resnext = arr.fill(2);

console.log(result, 'result');
console.log(resnext, 'resnext');

// 编译后的代码
// var arr = [1];
// var result = arr.includes(2);
// console.log(result, 'result');