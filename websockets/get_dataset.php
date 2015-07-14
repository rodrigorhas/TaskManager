<?php
include_once 'conn.php';

	$query = "SELECT * FROM tickets ORDER BY id";
	$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

	$arr = array();
	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			foreach($row as $key => $value ){
				$row[$key] = utf8_encode($value);
			}
			array_push($arr, $row);

		}
	}

	echo json_encode($arr);
?>