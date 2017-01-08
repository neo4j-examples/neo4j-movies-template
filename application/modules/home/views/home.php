<div id="graph"></div>
<div role="navigation" class="navbar navbar-default navbar-static-top">
    <div class="container">
        <div class="row">
            <div class="col-sm-6 col-md-6">
                <ul class="nav navbar-nav">
                    <li>
                        <form role="search" class="navbar-form" id="search">
                            <div class="form-group">
                                <input type="text" value="" placeholder="Search for Movie Title" class="form-control" name="search">
                            </div>
                            <button class="btn btn-default" type="submit">Search</button>
                        </form>
                    </li>
                </ul>
            </div>
            <div class="navbar-header col-sm-6 col-md-6">
                <div class="logo-well">
                    <a href="http://neo4j.com/developer-resources">
                    <img src="http://neo4j-contrib.github.io/developer-resources/language-guides/assets/img/logo-white.svg" alt="Neo4j World's Leading Graph Database" id="logo">
                    </a>
                </div>
                <div class="navbar-brand">
                    <div class="brand">Neo4j Movies</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-5">
        <div class="panel panel-default">
            <div class="panel-heading">Search Results</div>
            <table id="results" class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Movie</th>
                    <th>Released</th>
                    <th>Tagline</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    <div class="col-md-7">
        <div class="panel panel-default">
            <div class="panel-heading" id="title">Details</div>
            <div class="row">
                <div class="col-sm-4 col-md-4">
                    <img src="" class="well" id="poster"/>
                </div>
                <div class="col-md-8 col-sm-8">
                    <h4>Crew</h4>
                    <ul id="crew">
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
<style type="text/css">
    .node { stroke: #222; stroke-width: 1.5px; }
    .node.actor { fill: #888; }
    .node.movie { fill: #BBB; }
    .link { stroke: #999; stroke-opacity: .6; stroke-width: 1px; }
</style>
<script src="/assets/js/jquery-movie.js"  type="text/javascript"></script>
<script src="/assets/js/d3-graph.js"  type="text/javascript"></script>
