<?php

class Moviequery_search extends Abstract_model{
    public function __construct() {
        parent::__construct();
    }
    
    public function movieDetails($param=NULL){

        $query = 'MATCH (m:Movie) where m.id = {param} return  m.title as title, m.rated as rated, m.duration as duration, m.poster_image as img, m.tagline as tagline';
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query, $params);
        $lis = '';
        $lis .='<div class="row">
                    <div class="large-12 columns">
                    <h2 class="nt-movie-title">';
        $lis .= $result->getRecord()->value("title");
        $lis .='        </h2>
                       </div>
                    </div>
                <div class="row">
                    <div class="small-12 medium-4 columns nt-movie-aside">';
        $lis .=' <img class="nt-movie-poster" src="';
        $lis .= $result->getRecord()->value("img");
        $lis .= '">';
        $lis .= '<div class="nt-box">
                    <div class="nt-box-title">Storyline
                    </div>
                    <p class="nt-box-row">
                        <strong>Tagline: 
                        </strong>
                        <span>';
        $lis .= $result->getRecord()->value("tagline");
        $lis .= '        </span>
                    </p>
                    <p class="nt-box-row">
                        <strong>Keywords: 
                        </strong>
                        <span>
                            
                        </span>
                    </p>
                </div>
            </div>
            <div class="small-12 medium-8 columns nt-movie-main">
                <div>
                    <div class="nt-box">
                        <div class="nt-box-title">Movie Details
                        </div>
                        <p class="nt-box-row">
                            <strong>Rated: 
                            </strong>
                            <span>';
        $lis .= $result->getRecord()->value("rated");
        $lis .= '           </span>
                        </p>
                        <p class="nt-box-row">
                            <strong>Duration: 
                            </strong>
                            <span>';
        $lis .= $result->getRecord()->value("duration");
        $lis .= '           mins
                            </span>
                        </p>';
        return $lis;
    }
    public function movieGenre($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param} match (m)-[r]-(n:Genre) return  n.name as name";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $lis = '';
        $lis .= '<p class="nt-box-row">
                    <strong>Genres:</strong>
                    <span>';
        $result = $result->records();
        $endArr = end($result);
        foreach ($result as $record) {
            $lis .=     '<span>';
            $lis .= $record->value('name');
            if($endArr != $record){
                            $lis.='<span>, </span>';
            }
            $lis .='     </span>
                    </span>';
        }
        $lis .= '</p>';
        return $lis; 
    }
    public function movieDirected($param = NULL){
        $query 	= "MATCH (m:Movie) where m.id = {param}  match (p:Person)-[di:DIRECTED]->(m) return  p.name as name, id(p) as id";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $lis = '';
        $lis .= '<p class="nt-box-row">
                    <strong>Directed By: </strong>
                    <span>';
        $result = $result->records();
        $endArr = end($result);
		foreach ($result as $record) {
                $lis .='<span>
                            <span>
                                <a href="http://localhost/person/p/';
                                            $lis .= $record->value('id');
                                                                $lis .='">';
                                                    $lis .= $record->value('name');
                                                                        $lis .= '</a>';
        if($endArr != $record){
                        $lis.='<span>, </span>';
        }
        $lis.='             </span>
                        </span> 
                    </span>
                    ';
		} 
        $lis .= '</p>';
        return $lis;
    }
    public function movieWRITER($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param}  match (p:Person)-[di:WRITER_OF]->(m) return  p.name as name, p.id  as id";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $lis = '';
        $lis .= '<p class="nt-box-row">
                    <strong>Written By:</strong>
                    <span>';
        $result = $result->records();
        $endArr = end($result);
        foreach ($result as $record) {
                $lis .='<span>
                            <span>
                                <a href="http://localhost/person/p/';
                                            $lis .= $record->value('id');
                                                                $lis .='">';
                                                    $lis .= $record->value('name');
                                                                            $lis .= '</a>';
                if($endArr != $record){
                            $lis.='<span>, </span>';
                }
                $lis.='
                            </span>
                        </span>
                    </span>';
        }
        $lis .= '</p>';
        return $lis; 
    }
    public function movieProduced($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param} match (m)-[r:PRODUCED]-(n:Person) return  n.name as name, id(n) as id";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $lis = '';
        $lis .= '<p class="nt-box-row">
                    <strong>Produced By:</strong>
                    <span>';
        $result = $result->records();
        $endArr = end($result);
        foreach ($result as $record) {
                $lis .='<span>
                            <span>
                                <a href="http://localhost/person/p/';
                                            $lis .= $record->value('id');
                                                                $lis .='">';
                                                    $lis .= $record->value('name');
                                                                        $lis .= '</a>';
            if($endArr != $record){
                        $lis.='<span>, </span>';
            }
            $lis.='
                                                
                            </span>
                        </span>
                    </span>';
        }
        $lis .= '</p>';
        return $lis; 
    }
    public function movieCast($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param} MATCH (p:Person)-[r:ACTED_IN]->(m) RETURN p.name as name,p.poster_image as img ,p.id as id, r.role as role";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $lis ='';
        foreach ($result->records() as $record) {
            $lis .= '<li class="nt-carousel-item" style="display: inline-block; width: 20%; ";"><div>';
            $lis .= "<img src='";
            $lis .= $record->value('img');
            $lis .= "'>";
            $lis .= '</a><div class="nt-carousel-actor-name">
            <a href="http://localhost/person/p/';
            $lis .= $record->value('id');
            $lis .= '">';
            $lis .= $record->value('name');
            $lis .= '</div> <p class="nt-carousel-actor-name">';
            foreach ( $record->value('role') as $key => $value) {
               $lis .= $value;
            }
            $lis .= '</p></a></li>';
        }

        return $lis;
    }
    public function movieRelated($param = NULL){
        $query  = "MATCH (movie:Movie{id:{param}})
                    OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)
                    OPTIONAL MATCH (related:Movie)<--(a:Person) WHERE related <> movie
                    WITH DISTINCT related
                    return related.title as title, related.poster_image as img, related.id as id";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $lis ='';
        foreach ($result->records() as $record) {
            if($record->value('title') != NULL){
                $lis .= '<li class="nt-carousel-item" style="display: inline-block; width: 20%; ";"><div>';
                $lis .= "<img src='";
                $lis .= $record->value('img');
                $lis .= "'>";
                $lis .= '</a><div class="nt-carousel-actor-name">
                <a href="http://localhost/movie/m/';
                $lis .= $record->value('id');
                $lis .= '">';
                $lis .= $record->value('title');
                $lis .= '</a></li>';
            }
        }
        return $lis;
    }
}