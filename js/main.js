
$(document).ready(function(){

    var source = $("#results-template").html();
    var templateResults = Handlebars.compile(source);

    $(".search-button").click(function(){
        $(".box-results").html("");
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
            success: function(data){
                var movies = data.results;
                for (var i = 0; i < movies.length; i++) {
                    var movie = movies[i];

                    var title = movie.title;
                    var originalTitle = movie.original_title;
                    var language = movie.original_language;
                    if (movie.vote_average > 0){
                        var vote = Math.ceil(movie.vote_average / 2);
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

                    };
                    



                    var datiFilm = {
                        titolo: title,
                        titoloOriginale: originalTitle,
                        lingua: language,
                        voto: vote
                    };


                    var templateCompilato = templateResults(datiFilm);
                    $(".box-results").append(templateCompilato);
                    $(".hai-cercato").show();
                    $(".hai-cercato span").html(chiaveRicerca);
                    $(".input-query-box").val("");
                    // $(".titolo span").html(datiFilm.titolo)
                    // $(".titolo-originale span").html(datiFilm.titoloOriginale)
                    // $(".lingua span").html(datiFilm.lingua)
                    // $(".voto span").html(datiFilm.voto)
                }
            },
            error: function(err){
                alert("Errore");
            }
        });
    });

    function addStars(vote){
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
    };



// Quello che accade è che il valore in stelle del primo elemento viene dato anche a tutti gli altri,
// tranne l'ultimo che rimane vuoto (non analizzato!)



}); //=======================
