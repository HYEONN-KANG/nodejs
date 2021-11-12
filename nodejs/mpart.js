var M = {
  v: "v",
  f: function () {
    console.log(this.v);
  },
};

// 이 파일의 M이 가리키는 객체를 이 파일 바깥에서 사용할 수 있도록 exports 하겠다
module.exports = M;
