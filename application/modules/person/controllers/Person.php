<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Person extends MX_Controller{
	public function __construct(){
            parent::__construct();
    }
    public function p($id = NULL){
    	$this->load->model("Personquery_search","queryPerson");
        $arr['details']        = $this->queryPerson->personDetails($id);
        $arr['relatedPeople']  = $this->queryPerson->personRelated($id);
        $arr['movieActed']     = $this->queryPerson->movieActed($id);
    	$this->template->load("template/main","person",$arr);
    }
}

