<?php
include_once './config/database.php';

header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//Déclaration des variables
$login = '';
$password = '';
$dbb = null;

//Connexion à la bdd
$databaseService = new DatabaseService();
$dbb = $databaseService->getConnection();

//Transformation du json reçu en tableau
$data = json_decode(file_get_contents("php://input"));

//Attributtion des valeurs du tableau à chaque variable
$login = $data->login;
$password = $data->password;

$table_name = 'Users';

//Création d'une requête SQL sécurisée par des paramètres
$sql = "INSERT INTO " . $table_name . "(`login`, `password`) VALUES (?, ?)";

$stmt = $dbb->prepare($sql);

//Hashage du password pour l'encrypter dans la bdd
$password_hash = password_hash($password, PASSWORD_BCRYPT);

//Envoi d'un message en fonction de la réponse de la requete SQL
if($stmt->execute([$login, $password_hash])){

    http_response_code(200);
    echo json_encode(array("message" => "Authentification reussi."));
}
else{
    http_response_code(400);

    echo json_encode(array("message" => "Impossible de creer l'utilisateur."));
}
?>