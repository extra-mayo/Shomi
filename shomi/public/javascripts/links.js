function getIMDB(nameOfShow){
    $.getJSON('http://omdbapi.com/?s=' + encodeURI(nameOfShow)).then(function(searchResult){
        console.log("search result",searchResult.Search.imdbID);
        var showID = searchResult.Search[0].imdbID;
        var imdbLink = 'http://www.imdb.com/title/' + showID;
        chrome.tabs.create({"url": imdbLink});
    });
}

//reference: https://www.npmjs.com/package/addic7ed-api
var addic7edApi = require('addic7ed-api');
addic7edApi.search('South Park', 19, 6).then(function (subtitlesList) {
    var subInfo = subtitlesList[0];
    if (subInfo) {
        addic7edApi.download(subInfo, './South.Park.S19E06.srt').then(function () {
            console.log('Subtitles file saved.');
        });
    }
});