<?php
	if(isset($_POST['data'])){
		$user = $_POST['data'];
		$files = glob("cache/". $user ."/*"); 
		foreach($files as $file){ 
			if(is_file($file)){
				unlink($file); 
				echo 'deleted';
			}
		}
	}
?>