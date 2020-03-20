$(document).ready(function() {

    // Handlebars====================================
    var source = $("#results-template").html();
    var templateResults = Handlebars.compile(source);
    //===============================================

    $(".search-button").click(function() {
        if ($(".input-query-box").val().trim() != ""){ //Avvio programma con tasto "cerca"
            deleteResults();
            ajaxCallFilm();
            ajaxCallSerie();
        };
    });

    $(".input-query-box").keypress(function(){ //Avvio programma con "Invio"
        if ((event.key == "Enter") && ($(this).val().trim() != "")){
            deleteResults();
            ajaxCallFilm();
            ajaxCallSerie()
        }
    });

    // FUNZIONI ===================================

    function deleteResults(){
        $(".box-results").html("");

    };

    function ajaxCallFilm(){
        var apiBaseUrl = "https://api.themoviedb.org/3/search/movie";
        var chiaveRicerca = $(".input-query-box").val();
        $.ajax({
            url: apiBaseUrl + "",
            data: {
                api_key: "29ad81bd33ebd003f5307b9c32a17b2b",
                language: "it-IT",
                query: chiaveRicerca
            },
            method: "GET",
            success: function(data) {
                var movies = data.results;
                for (var i = 0; i < movies.length; i++) {
                    var movie = movies[i];

                    var title = movie.title;
                    var originalTitle = movie.original_title;
                    var language = movie.original_language;
                    if (movie.vote_average > 0) {
                        var vote = Math.ceil(movie.vote_average / 2);
                    };
                    var posterUrl = movie.poster_path

                    switch (vote) {
                        case 1:
                            vote = '<i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 2:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 3:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 4:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 5:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
                            break;
                        default:
                            vote = "ND";
                            break;

                    };

                    var classeDaAggiungere = "";

                    if (language == "en"){
                        language = "GB";
                    }
                    if (language == "ja"){
                        language = "JP";
                    }
                    if (language == "da"){
                        language = "DK";
                    }

                    if ((language == "cs") ||
                        (language == "nb") ||
                        (language == "zh") ||
                        (language == "sq")){
                        var flag = "Altra";
                        classeDaAggiungere = "altra"


                    } else {
                        var flag = '<img src="https://www.countryflags.io/' + language + '/flat/64.png">';
                    };

                    var posterFullUrl = "https://image.tmdb.org/t/p/" + "w342" + posterUrl;

                    var datiFilm = {
                        titolo: title,
                        titoloOriginale: originalTitle,
                        lingua: flag,
                        voto: vote,
                        classLingua: classeDaAggiungere,
                        poster: posterFullUrl
                    };


                    var templateCompilato = templateResults(datiFilm);
                    $(".box-results").append(templateCompilato);
                    $(".hai-cercato").show();
                    $(".hai-cercato span").html(chiaveRicerca);
                    $(".input-query-box").val("");
                }
            },
            error: function(err) {
                alert("Errore");
            }
        });
    };

    function ajaxCallSerie(){
        var apiBaseUrl = "https://api.themoviedb.org/3/search/tv";
        var chiaveRicerca = $(".input-query-box").val();
        $.ajax({
            url: apiBaseUrl + "",
            data: {
                api_key: "29ad81bd33ebd003f5307b9c32a17b2b",
                language: "it-IT",
                query: chiaveRicerca
            },
            method: "GET",
            success: function(data) {
                var movies = data.results;
                for (var i = 0; i < movies.length; i++) {
                    var movie = movies[i];

                    var title = movie.name;
                    var originalTitle = movie.original_name;
                    var language = movie.original_language;
                    if (movie.vote_average > 0) {
                        var vote = Math.ceil(movie.vote_average / 2);
                    };
                    var posterUrl = movie.poster_path

                    switch (vote) {
                        case 1:
                            vote = '<i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 2:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 3:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 4:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>';
                            break;
                        case 5:
                            vote = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
                            break;
                        default:
                            vote = "ND";
                            break;

                    };

                    var classeDaAggiungere = "";

                    if (language == "en"){
                        language = "GB";
                    }
                    if (language == "ja"){
                        language = "JP";
                    }
                    if (language == "da"){
                        language = "DK";
                    }

                    if ((language == "cs") ||
                        (language == "nb") ||
                        (language == "zh") ||
                        (language == "sq")){
                        var flag = "Altra";
                        classeDaAggiungere = "altra"


                    } else {
                        var flag = '<img src="https://www.countryflags.io/' + language + '/flat/64.png">';
                    };


                    var posterFullUrl = "https://image.tmdb.org/t/p/" + "w342" + posterUrl;
                    
                    var datiFilm = {
                        titolo: title,
                        titoloOriginale: originalTitle,
                        lingua: flag,
                        voto: vote,
                        classLingua: classeDaAggiungere,
                        poster: posterFullUrl
                    };


                    var templateCompilato = templateResults(datiFilm);
                    $(".box-results").append(templateCompilato);
                    $(".hai-cercato").show();
                    $(".hai-cercato span").html(chiaveRicerca);
                    $(".input-query-box").val("");
                }
            },
            error: function(err) {
                alert("Errore");
            }
        });
    };



}); //=======================
