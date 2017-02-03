<?php

class Homequery_movie extends Abstract_model{
    public function __construct() {
        parent::__construct();
    }
    
    public function movieIndex($param=NULL){

        $query = 'MATCH (n:Genre{name:{param}})-[r]-(m:Movie) RETURN m.title as title,m.poster_image as img ,m.id as id';
        $params = ['param' => $param];
        $result = $this->neo4j->get_db()->run($query, $params);
        $lis = '';
		foreach ($result->records() as $record) {
        	$lis .= '<li class="nt-carousel-item" style="display: inline-block; width: 20%; ";"><div>';
        	$lis .= "<img src='";
        	$lis .= $record->value('img');
        	$lis .= "'>";
        	$lis .= '</a><div class="nt-carousel-movie-title">
			<a href="http://localhost/movie/m/';
			$lis .= $record->value('id');
			$lis .= '">';
			$lis .= $record->value('title');
			$lis .= '</a></div></div></li>';
		}
        return $lis;
    }
    public function featureMovie(){
        $term 	= '(?i).*the matrix.*';
        $query 	= 'MATCH (m:Movie) WHERE m.title =~ {term} RETURN m.title as title,m.poster_image as img ,m.id as id limit 3';
        $params = ['term' => $term];
        $result = $this->neo4j->get_db()->run($query, $params);
        $lis = '';
		foreach ($result->records() as $record) {
        	$lis .= '<li class="nt-carousel-item" style="display: inline-block; width: 20%;"><div>';
        	$lis .= "<img src='";
        	$lis .= $record->value('img');
        	$lis .= "'>";
        	$lis .= '</a><div class="nt-carousel-movie-title">
			<a href="http://localhost/movie/m/';
			$lis .= $record->value('id');
			$lis .= '">';
			$lis .= $record->value('title');
			$lis .= '</a></div></div></li>';
		}
        return $lis;
    }
}