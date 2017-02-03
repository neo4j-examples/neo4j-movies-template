<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pesquisa extends MX_Controller{
	public function __construct(){
            parent::__construct();
    }
    public function index($pesquisa = NULL){
    	if($pesquisa === NULL){
    		$pesquisa = $this->input->post('pesquisa', TRUE);
    	}
    	$arr['pesquisa'] = $pesquisa;
		$this->template->load("template/main","pesquisa",$arr);
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