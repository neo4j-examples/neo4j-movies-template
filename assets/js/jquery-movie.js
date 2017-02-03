    $(function () {
        function showMovie(title) {
            var broTitle = title.split(" ");
            $.get("/pesquisa/moviePesq/" + encodeURIComponent(broTitle),
                    function (data) {
                        if (!data) return;
                        $("#title").text(data.title);
                        $("#poster").attr("src","http://neo4j-contrib.github.io/developer-resources/language-guides/assets/posters/"+encodeURIComponent(data.title)+".jpg");
                        var $list = $("#crew").empty();
                        data.cast.forEach(function (cast) {
                            $list.append($("<li>" + cast.name + " " +cast.job + (cast.job == "acted"?" as " + cast.role : "") + "</li>"));
                        });
                    }, "json");
            return false;
        }
        function search() {
            var query=$("#search").find("input[name=search]").val();
            var brokenstring = query.split(" ");
            $.get("/pesquisa/searchPesq/" + encodeURIComponent(brokenstring),
                    function (data) {
                        var t = $("table#results tbody").empty();
                        if (!data || data.length == 0) return;
                        data.forEach(function (row) {
                            var movie = row.movie;
                            $("<tr><td class='movie'>" + movie.title + "</td><td>" + movie.released + "</td><td>" + movie.tagline + "</td></tr>").appendTo(t)
                                    .click(function() { showMovie($(this).find("td.movie").text());})
                        });
                        showMovie(data[0].movie.title);
                    }, "json");
            return false;
        }
        $("#search").submit(search);
        search();
    })