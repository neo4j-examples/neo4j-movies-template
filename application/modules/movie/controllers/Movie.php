<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Movie extends MX_Controller{
	public function __construct(){
            parent::__construct();
    }
    public function m($id = NULL){
    	$this->load->model("Moviequery_search","queryMovie");
    	$arr['details'] 	= $this->queryMovie->movieDetails($id);   
    	$arr['genre'] 		= $this->queryMovie->movieGenre($id);
    	$arr['directed'] 	= $this->queryMovie->movieDirected($id);
    	$arr['written'] 	= $this->queryMovie->movieWRITER($id);
    	$arr['produced'] 	= $this->queryMovie->movieProduced($id);
    	$arr['cast'] 		= $this->queryMovie->movieCast($id);
        $arr['related']     = $this->queryMovie->movieRelated($id);
    	$this->template->load("template/main","movie",$arr);
    }
}

