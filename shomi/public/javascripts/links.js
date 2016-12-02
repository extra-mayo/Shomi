$(document).ready(main);


function main(){
    var imdb = document.getElementsByClassName("imdb");
    // console.log(imdb);

    [].forEach.call(imdb, function(element) {
        // console.log(element);
        element.addEventListener("click", getIMDB);
    });

    var subs = document.getElementsByClassName("subs");

    [].forEach.call(subs, function(element){
        element.addEventListener("click", getSubs);
    });

    var DL = document.getElementsByClassName("DL");

    [].forEach.call(DL, function(element){
        element.addEventListener("click", getDL);
    });

}

function getIMDB(event) {
    event.preventDefault();
    var id = event.srcElement.value;

    var url = "http://localhost:3000/api/movies/IDtoShow?id=" + id;

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.addEventListener('load', onMovieLoad);

    function onMovieLoad() {
        if (req.status == 200) {
            console.log("RESPONSE TXT!:", req.responseText);

            var data = JSON.parse(req.responseText);
            console.log("DATA!", data);

            var title = data[0].title;
//http://api.tvmaze.com/search/shows?q=
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

function getSubs(event){
    event.preventDefault();
    var id = event.srcElement.value;

    var url = "http://localhost:3000/api/movies/IDtoShow?id=" + id;

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.addEventListener('load', onMovieLoad);

    function onMovieLoad() {
        if (req.status == 200) {
            console.log("RESPONSE TXT!:", req.responseText);

            var data = JSON.parse(req.responseText);
            console.log("DATA!", data);

            var title = data[0].title;

            var req2 = new XMLHttpRequest();
            var url2 = "http://localhost:3000/api/movies/subs?title=" + encodeURI(title);
            req2.open('GET', url2, true);
            req2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            req2.addEventListener('load', onSubLoad);

            function onSubLoad() {
                if (req2.status == 200) {
                    console.log("RESPONSE TXT!:", req2.responseText);

                    var data2 = JSON.parse(req2.responseText);
                    console.log("DATA2!", data2);
                    window.open('http://www.addic7ed.com' + data2.referer);
                }
                else {
                    alert("bad status code");
                }
            }
            req2.addEventListener('error', onError);
            function onError(event) {
                alert("error happened");
            }

            req2.send();
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

function getSeasonEpisodeNumber(season, episode){
    // var string = "";
    if (season == -1 && episode == -1){
        return "";
    }
    if (season < 10 && episode < 10){
        return "S0" + season + "E0" + episode;
    }
    if (season < 10 && episode >= 10){
        return "S0" + season + "E" + episode;
    }
    if (season >= 10 && episode < 10){
        return "S" + season + "E0" + episode;
    }
    if (season >= 10 && episode >= 10){
        return "S" + season + "E" + episode;
    }


}

function getDL(event){
    event.preventDefault();
    var id = event.srcElement.value;

    var url = "http://localhost:3000/api/movies/IDtoShow?id=" + id;

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.addEventListener('load', onMovieLoad);

    function onMovieLoad() {
        if (req.status == 200) {
            console.log("RESPONSE TXT!:", req.responseText);

            var data = JSON.parse(req.responseText);
            console.log("DATA!", data);

            var title = data[0].title;
//http://api.tvmaze.com/search/shows?q=
//
//             https://1337x.to/search/once+upon+a+time+s06e05/1/

            var link = "https://1337x.to/search/" + title.split(' ').join('+')
                + "+" + getSeasonEpisodeNumber(data[0].season, data[0].episode) + "/1/";
            window.open(link,'_blank');

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