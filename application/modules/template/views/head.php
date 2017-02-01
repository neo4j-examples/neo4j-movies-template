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
    		if($controller === 'pesquisa'){
    	?>
	        <meta name="viewport" content="width=device-width, initial-scale=1.0">
	        <link rel="stylesheet" href="/assets/css/main.css">
	        <title>Neo4j Movies</title>
	        <script src="/assets/js/jquery-1.11.0.min.js"  type="text/javascript"></script>
	        <script src="/assets/js/d3.v3.min.js" type="text/javascript"></script>
    	<?php
    		}
    		elseif($controller === NULL){
    	?>
		    <title>Movie App</title>
		    <meta name="description" content="Movie App">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
           <link rel="stylesheet" href="/assets/css/bootstrap.css">
		    <link rel="stylesheet" href="/assets/css/main_index.css">
            <link rel="stylesheet" href="/assets/css/lightslider.css">
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