<?php

	include_once('conn.php');

	if(isset($_GET['action'])) {
		$action = $_GET['action'];

		switch ($action) {
			case 'get_tickets':
				
				$query = 'SELECT * FROM tickets';
				$result = $mysqli->query($query) or die($mysqli->error);

				$arr = array();

				while ($row = $result->fetch_assoc()) {
					array_push($arr, $row);
				}

				echo $json = json_encode($arr);

				break;

			case 'get_notifications':
				
				$query = 'SELECT * FROM notifications';
				$result = $mysqli->query($query) or die($mysqli->error);

				$arr = array();

				while ($row = $result->fetch_assoc()) {
					array_push($arr, $row);
				}

				echo $json = json_encode($arr);

				break;

			case 'get_comments':
				
				$query = 'SELECT * FROM comments';
				$result = $mysqli->query($query) or die($mysqli->error);

				$arr = array();

				while ($row = $result->fetch_assoc()) {
					array_push($arr, $row);
				}

				echo $json = json_encode($arr);

				break;

			case 'new_notification':

				$note = $_GET['note'];
				$time = $_GET['time'];
				$owner = $_GET['owner'];
				
				$query = "INSERT INTO notifications (note, time, owner) VALUES ('". $note ."', '". $time ."','". $owner ."')";
				$result = $mysqli->query($query) or die($mysqli->error);

				break;

			case 'new_comment':

				$comment = $_GET['comment'];
				$time = $_GET['time'];
				$owner = $_GET['owner'];
				$ticketReference = $_GET['ticketReference'];
				
				$query = "INSERT INTO comments (comment, time, owner, ticketReference) VALUES ('". $comment ."', '". $time ."','". $owner ."','". $ticketReference ."')";
				$result = $mysqli->query($query) or die($mysqli->error);

				break;

			case 'update_ticket':
				$set = $_GET['set'];
				$id = $_GET['id'];
				
				$query = "UPDATE tickets set $set WHERE id = $id";
				$result = $mysqli->query($query) or die($mysqli->error);

				break;
			
			default:
				echo 'deu merda';
				break;
		}
	}


?>