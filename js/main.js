$(document).ready(function() {

    // Handlebars====================================
    var source = $("#results-template").html();
    var templateResults = Handlebars.compile(source);

    var source2 = $("#cast-template").html();
    var templateCast = Handlebars.compile(source2);

    var source3 = $("#generi-template").html();
    var templateGeneri = Handlebars.compile(source3);

    //===============================================

    // === VARIABILI ===

    var apiBaseUrl = "https://api.themoviedb.org/3/";
    var apiKey = "29ad81bd33ebd003f5307b9c32a17b2b";

    var tvGenres = [{10759:"Azione e Avventura"},{16:"Animazione"},{35:"Commedia"},{80:"Crimine"},{99:"Documentario"},{18:"Drammatico"},{10751:"Famiglia"},{10762:"Bambini"},{9648:"Mistero"},{10763:"Informazione"},{10764:"Reality"},{10765:"Sci-Fi e Fantasy"},{10766:"Soap"},{10767:"Talk"},{10768:"Guerra e Politica"},{37:"Western"}];
    var movieGenres = [{28:"Azione"},{12:"Avventura"},{16:"Animazione"},{35:"Commedia"},{80:"Crimine"},{99:"Documentario"},{18:"Drammatico"},{10751:"Famiglia"},{14:"Fantasy"},{36:"Storico"},{27:"Horror"},{10402:"Musicale"},{9648:"Mistero"},{10749:"Romantico"},{878:"Fantascienza"},{10770:"Film TV"},{53:"Thriller"},{10752:"Guerra"},{37:"Western"}];

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

    $("#input-filter").keyup(filtraRicercaGenere);

    $(".container").on("mouseover", ".card", function(){
        $(this).find(".card-details").show();
    });
    $(".container").on("mouseleave", ".card", function(){
        $(this).find(".card-details").hide();
    });
    $(".container").on("click", ".card", function(){
        $(".card").not(this).find(".card-details").hide().removeClass("hidden");
        $(".card").not(this).find(".cast-details").removeClass("active");
        clearCast();    
    });

    $("body").on("click", ".info-cast", infoCast);
    $("body").on("click", ".indietro", closeCast);
    $("body").on("mouseleave", ".cast-details", function(){
        $(this).removeClass("active").siblings(".card-details").hide().removeClass("hidden");
        clearCast();
    });

    // ===== FUNZIONE CHIAMATA AJAX PRINCIPALE =====

    function ajaxCall(tipo){
        $(".bg-img").addClass("hide");
        $(".about-box").addClass("hide");

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
                    var generiId = elemento.genre_ids;
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
                        generi: generiId,
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
                            generi: generiId,
                            tipo: type
                        }
                    };
                    if (datiShow.poster.endsWith("null")){
                        datiShow.poster = "img/poster-default.svg"
                    };


                    var templateCompilato = templateResults(datiShow);
                    $(".box-results").append(templateCompilato);
                    // generiPresenti();


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
        else if (lang == "ja"){
            lang = "JP";
        }
        else if (lang == "da"){
            lang = "DK";
        }
        else if (lang == "el"){
            lang = "GR";
        }

        if ((lang == "cs") ||
            (lang == "nb") ||
            (lang == "zh") ||
            (lang == "hi") ||
            (lang == "ta") ||
            (lang == "te") ||
            (lang == "ko") ||
            (lang == "ur") ||
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

    function filtraRicercaGenere(event){
        var charFilter = $(this).val().toLowerCase();

        $("#filtro-generi").find(".genere").each(function() {
            if ($(this).text().toLowerCase().includes(charFilter)) {
                $(this).addClass("show");
                $(this).removeClass("hide");
            } else {
                $(this).addClass("hide");
                $(this).removeClass("show");
            };
        });

    };

    // function generiPresenti(){
    //     var arrayGeneriCards = [];
    //     $(document).find(".card").each(function(){
    //         var genereAllCode = $(this).data("generi");
    //         arrayGeneriCards.push(genereAllCode);
    //         console.log("generi all code" + arrayGeneriCards)
    //     });
    //     for (var i = 0; i < tvGenres.length; i++) {
    //         if (arrayGeneriCards.includes(Object.keys(tvGenres[i]))){
    //             console.log("generi all code" + arrayGeneriCards)
    //         } else{
    //             console.log("generi all code" + arrayGeneriCards)
    //         }
    //     }
    //
    // };


}); // fine document ready ========
