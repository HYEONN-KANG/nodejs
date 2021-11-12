// 이 코드 파일이 있는 위치가 아니라, 내가 nodejs 을 실행하고 있는 위치 기준
var testFolder = "./data";
var fs = require("fs");

fs.readdir(testFolder, function (error, filelist) {
  console.log(filelist);
});
