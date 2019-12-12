<?php
// Class contenant toutes les informations liées à la BDD
class DatabaseService{

    //Déclaration des infos de ma bdd
    private $db_host = "localhost";
    private $db_name = "enigma";
    private $db_user = "root";
    private $db_password = "";
    private $dbb;

// Connexion à la base de donnée MYSQL en PDO
    public function getConnection(){

        $this->dbb = null;

        try{
            $this->dbb = new PDO("mysql:host=" . $this->db_host . ";dbname=" . $this->db_name, $this->db_user, $this->db_password);
        }catch(PDOException $exception){
            echo "Connection failed: " . $exception->getMessage();
        }

        return $this->dbb;
    }
}
?>