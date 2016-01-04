<?php
	require 'connect.php';
	$db->set_charset('utf8');

	if(isset($_POST['username'], $_POST['password'])){
		$username = $_POST['username'];
		$password = $_POST['password'];

		$results = $db->query("SELECT * FROM `users` WHERE `username`= '". $username ."'");

		if($results->num_rows){
			while($row = $results->fetch_object()){
				if(strtolower($username) == $row->username && strtolower($password) == $row->password){
					echo '1';
				}
			}
		}
	}
?>