<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Template_neo4j extends MX_Controller {

	public function __construct() {
            parent::__construct();
        }
        public function sample_template($data=NULL) {
            $this->load->view("template_neo4j",$data);
        }
}
