<?php
	require 'connect.php';
	$db->set_charset('utf8');

	if(isset($_POST['created_by'], $_POST['project_name'], $_POST['optionA'], $_POST['optionB'], $_POST['phone'], $_POST['address'], $_POST['info'])){
		$created_by = $_POST['created_by'];
		$project_name = $_POST['project_name'];
		$optionA = $_POST['optionA'];
		$optionB = $_POST['optionB'];
		$phone = $_POST['phone'];
		$address = $_POST['address'];
		$status = $_POST['status'];
		$info = $_POST['info'];

		$results = $db->query("SELECT * FROM `tasks` ORDER BY id DESC LIMIT 1");

		if($results->num_rows){
			while($row = $results->fetch_object()){
				$id = $row->id + 1;
			}
		}
		
		if(!$id){
			$id = 1;
		}
		
		mkdir('images/' . $id);
		mkdir('images/' . $id . '/0');
		mkdir('images/' . $id . '/1');
		
		$paths = scandir('cache/' . $created_by);
		$i = 0;
		
		foreach ($paths as $path){
			if (strpos($path,'.jpg') !== false && strpos($path,'image') !== false) {
					rename('cache/'. $created_by .'/'. $path, 'images/'. $id .'/0/' . $path);
					$i++;	
			}
		}
    
		$insert = $db->prepare("INSERT INTO tasks (created_by, project_name, address, phone, information, optionA, optionB, time, status) VALUES (?,?,?,?,?,?,?, NOW(),0)");
		$insert->bind_param('sssssss', $created_by, $project_name, $address, $phone, $info, $optionA, $optionB);
		$insert->execute();
		
		echo 'Task has been created!';

	}else if(isset($_POST['id'], $_POST['user'], $_POST['info'])){
		
		$id = $_POST['id'];
		$user = $_POST['user'];
		$info = $_POST['info'];
		
		$sql = "UPDATE `tasks` SET `techinfo` = '". $info ."', `status`= 2 WHERE `id`=". $id;
		$db->query($sql);
		
		$paths = scandir('cache/' . $user);
		$i = 0;
		
		foreach ($paths as $path){
			if (strpos($path,'.jpg') !== false && strpos($path,'image') !== false) {
				rename('cache/'. $user .'/'. $path, 'images/'. $id .'/1/' . $path);
				$i++;	
			}
		}
		echo 'Task updated!';
	}
?>