<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends MX_Controller{
	public function __construct(){
            parent::__construct();
    }
    public function index(){
    	$this->load->model("Homequery_movie","queryMovie");
    	$arr['action'] 	= $this->queryMovie->movieIndex("Action");
    	$arr['drama'] 	= $this->queryMovie->movieIndex("Drama");
    	$arr['Fantasy'] = $this->queryMovie->movieIndex("Fantasy");
    	$arr['feature'] = $this->queryMovie->featureMovie();
    	$this->template->load("template/main","index",$arr);
    
    }
}

/* End of file users.php */
/* Location: ./application/modules/home/controllers/Home.php */
