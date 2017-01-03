<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require_once 'vendor/autoload.php';

use GraphAware\Neo4j\Client\ClientBuilder;

class Neo4j{
    private $Host;
  	private $DBName;
  	private $DBUser;
    private $DBPort;
  	private $DBPassword;
  	private $bConnected;
    private $client;

    private function Config(){
        $this->Host           = 'localhost';
        $this->DBUser         = 'neo4j';
        $this->DBPassword     = 'ubuntu';
        $this->DBPort         = '7687';
    }
  	private function Connect(){
        $this->Config();
    		try{
              $this->client = ClientBuilder::create()
                ->addConnection('bolt', "bolt://$this->DBUser:$this->DBPassword@$this->Host:$this->DBPort") 
                ->build();
    			    $this->bConnected = true;
    		}
    		catch (PDOException $e) {
    			echo $this->ExceptionLog($e->getMessage());
    			die();
    		}
  	}

    public function get_db(){
        $this->Connect();
        return $this->client;
    }
    public function disconnect_db(){
        $this->client=NULL;
        $this->bConnected = false;
    }
}
?>
