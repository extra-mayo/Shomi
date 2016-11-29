$(document).ready(main);


function main(){
    var imdb = document.getElementsByClassName("imdb");
    // console.log(imdb);

    [].forEach.call(imdb, function(element) {
        // console.log(element);
        element.addEventListener("click", getIMDB);
    });

}

function getIMDB(event) {
    event.preventDefault();
    var id = event.srcElement.value;

    var url = "http://localhost:3000/api/movies/IDtoShow?id=" + id;

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.addEventListener('load', onFilterLoad);

    function onFilterLoad() {
        if (req.status == 200) {
            console.log("RESPONSE TXT!:", req.responseText);

            var data = JSON.parse(req.responseText);
            console.log("DATA!", data);

            var title = data[0].title;

            $.getJSON('http://omdbapi.com/?s=' + encodeURI(title)).then(function (searchResult) {
                // console.log("search result",searchResult.Search.imdbID);
                var showID = searchResult.Search[0].imdbID;
                var imdbLink = 'http://www.imdb.com/title/' + showID;
                window.open(imdbLink,'_blank');
            });
        }
        else {
            alert("bad status code");
        }
    }
    req.addEventListener('error', onError);
    function onError(event) {
        alert("error happened");
    }

    req.send();
}

//reference: https://www.npmjs.com/package/addic7ed-api
// var addic7edApi = require('addic7ed-api');
// addic7edApi.search('South Park', 19, 6).then(function (subtitlesList) {
//     var subInfo = subtitlesList[0];
//     if (subInfo) {
//         addic7edApi.download(subInfo, './South.Park.S19E06.srt').then(function () {
//             console.log('Subtitles file saved.');
//         });
//     }
// });