$(document).ready(main);

function validateForm(){
    var x = document.querySelector("#showTitle").value;
    if (x == ""){
        document.querySelector("#error").innerText = "Please enter valid show title.";
        return false;
    }
}


function DateConstructor(weekday, date) {
    this.currentDay = weekday;
    this.currentDate = new Date(date);
    // console.log(this.currentDate);
    this.weekdayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.currentDayIndex = -1;

    this.weekDayName = this.weekdayList.filter(function (ele, index) {
        console.log(typeof ele, typeof weekday);
        if (ele.includes(weekday)) {
            this.currentDayIndex = index;
            return true;
        }
        return false;
    }, this);
    console.log(this.currentDayIndex);
    console.log(this.weekDayName);
}

DateConstructor.prototype.nextDay = function (index) {
    if (index == 6) {
        return this.weekdayList[0];
    }
    return this.weekdayList[index + 1];
};

DateConstructor.prototype.prevDay = function (index) {
    if (index == 0) {
        return this.weekdayList[6];
    }
    return this.weekdayList[index - 1];
};

DateConstructor.prototype.nextDate = function (date) {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    var month = this.currentDate.getMonth() + 1;
    if (month == 13) {
        month = 1;
    }

    return month + "/" + this.currentDate.getDate() + "/" + this.currentDate.getFullYear();
};

DateConstructor.prototype.prevDate = function (date) {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    var month = this.currentDate.getMonth() + 1;
    if (month == 13) {
        month = 1;
    }

    return month + "/" + this.currentDate.getDate() + "/" + this.currentDate.getFullYear();
};


function main() {

    getLatestInfo();
    AddEventListenersToButtons();
}

