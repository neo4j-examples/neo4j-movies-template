<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends MX_Controller {
	public function __construct() {
            parent::__construct();
        }

    public function index() {
			$this->template->load("template/main","home");
    }
	public function movie($title=NULL){
		$this->load->model("Grapquery_model","queryModel");
		$dados = $this->queryModel->moveQuery($title);
		return print_r(json_encode($dados));
	}
	public function search($searchTerm = NULL){
		$this->load->model("Grapquery_model","queryModel");
		$dados = $this->queryModel->moveSearch($searchTerm);
		return print_r(json_encode($dados));
	}
	public function graph(){
		$this->load->model("Grapquery_model","queryModel");
		$dados = $this->queryModel->moveGraph();
	    return print_r(json_encode($dados));
	}
}

/* End of file users.php */
/* Location: ./application/modules/home/controllers/Home.php */
