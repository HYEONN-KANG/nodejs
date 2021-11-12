var fs = require("fs");

// readFileSync --> 동기적

// console.log("A");
// var result = fs.readFileSync("./syntax/sample.txt", "utf8");
// console.log(result);
// console.log("C");

// readFile  --> 비동기적 (js는 비동기적을 선호한다.)

console.log("A");
fs.readFile("./syntax/sample.txt", "utf8", function (err, result) {
  console.log(result);
});
console.log("C");
