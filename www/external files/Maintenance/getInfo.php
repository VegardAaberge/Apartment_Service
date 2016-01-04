<?php
	require 'connect.php';
	$db->set_charset('utf8');
	

	if(isset($_POST['data'])){
		$id = $_POST['data'];
		
		$results = $db->query("SELECT * FROM `tasks` WHERE id =" . $id);
		
		if($results->num_rows){
			while($row = $results->fetch_object()){
				$Data['id'] = $row->id;
				$Data['created'] = $row->created_by;
				$Data['name'] = $row->project_name;
				$Data['address'] = $row->address;
				$Data['phone'] = $row->phone;
				$Data['information'] = $row->information;
				$Data['optionA'] = $row->optionA;
				$Data['optionB'] = $row->optionB;
				$Data['time'] = $row->time;
				$Data['responsible'] = $row->responsible;
				$Data['techinfo'] = $row->techinfo;
				$Data['status'] = $row->status;	
			}
		}
		
		for($i = 0 ; $i<=1 ; $i++){
			$directory = 'images/'. $Data['id'] .'/'. $i .'/';
			$files = glob($directory . '*');

			if ( $files !== false ){
				$Data['imageCount'.$i] = count( $files );
			}else{
				$Data['imageCount'.$i] = 0;
			}
		}
		
		echo json_encode($Data, 128);
		
	}
?>