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
    public function pesquisa() {
			$this->template->load("template/main","pesquisa");
    }
	public function moviePesq($title=NULL){
		$this->load->model("Grapquery_pesquisa","queryModel");
		$dados = $this->queryModel->moveQuery($title);
		return print_r(json_encode($dados));
	}
	public function searchPesq($searchTerm = NULL){
		$this->load->model("Grapquery_pesquisa","queryModel");
		$dados = $this->queryModel->moveSearch($searchTerm);
		return print_r(json_encode($dados));
	}
	public function graphPesq(){
		$this->load->model("Grapquery_pesquisa","queryModel");
		$dados = $this->queryModel->moveGraph();
	    return print_r(json_encode($dados));
	}
}

/* End of file users.php */
/* Location: ./application/modules/home/controllers/Home.php */
