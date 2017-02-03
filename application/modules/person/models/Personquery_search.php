<?php

class Personquery_search extends Abstract_model{
    public function __construct() {
        parent::__construct();
    }
    
    public function personDetails($param=NULL){

        $query = 'MATCH (n:Person) where n.id = {param} RETURN n.id as id, n.born as born, n.name as name, n.poster_image as img';
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query, $params);
        $lis['name']= $result->getRecord()->value("name");
        $lis['id']= $result->getRecord()->value("id");
        $lis['born']= $result->getRecord()->value("born");
        $lis['img']= $result->getRecord()->value("img");
        return $lis;
    }
    public function personRelated($param=NULL){

        $query = 'MATCH (person:Person{id:{param}})
                    OPTIONAL MATCH (person)-[r:ACTED_IN]->(m:Movie)
                    OPTIONAL MATCH (related:Person)-[rr:ACTED_IN]->(m) WHERE related <> m
                    WITH DISTINCT related
                    WHERE related.id <> {param}
                    return related.name as name, related.poster_image as img, related.id as id';
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query, $params);

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
            $lis .= '</div></a></li>';
        }

        return $lis;
    }
    public function movieActed($param = NULL){
        $query  = "MATCH (p:Person) where p.id = {param} MATCH (p)-[r:ACTED_IN]->(m:Movie) RETURN m.title as title, m.poster_image as img, m.id as id, r.role as role";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $lis ='';
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
            $lis .= '</div> <p class="nt-carousel-movie-role">';
            foreach ( $record->value('role') as $key => $value) {
               $lis .= $value;
            }
            $lis .= '</p></a></li>';
        }

        return $lis;
    }
}