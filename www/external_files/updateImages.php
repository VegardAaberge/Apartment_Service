<?php

if(isset($_POST['ID'], $_POST['Type'], $_POST['User'])){
	$id = $_POST['ID'];
	$type = $_POST['Type'];
	$user = strtolower ($_POST['User']);
	
	echo $user;
	mkdir('images/' . $id);
	mkdir('images/' . $id . '/0');
	mkdir('images/' . $id . '/1');

	$paths = scandir('cache/' . $user);
	$i = 0;

	foreach ($paths as $path){
		echo 'cache/'. $user .'/'. $path . '    ' . 'images/'. $id .'/'. $type .'/' . $path . '    ';
		if (strpos($path,'.jpg') !== false) {
				rename('cache/'. $user .'/'. $path, 'images/'. $id .'/'. $type .'/' . $path);
				$i++;	
		}
	}
}
?>