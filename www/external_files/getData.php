<?php
	require 'connect.php';
	$db->set_charset('utf8');

	if(isset($_POST['user'], $_POST['status'], $_POST['userType'])){
		$user = $_POST['user'];
		$status = $_POST['status'];
		$userType = $_POST['userType'];
		
		$sql = "SELECT * FROM `tasks` WHERE (`status` ". $status ." AND `". $userType ."` = '". $user . "')";
		
		$results = $db->query($sql);

		if($results->num_rows){
			while($row = $results->fetch_object()){
				$rows['id'] = $row->id;
				$rows['name'] = $row->project_name;
				$rows['responsible'] = $row->responsible;
				$rows['status'] = $row->status;
				$Data[] = $rows;
			}
		}
		echo json_encode($Data, 128);
	}
?>