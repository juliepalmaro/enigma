<?php
include_once './config/database.php';
require "../vendor/autoload.php";
use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//Déclaration des variables
$login = '';
$password = '';

//Connexion à la BDD
$databaseService = new DatabaseService();
$dbb = $databaseService->getConnection();

//Json décodé et stocké dans un tableau
$data = json_decode(file_get_contents("php://input"));

//Attribution des valeurs aux variables
$login = $data->login;
$password = $data->password;

$table_name = 'Users';

//Requete SQL sécurisé par un paramètre, pour empécher toutes injections SQL
$sql = "SELECT * FROM " . $table_name . " WHERE login = ?";

//Préparation de la requête SQL
$stmt = $dbb->prepare( $sql );
//Execution de la requête, en lui donnant les paramètres manquant
$stmt->execute([$login]);

//Lecture du résultat de la requête
$row = $stmt->fetch(PDO::FETCH_ASSOC);
//Si le login de la personne a été trouvé, il est alors stocké dans la variable
$id = $row['id'];
$password2 = $row['password'];

//Vérification entre le mot de passe donnée, et le mot de passe stocké dans la BDD
if(password_verify($password, $password2))
{
    //Déclaration de la "secret key" permettant le lien entre le serveur et l'application. Cette clé est confidentiel, et seul les 2 parties doivent la connaitre
    $secret_key = "lesecret";
    //Attribution du nom du serveur qui renvoi la requête
    $issuer_claim = "https://laresistance.fr";
    //Correspond à la date de la création du token
    $issuedat_claim = time(); // issued at
    $notbefore_claim = $issuedat_claim + 10;
    //Permet de donnée une date de péremption au token, ici 4h
    $expire_claim = $issuedat_claim + 14400;

    $token = array(
        "iss" => $issuer_claim,
        "iat" => $issuedat_claim,
        "nbf" => $notbefore_claim,
        "exp" => $expire_claim,
        "data" => array(
            "id" => $id,
            "login" => $login
        ));

    //Message si tout correspond
    http_response_code(200);

    $jwt = JWT::encode($token, $secret_key);
    echo json_encode(
        array(
            "message" => "Successful login.",
            "issue" => $issuer_claim,
            "login" => $login,
            "expireAt" => $expire_claim,
            "jwt" => $jwt,
        ));
}

//Message d'erreur en cas de mauvais login, ou mauvais mot de passe
else{

    http_response_code(401);
    echo json_encode(array("message" => "Login failed.", "password" => $password));
}
?>