
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
                    var datiFilm = {
                        titolo: movie.title,
                        titoloOriginale: movie.original_title,
                        lingua: movie.original_language,
                        voto: movie.vote_average
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








}); //=======================
