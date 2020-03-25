$(document).ready(function() {

    // Handlebars====================================
    var source = $("#results-template").html();
    var templateResults = Handlebars.compile(source);

    var source2 = $("#cast-template").html();
    var templateCast = Handlebars.compile(source2);
    //===============================================

    // === VARIABILI ===

    var apiBaseUrl = "https://api.themoviedb.org/3/";
    var apiKey = "29ad81bd33ebd003f5307b9c32a17b2b";

    //==================

    $("body").on("click", ".box-ricerca.active .search-button", function() { //Avvio programma con bottone "Cerca"
        if ($("body .box-ricerca.active .input-query-box").val().trim() != ""){
            clearResults();
            ajaxCall("movie");
            ajaxCall("tv");
        };
    });

    $("body").on("keypress", ".box-ricerca.active .input-query-box", function(event){ //Avvio programma con tasto "Invio"
        if ((event.key == "Enter") && ($(this).val().trim() != "")){
            clearResults();
            ajaxCall("movie");
            ajaxCall("tv");
        }
    });

    $(".container").on("mouseover", ".card", function(){
        $(this).find(".card-details").show();
    });
    $(".container").on("mouseleave", ".card", function(){
        $(this).find(".card-details").hide();
    });

    $("body").on("click", ".info-cast", infoCast);
    $("body").on("click", ".indietro", closeCast);
    $("body").on("mouseleave", ".cast-details", function(){
        $(this).removeClass("active").siblings(".card-details").hide().removeClass("hidden");
        clearCast();
    });

    // ===== FUNZIONE CHIAMATA AJAX PRINCIPALE =====

    function ajaxCall(tipo){
        var chiaveRicerca = $("body .box-ricerca.active .input-query-box").val();
        $.ajax({
            url: apiBaseUrl + "search/" + tipo,
            data: {
                api_key: apiKey,
                language: "it-IT",
                query: chiaveRicerca
            },
            method: "GET",
            success: function(data) {
                var risultati = data.results;
                for (var i = 0; i < risultati.length; i++) {
                    var elemento = risultati[i];


                    if ( tipo == "movie"){ // film
                        var title = elemento.title; // film
                        var originalTitle = elemento.original_title; // film
                        var type = "movie";

                    } else{
                        var title = elemento.name; // serie TV
                        var originalTitle = elemento.original_name; // serie TV
                        var type = "tv";
                    }
                    var id = elemento.id;
                    var flag = languageToFlag(elemento.original_language);
                    var stars = voteToStars(elemento.vote_average);
                    var posterUrl = getPoster(elemento.poster_path);
                    var overview = elemento.overview;
                    var datiShow = {
                        id: id,
                        titolo: title,
                        titoloOriginale: originalTitle,
                        lingua: flag,
                        voto: stars,
                        poster: posterUrl,
                        trama: overview,
                        tipo: type
                    }

                    if (datiShow.titolo == datiShow.titoloOriginale){
                        datiShow = {
                            id: id,
                            titolo: title,
                            lingua: flag,
                            voto: stars,
                            poster: posterUrl,
                            trama: overview,
                            tipo: type
                        }
                    };
                    if (datiShow.poster.endsWith("null")){
                        datiShow.poster = "img/poster-default.svg"
                    };


                    var templateCompilato = templateResults(datiShow);
                    $(".box-results").append(templateCompilato);

                    $(".hai-cercato").show();
                    $(".hai-cercato span").html(chiaveRicerca);
                    $(".input-query-box").val("");
                    $("main .box-ricerca").removeClass("active").addClass("hide");
                    $("header .box-ricerca ").removeClass("hide").addClass("active");


                }
            },
            error: function(err) {
                alert("Errore");
            }
        });
    };


    // ===== ALTRE FUNZIONI =====

    // infoCast: ottieni info sul cast

    function infoCast(){
        $(this).parent(".card-details").addClass("hidden").siblings(".cast-details").addClass("active");
        var showId = $(this).parent(".card-details").data("id");
        if ($(this).parent(".card-details").hasClass("movie")){
            var tipo = "movie"
        } else{
            var tipo = "tv"
        }
        $.ajax({
            url: apiBaseUrl + tipo + "/" + showId + "/credits",
            data: {
                api_key: apiKey
            },
            method: "GET",
            success: function(data){
                var cast = data.cast
                var datiCast = {
                    attore: []
                }
                for (var i = 0; i < 5; i++) {
                    if (cast[i]) {
                        var actor = cast[i].name;
                    } else {
                        var actor = undefined;
                    }
                    datiCast.attore.push(actor);
                }

                var templateCompilato = templateCast(datiCast);
                $(".cast-details").append(templateCompilato);

                if (datiCast.attore[0] == undefined){
                    $(".no-cast").removeClass("hide"); // mostra "nessuna informazione"
                }


            },
            error: function(err){
                alert("Errore Cast");


            }
        });

    };
    // closeCast: chiude le info sul cast
    function closeCast(){
        $(this).parent(".cast-details").removeClass("active").siblings(".card-details").removeClass("hidden");
        clearCast();

    };

    // clearResults: pulisce i risultati di ricerca prima di iniziarne una nuova

    function clearResults(){
        $(".box-results").html("");
    };
    // clearCast: pulisce il cast

    function clearCast(){
        $(".cast-list").html("");
    };

    //  voteToStars: trasforma il voto da decimi a valore in stelle

    function voteToStars(vote){
        if (vote >= 0) {
            vote = Math.ceil(vote / 2);
        };
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
                vote = "Nessuna valutazione";
        };
        return vote;
    };

    // languageToFlag: trasforma il codice lingua nella bandiera corrispondente

    function languageToFlag(lang){

        if (lang == "en"){
            lang = "GB";
        }
        if (lang == "ja"){
            lang = "JP";
        }
        if (lang == "da"){
            lang = "DK";
        }
        if (lang == "el"){
            lang = "GR";
        }
        if ((lang == "cs") ||
            (lang == "nb") ||
            (lang == "zh") ||
            (lang == "hi") ||
            (lang == "ta") ||
            (lang == "te") ||
            (lang == "ko") ||
            (lang == "sq")){
            var flag = "Lingua: " + lang.toUpperCase();

        } else {
            var flag = '<img src="https://www.countryflags.io/' + lang + '/flat/64.png">';
        };

        return flag;
    };

    // getPoster: ottiene il poster del film o serie TV

    function getPoster(path){
        var posterBaseUrl = "https://image.tmdb.org/t/p/";
        var resolution = "w342"
        var posterUrl = posterBaseUrl + resolution + path;

        return posterUrl;

    };


}); // fine document ready ========
