function test(){
(async() => {

    solenolyrics= require("solenolyrics"); 
    var lyrics = await solenolyrics.requestLyricsFor(`faded`); 
    console.log(lyrics);

})();}

test()
