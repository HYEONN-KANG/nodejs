var name = "egoing";
// var letter =
//   "Dear " +
//   name +
//   "\n\nLorem ipsum dolor sit amet consectetur " +
//   name +
//   " adipisicing elit. A dolore " +
//   name +
//   " similique quia culpa rerum quisquam! " +
//   name +
//   " Quidem ut molestias, quia, deserunt vitae, dolore illum omnis " +
//   name +
//   " ducimus sequi impedit animi vero eaque.";

var letter = `Dear ${name}

  \n\nLorem ipsum dolor sit amet consectetur 
  ${name}
  adipisicing elit. A dolore

  ${1 + 1}
  
  similique quia culpa rerum quisquam!
  ${name}
  Quidem ut molestias, quia, deserunt vitae, dolore illum omnis
  ${name}
  ducimus sequi impedit animi vero eaque.`;

console.log(letter);
