function hbsHelpers(hbs){

//handlebar registerhelper
    hbs.registerHelper('printSeasonEpisode', function(movie){
        // console.log("helper: ", movie);
        if (movie.season == -1 && movie.episode == -1){
            return "";
        }
        else if (movie.season == -1 && movie.episode != -1){
            if (movie.episode > 9){
                return "(E" + movie.episode + ")";
            }
            return "(E0" + movie.episode + ")";
        }
        else if (movie.season != -1 && movie.episode == -1){
            if (movie.season > 9){
                return "(S" + movie.season + ")";
            }
            return "(S0" + movie.season + ")";
        }
        else if (movie.season != -1 && movie.episode != -1){
            if (movie.season > 9 && movie.episode > 9){
                return "(S" + movie.season + "E" + movie.episode + ")";
            }
            else if (movie.season > 9 && movie.episode <= 9){
                return "(S" + movie.season + "E0" + movie.episode + ")";
            }
            else if (movie.season <= 9 && movie.episode > 9){
                return "(S0" + movie.season + "E" + movie.episode + ")";
            }
            else if (movie.season <= 9 && movie.episode <= 9){
                return "(S0" + movie.season + "E0" + movie.episode + ")";
            }

        }
    });

    hbs.registerHelper('ifDay', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);

    });
}

module.exports = hbsHelpers;