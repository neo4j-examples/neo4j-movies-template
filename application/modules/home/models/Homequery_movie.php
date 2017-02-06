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
        $cont=0;
		foreach ($result->records() as $record) {
            $lis[$cont]['img'] = $record->value('img');
            $lis[$cont]['id'] = $record->value('id');
            $lis[$cont]['title'] = $record->value('title');
            $cont++;
		}
        return $lis;
    }
    public function featureMovie(){
        $term 	= '(?i).*the matrix.*';
        $query 	= 'MATCH (m:Movie) WHERE m.title =~ {term} RETURN m.title as title,m.poster_image as img ,m.id as id limit 3';
        $params = ['term' => $term];
        $result = $this->neo4j->get_db()->run($query, $params);
        $cont=0;
        $lis = '';
		foreach ($result->records() as $record) {
            $lis[$cont]['img'] = $record->value('img');
            $lis[$cont]['id'] = $record->value('id');
            $lis[$cont]['title'] = $record->value('title');
            $cont++;
		}
        return $lis;
    }
}