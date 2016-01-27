<?php
if(isset($_POST['data'])){
	$id = $_POST['data'];

	$images[0] = glob('./images/'. $id .'/0/*.jpg*');
	$images[1] = glob('./images/'. $id .'/1/*.jpg*');
	
	echo json_encode($images, 128);
}
?>