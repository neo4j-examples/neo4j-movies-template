<?php
$modulo = $this->uri->segment(1);
$controller = $this->uri->segment(2);
$metodo = $this->uri->segment(3);
$param = $this->uri->segment(4);
$version = date('Hi');
?>
<html>
    <head>
    	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<?php
    		if($modulo === 'pesquisa'){
    	?>
	        <meta name="viewport" content="width=device-width, initial-scale=1.0">
	        <link rel="stylesheet" href="/assets/css/main.css">
	        <title>Neo4j Movies</title>
	        <script src="/assets/js/jquery-1.11.0.min.js"  type="text/javascript"></script>
	        <script src="/assets/js/d3.v3.min.js" type="text/javascript"></script>
    	<?php
    		}
    		elseif($modulo === NULL || $modulo === "home" || $modulo === 'movie' || $modulo === 'person'){
    	?>
		    <title>Movie App</title>
		    <meta name="description" content="Movie App">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="/assets/css/bootstrap.css">
		    <link rel="stylesheet" href="/assets/css/main_index.css">
        <link rel="stylesheet" href="/assets/css/lightslider.css">
        <link rel="stylesheet" href="/assets/css/navbar.css">
        <style>
            ul{
                list-style: none outside none;
                padding-left: 0;
                margin: 0;
            }
            .demo .item{
                margin-bottom: 60px;
            }
            .content-slider li{
                text-align: center;
                color: #FFF;
            }
            .content-slider h3 {
                margin: 0;
                padding: 70px 0;
            }
            .demo{
                width: 800px;
            }
        </style>    	
        <?php
    		}
    	?>
    	

    </head>
    <body>
    <?php if($modulo === NULL || $modulo === "home" || $modulo === "movie" || $modulo === 'person'){ ?>
            <div data-reactroot="" class="nt-app">
            <nav class="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
              <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <a class="navbar-brand" href="/">Neo4j Recommendations Movies</a>

              <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item">
                    <a class="nav-link" href="https://github.com/neo4j-examples/neo4j-movies-template">GitHub Original Project</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="https://github.com/lucasjovencio/codeigniter-neo4j-movies-template">GitHub Fork Project</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="http://neo4j.com/">Neo4j 3.1.0</a>
                  </li>
                </ul>

                <form class="form-inline my-2 my-lg-0" method="post" accept-charset="utf-8" action="/pesquisa/">
                  <input class="form-control mr-sm-2" name="pesquisa" style="margin: 0%;" type="text" placeholder="Movie Search">
                  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item">
                    <a class="nav-link" href="https://github.com/lucasjovencio/codeigniter-neo4j-movies-template">Log in</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="http://neo4j.com/">Sign up</a>
                  </li>
                </ul>
                </div>
              </div>
            </nav>
        </div>
    <?php }?>
    