// var JSSoup = require('jssoup').default;
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();

// console.log('test')

// const Http = new XMLHttpRequest();
// const url='https://www.azlyrics.com/lyrics/kanyewest/stronger.html';
// Http.open("GET", url);
// Http.send();

// Http.onreadystatechange = (e) => {
//   console.log(Http.responseText)
// }
(async() => {
  const solenolyrics= require("solenolyrics"); 

  var lyrics = await solenolyrics.requestLyricsFor(`Now i'm in it`); 
  console.log(lyrics)

})();
