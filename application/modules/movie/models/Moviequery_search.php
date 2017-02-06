<?php

class Moviequery_search extends Abstract_model{
    public function __construct() {
        parent::__construct();
    }
    
    public function movieDetails($param=NULL){

        $query = 'MATCH (m:Movie) where m.id = {param} return  m.title as title, m.rated as rated, m.duration as duration, m.poster_image as img, m.tagline as tagline';
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query, $params);

        $lis['title']       =$result->getRecord()->value("title");
        $lis['img']         =$result->getRecord()->value("img");
        $lis['tagline']     =$result->getRecord()->value("tagline");
        $lis['rated']       =$result->getRecord()->value("rated");
        $lis['duration']    =$result->getRecord()->value("duration");

        return $lis;
    }
    public function movieGenre($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param} match (m)-[r]-(n:Genre) return  n.name as name";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $cont=0;
        $result = $result->records();
        $endArr = end($result);
        foreach ($result as $record) {
            $lis[$cont]['name']=$record->value('name');
            if($endArr != $record)
                $lis[$cont][','] = ',';
            $cont+=1;
        }
        return $lis; 
    }
    public function movieDirected($param = NULL){
        $query 	= "MATCH (m:Movie) where m.id = {param}  match (p:Person)-[di:DIRECTED]->(m) return  p.name as name, p.id as id";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $result = $result->records();
        $cont=0;
        $endArr = end($result);
		foreach ($result as $record) {
            $lis[$cont]['id'] = $record->value('id');
            $lis[$cont]['name']=$record->value('name');
            if($endArr != $record)
                $lis[$cont][','] = ',';
            $cont+=1;
        }
        return $lis;
    }

    public function movieWRITER($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param}  match (p:Person)-[di:WRITER_OF]->(m) return  p.name as name, p.id  as id";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $result = $result->records();
        $cont=0;
        $endArr = end($result);
        foreach ($result as $record){
            $lis[$cont]['id'] = $record->value('id');
            $lis[$cont]['name']=$record->value('name');
            if($endArr != $record)
                $lis[$cont][','] = ',';
            $cont+=1;
        }
        return $lis; 
    }
    public function movieProduced($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param} match (m)-[r:PRODUCED]-(n:Person) return  n.name as name, n.id as id";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $result = $result->records();
        $cont=0;
        $endArr = end($result);
        foreach ($result as $record){
            $lis[$cont]['id'] = $record->value('id');
            $lis[$cont]['name']=$record->value('name');
            if($endArr != $record)
                $lis[$cont][','] = ',';
            $cont+=1;
        }
        return $lis; 
    }
    public function movieCast($param = NULL){
        $query  = "MATCH (m:Movie) where m.id = {param} MATCH (p:Person)-[r:ACTED_IN]->(m) RETURN p.name as name,p.poster_image as img ,p.id as id, r.role as role";
        $params = ['param' => intval($param)];
        $result = $this->neo4j->get_db()->run($query,$params);
        $cont=0;
        foreach ($result->records() as $record) {
            $lis[$cont]['img'] = $record->value('img');
            $lis[$cont]['id'] = $record->value('id');
            $lis[$cont]['name'] = $record->value('name');
            foreach ( $record->value('role') as $key => $value) {
               $lis[$cont]['role'] = $value;
            }
            $cont+=1;
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
        $cont=0;
        foreach ($result->records() as $record) {
            if($record->value('title') != NULL){
                $lis[$cont]['img']      = $record->value('img');
                $lis[$cont]['id']       = $record->value('id');
                $lis[$cont]['title']    = $record->value('title');
                $cont++;
            }
        }
        return $lis;
    }
}