function getLatestInfo() {
    var latestEpisode = document.getElementsByClassName("latestEpisode");
    [].forEach.call(latestEpisode, function (element) {
        var id = element.childNodes[1].value;
        console.log(id);

        var url = "/api/movies/IDtoShow?id=" + id;

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
                var url2 = "http://api.tvmaze.com/search/shows?q=" + encodeURI(title);
                req2.open('GET', url2, true);
                req2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                req2.addEventListener('load', onShowInfoLoad);

                function onShowInfoLoad() {
                    if (req2.status == 200) {


                        var data2 = JSON.parse(req2.responseText);
                        // console.log("RESPONSE TXT!:", data2[0].show._links.nextepisode.href);

                        if (data2.length == 0 || data2[0].show == undefined || data2[0].show._links.nextepisode == null) {
                            element.appendChild(document.createTextNode("No info at this time."));
                        }
                        else {


                            var req3 = new XMLHttpRequest();
                            var url3 = data2[0].show._links.nextepisode.href;
                            req3.open('GET', url3, true);
                            req3.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                            req3.addEventListener('load', onNextEpisodeLoad);
                            function onNextEpisodeLoad() {
                                if (req3.status == 200) {
                                    var data3 = JSON.parse(req3.responseText);

                                    var episodeSeason = {
                                        episode: data3.number,
                                        season: data3.season
                                    };

                                    element.appendChild(document.createTextNode("Latest EP: " + seasonEpisode(episodeSeason) + " at " + data3.airdate + " - " + data3.airtime));
                                }
                            }
                        }

                        req3.send();
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

    });
}

function getLatestInfoVersionTwo() {
    var latestEpisode = document.getElementsByClassName("latestEpisode");
    [].forEach.call(latestEpisode, function (element) {
        var id = element.childNodes[0].value;
        console.log(id);

        var url = "/api/movies/IDtoShow?id=" + id;

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
                var url2 = "http://api.tvmaze.com/search/shows?q=" + encodeURI(title);
                req2.open('GET', url2, true);
                req2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                req2.addEventListener('load', onShowInfoLoad);

                function onShowInfoLoad() {
                    if (req2.status == 200) {


                        var data2 = JSON.parse(req2.responseText);
                        // console.log("RESPONSE TXT!:", data2[0].show._links.nextepisode.href);

                        console.log(data2);

                        if (data2.length == 0 || data2[0].show == undefined || data2[0].show._links.nextepisode == null) {
                            element.appendChild(document.createTextNode("No info at this time."));
                        }
                        else {

                            var req3 = new XMLHttpRequest();
                            var url3 = data2[0].show._links.nextepisode.href;
                            req3.open('GET', url3, true);
                            req3.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                            req3.addEventListener('load', onNextEpisodeLoad);
                            function onNextEpisodeLoad() {
                                if (req3.status == 200) {
                                    var data3 = JSON.parse(req3.responseText);
                                    var episodeSeason = {
                                        episode: data3.number,
                                        season: data3.season
                                    };

                                    element.appendChild(document.createTextNode("Latest EP: " + seasonEpisode(episodeSeason) + " at " + data3.airdate + " - " + data3.airtime));
                                }
                            }
                        }
                        req3.send();
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

    });
}

function AddEventListenersToButtons() {
    var imdb = document.getElementsByClassName("imdb");
    // console.log(imdb);

    [].forEach.call(imdb, function (element) {
        // console.log(element);
        element.addEventListener("click", getIMDB);
    });

    var subs = document.getElementsByClassName("subs");

    [].forEach.call(subs, function (element) {
        element.addEventListener("click", getSubs);
    });

    var DL = document.getElementsByClassName("DL");

    [].forEach.call(DL, function (element) {
        element.addEventListener("click", getDL);
    });


    var remove = document.getElementsByClassName("remove");
    [].forEach.call(remove, function (element) {
        element.addEventListener('click', removeShow);
    });

    var prev = document.getElementsByClassName("prev");
    [].forEach.call(prev, function (element) {
        element.addEventListener('click', prevList);
    });

    var next = document.getElementsByClassName("next");
    [].forEach.call(next, function (element) {
        element.addEventListener('click', nextList);
    })
}

function nextList(event) {
    event.preventDefault();

    var day = document.querySelector("#weekday").textContent;
    var date = document.querySelector("#date").textContent;
    var user = document.querySelector("#userID").value;


    var currentDay = new DateConstructor(day, date);
    var newDay = currentDay.nextDay(currentDay.currentDayIndex);
    var newDate = currentDay.nextDate();

    var sendText = "day=" + newDay + "&user=" + user;

    document.querySelector("#date").textContent = newDate;

    var req = new XMLHttpRequest();
    req.open('GET', "/api/movies/weekday?" + sendText, true);
    //make sure request header specifies content type
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //send the data within send


    console.log("TEXT SENT!", sendText);


    req.addEventListener("load", handleNext);
    function handleNext() {
        if (req.status == 200) {
            document.querySelector("#weekday").textContent = newDay;
            var table = document.querySelector("#scheduleTable");

            var tableBody = document.createElement("tbody");
            table.replaceChild(tableBody, table.childNodes[3]);

            var data = JSON.parse(req.responseText);
            if (data.length == 0) {
                var tableRow = document.createElement("tr");

                var tableData = document.createElement("td");
                tableData.appendChild(document.createTextNode("You have nothing listed!"));
                tableRow.appendChild(tableData);
                tableBody.appendChild(tableRow);
            }
            else {

                data.forEach(function (obj) {
                    var tableRow = document.createElement("tr");

                    var tableData = document.createElement("td");
                    tableData.appendChild(document.createTextNode(obj.title + " " + seasonEpisode(obj)));

                    var tableData2 = document.createElement("td");

                    var IMDBbutton = document.createElement("button");
                    IMDBbutton.appendChild(document.createTextNode("IMDb"));
                    IMDBbutton.setAttribute("type", "button");
                    IMDBbutton.setAttribute("class", "imdb btn btn-info");
                    IMDBbutton.setAttribute("value", obj._id);

                    tableData2.appendChild(IMDBbutton);

                    var SubsButton = document.createElement("button");
                    SubsButton.appendChild(document.createTextNode("Subs"));
                    SubsButton.setAttribute("type", "button");
                    SubsButton.setAttribute("class", "subs btn btn-info");
                    SubsButton.setAttribute("value", obj._id);

                    tableData2.appendChild(SubsButton);

                    var DLButton = document.createElement("button");
                    DLButton.appendChild(document.createTextNode("DL"));
                    DLButton.setAttribute("type", "button");
                    DLButton.setAttribute("class", "DL btn btn-info");
                    DLButton.setAttribute("value", obj._id);

                    tableData2.appendChild(DLButton);

                    var latestEpisode = document.createElement("td");
                    latestEpisode.setAttribute("class", "latestEpisode");


                    var hiddenInput = document.createElement("input");
                    hiddenInput.setAttribute("type", "hidden");
                    hiddenInput.setAttribute("value", obj._id);
                    latestEpisode.appendChild(hiddenInput);


                    tableRow.appendChild(tableData);
                    tableRow.appendChild(tableData2);
                    tableRow.appendChild(latestEpisode);

                    tableBody.appendChild(tableRow);

                });
            }
            getLatestInfoVersionTwo();

            AddEventListenersToButtons();

        }
    }

    req.send();
}

function prevList(event) {
    event.preventDefault();
    var day = document.querySelector("#weekday").textContent;
    var date = document.querySelector("#date").textContent;
    var user = document.querySelector("#userID").value;


    var currentDay = new DateConstructor(day, date);
    var newDay = currentDay.prevDay(currentDay.currentDayIndex);
    var newDate = currentDay.prevDate();

    var sendText = "day=" + newDay + "&user=" + user;

    document.querySelector("#date").textContent = newDate;

    var req = new XMLHttpRequest();
    req.open('GET', "/api/movies/weekday?" + sendText, true);
    //make sure request header specifies content type
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //send the data within send


    console.log("TEXT SENT!", sendText);


    req.addEventListener("load", handlePrev);
    function handlePrev() {
        if (req.status == 200) {
            document.querySelector("#weekday").textContent = newDay;
            var table = document.querySelector("#scheduleTable");

            var tableBody = document.createElement("tbody");

            table.replaceChild(tableBody, table.childNodes[3]);

            var data = JSON.parse(req.responseText);
            if (data.length == 0) {
                var tableRow = document.createElement("tr");

                var tableData = document.createElement("td");
                tableData.appendChild(document.createTextNode("You have nothing listed!"));
                tableRow.appendChild(tableData);
                tableBody.appendChild(tableRow);
            }
            else {

                data.forEach(function (obj) {
                    var tableRow = document.createElement("tr");

                    var tableData = document.createElement("td");
                    tableData.appendChild(document.createTextNode(obj.title + " " + seasonEpisode(obj)));

                    var tableData2 = document.createElement("td");

                    var IMDBbutton = document.createElement("button");
                    IMDBbutton.appendChild(document.createTextNode("IMDb"));
                    IMDBbutton.setAttribute("type", "button");
                    IMDBbutton.setAttribute("class", "imdb btn btn-info");
                    IMDBbutton.setAttribute("value", obj._id);

                    tableData2.appendChild(IMDBbutton);

                    var SubsButton = document.createElement("button");
                    SubsButton.appendChild(document.createTextNode("Subs"));
                    SubsButton.setAttribute("type", "button");
                    SubsButton.setAttribute("class", "subs btn btn-info");
                    SubsButton.setAttribute("value", obj._id);

                    tableData2.appendChild(SubsButton);

                    var DLButton = document.createElement("button");
                    DLButton.appendChild(document.createTextNode("DL"));
                    DLButton.setAttribute("type", "button");
                    DLButton.setAttribute("class", "DL btn btn-info");
                    DLButton.setAttribute("value", obj._id);

                    tableData2.appendChild(DLButton);

                    var latestEpisode = document.createElement("td");
                    latestEpisode.setAttribute("class", "latestEpisode");


                    var hiddenInput = document.createElement("input");
                    hiddenInput.setAttribute("type", "hidden");
                    hiddenInput.setAttribute("value", obj._id);
                    latestEpisode.appendChild(hiddenInput);


                    tableRow.appendChild(tableData);
                    tableRow.appendChild(tableData2);
                    tableRow.appendChild(latestEpisode);

                    tableBody.appendChild(tableRow);

                });
            }
            getLatestInfoVersionTwo();
            AddEventListenersToButtons();

        }
    }

    req.send();
}

function removeShow(event) {
    event.preventDefault();
    // console.log(event.toElement.value);

    var req = new XMLHttpRequest();
    req.open('POST', "/api/movies/delete", true);
    //make sure request header specifies content type
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //send the data within send
    var sendText = "movieID=" + event.toElement.value;
    console.log(sendText);
    req.send(sendText);

    console.log(event);

    var parent = event.srcElement.parentNode.parentNode;
    var child = event.srcElement.parentNode;
    // console.log(event.srcElement.parentNode)

    parent.removeChild(child);


}

function getIMDB(event) {
    event.preventDefault();
    var id = event.srcElement.value;

    var url = "/api/movies/IDtoShow?id=" + id;

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
                window.open(imdbLink, '_blank');
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

function getSubs(event) {
    event.preventDefault();
    var id = event.srcElement.value;

    var url = "/api/movies/IDtoShow?id=" + id;

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
            var url2 = "/api/movies/subs?title=" + encodeURI(title);
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

function getSeasonEpisodeNumber(season, episode) {
    // var string = "";
    if (season == -1 && episode == -1) {
        return "";
    }
    if (season < 10 && episode < 10) {
        return "S0" + season + "E0" + episode;
    }
    if (season < 10 && episode >= 10) {
        return "S0" + season + "E" + episode;
    }
    if (season >= 10 && episode < 10) {
        return "S" + season + "E0" + episode;
    }
    if (season >= 10 && episode >= 10) {
        return "S" + season + "E" + episode;
    }


}

function getDL(event) {
    event.preventDefault();
    var id = event.srcElement.value;

    var url = "/api/movies/IDtoShow?id=" + id;

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
            window.open(link, '_blank');

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

function seasonEpisode(movie) {
    // console.log("helper: ", movie);
    if (movie.season == -1 && movie.episode == -1) {
        return "";
    }
    else if (movie.season == -1 && movie.episode != -1) {
        if (movie.episode > 9) {
            return "(E" + movie.episode + ")";
        }
        return "(E0" + movie.episode + ")";
    }
    else if (movie.season != -1 && movie.episode == -1) {
        if (movie.season > 9) {
            return "(S" + movie.season + ")";
        }
        return "(S0" + movie.season + ")";
    }
    else if (movie.season != -1 && movie.episode != -1) {
        if (movie.season > 9 && movie.episode > 9) {
            return "(S" + movie.season + "E" + movie.episode + ")";
        }
        else if (movie.season > 9 && movie.episode <= 9) {
            return "(S" + movie.season + "E0" + movie.episode + ")";
        }
        else if (movie.season <= 9 && movie.episode > 9) {
            return "(S0" + movie.season + "E" + movie.episode + ")";
        }
        else if (movie.season <= 9 && movie.episode <= 9) {
            return "(S0" + movie.season + "E0" + movie.episode + ")";
        }

    }
}