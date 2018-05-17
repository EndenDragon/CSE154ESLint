<?php
error_reporting(E_ALL);
header("Content-type:application/json");
include("config.php");

function die_and_error($message) {
  header("HTTP/2 400 Bad Request");
  echo json_encode(array(
          "error" => $message
      ), JSON_PRETTY_PRINT);
  die();
}

if (!isset($_POST["code"])) {
    die_and_error("missing code post parameter");
}

//$code = escapeshellarg(addcslashes($_POST["code"], "\\"));
//$eslint_cmd = "eslint --no-eslintrc --config ./eslint-config.json --stdin --format json";
//$cmd = "echo {$code} | {$eslint_cmd}";

$code = $_POST["code"];
$temp_file = tempnam(sys_get_temp_dir(), 'jslint');
$tmp_file_handle = fopen($temp_file, "w");
fwrite($tmp_file_handle, $code);
fclose($tmp_file_handle);

$currentdir = dirname(__FILE__);
$node = "";
if ($node_location != "") {
    $node = $currentdir . $node_location;
}
$eslint_cmd = "{$node} {$currentdir}/node_modules/.bin/eslint --no-eslintrc --config {$currentdir}/eslint-config.json --format json";
$cmd = "{$eslint_cmd} {$temp_file}";
$output = shell_exec($cmd);

unlink($temp_file);
echo json_encode(json_decode($output), JSON_PRETTY_PRINT);
?>