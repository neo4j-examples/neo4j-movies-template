<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends MX_Controller {
	public function __construct() {
            parent::__construct();
        }

    public function index() {
		$data['content_view'] = 'home/home';
		$this->template_neo4j->sample_template($data);
    }
	public function movie($title=NULL){
		$searchTerm = explode('%2C', $title);
		$title='';
		foreach ($searchTerm as $key) {
			$title .="$key ";
		}
		$title = substr($title,0,-1);
		$query = 'MATCH (m:Movie) WHERE m.title = {title}
							OPTIONAL MATCH p=(m)<-[r]-(a:Person) RETURN m,
							collect({rel: r, actor: a}) as plays';

	    $params = ['title' => $title];
	    $result = $this->neo4j->get_db()->run($query, $params);
	    $movie = $result->firstRecord()->get('m');
	    $mov = [
	        'title' => $movie->value('title'),
	        'cast' => []
	        ];
	    foreach ($result->firstRecord()->get('plays') as $play) {
	        $actor = $play['actor']->value('name');
	        $job = explode('_', strtolower($play['rel']->type()))[0];
	        $mov['cast'][] = [
	            'job' => $job,
	            'name' => $actor,
	            'role' => array_key_exists('roles', $play['rel']->values()) ? $play['rel']->value('roles') : null
	        ];
	    }
		return print_r(json_encode($mov));
	}
	public function search($searchTerm = NULL){
		$movTitle = '';
		$searchTerm = explode('%2C', $searchTerm);
		foreach ($searchTerm as $key) {
			$movTitle .="$key ";
		}
		$movTitle = substr($movTitle,0,-1);
		if($movTitle !=NULL){
		    $term 	= '(?i).*'.$movTitle.'.*';
		    $query 	= 'MATCH (m:Movie) WHERE m.title =~ {term} RETURN m';
		    $params = ['term' => $term];
		    $result = $this->neo4j->get_db()->run($query, $params);
		    $movies = [];
		    foreach ($result->records() as $record){
		        $movies[] = ['movie' => $record->get('m')->values()];
		    }
		    return print_r(json_encode($movies));
		}
	}
	public function graph(){
		$limit = 50;
	    $params = ['limit' => $limit];
	    $query = 'MATCH (m:Movie)<-[r:ACTED_IN]-(p:Person) RETURN m,r,p LIMIT {limit}';
	    $result = $this->neo4j->get_db()->run($query, $params);
	    $nodes = [];
	    $edges = [];
	    $identityMap = [];
	    foreach ($result->records() as $record){
	        $nodes[] = [
	            'title' => $record->get('m')->value('title'),
	            'label' => $record->get('m')->labels()[0]
	        ];
	        $identityMap[$record->get('m')->identity()] = count($nodes)-1;
	        $nodes[] = [
	            'title' => $record->get('p')->value('name'),
	            'label' => $record->get('p')->labels()[0]
	        ];
	        $identityMap[$record->get('p')->identity()] = count($nodes)-1;
	        $edges[] = [
	            'source' => $identityMap[$record->get('r')->startNodeIdentity()],
	            'target' => $identityMap[$record->get('r')->endNodeIdentity()]
	        ];
	    }
	    $data = [
	        'nodes' => $nodes,
	        'links' => $edges
	    ];
	    return print_r(json_encode($data));
	}
}

/* End of file users.php */
/* Location: ./application/modules/home/controllers/home.php */
