<?php

class Abstract_model extends CI_Model {

    protected $Table;

    function __construct() {
        parent::__construct();
    }

    function trans_start($test_mode = false) {
        return $this->db->trans_start($test_mode);
    }

    function trans_status() {
        return $this->db->trans_status();
    }

    function trans_begin() {
        return $this->db->trans_begin();
    }

    function trans_rollback() {
        return $this->db->trans_rollback();
    }

    function trans_commit() {
        return $this->db->trans_commit();
    }

    function trans_complete() {
        return $this->db->trans_complete();
    }

    function insert($data) {
        if ($this->db->insert($this->Table, $data)) {
            return true;
        }
        $mensagem = $this->db->_error_message();
        throw new Exception(substr($mensagem, strrpos($mensagem, ']') + 1), $this->db->_error_number());
    }

    function insert_batch($data) {
        if ($this->db->insert_batch($this->Table, $data)) {
            return true;
        }
        $mensagem = $this->db->_error_message();
        throw new Exception(substr($mensagem, strrpos($mensagem, ']') + 1), $this->db->_error_number());
    }

    function update($set, $key, $val = NULL) {
        $this->db->where($key, $val);
        if ($this->db->update($this->Table, $set)) {
            return true;
        }
        $mensagem = $this->db->_error_message();
        throw new Exception(substr($mensagem, strrpos($mensagem, ']') + 1), $this->db->_error_number());
    }

    function delete($where) {
        if ($this->db->delete($this->Table, $where)) {
            return true;
        }
        $mensagem = $this->db->_error_message();
        throw new Exception(substr($mensagem, strrpos($mensagem, ']') + 1), $this->db->_error_number());
    }

    function getAll() {
        return $this->db->get($this->Table)->result();
    }

    function getWhere($where) {
        return $this->db->get_where($this->Table, $where)->result();
    }

    function getErrorMessage() {
        $mensagem = $this->db->_error_message();
        return substr($mensagem, strrpos($mensagem, ']') + 1);
    }

}
