<?php

	require 'conn.php';

	if(isset($_GET['action'])) {
		$action = $_GET['action'];

		switch ($action) {
			case 'get_tickets':
				
				$ticketQuery = 'SELECT * FROM tickets ORDER BY `date` DESC';
				$ticketResult = $mysqli->query($ticketQuery) or die($mysqli->error);


				$arr = array();

				while ($row = $ticketResult->fetch_assoc()) {

					$commentQuery = 'SELECT * FROM comments WHERE ticketReference = '. $row['id'] .' ORDER BY `time` DESC';
					$commentResult = $mysqli->query($commentQuery) or die($mysqli->error);

					$row['comments'] = array();

					while( $comment = $commentResult->fetch_assoc() ) {
						array_push($row['comments'], $comment); 
					}

					array_push($arr, $row);
				}

				echo $json = json_encode($arr);

				break;

			case 'get_notifications':
				
				$query = 'SELECT * FROM notifications';
				$result = $mysqli->query($query) or die($mysqli->error);

				$arr = array();

				while ($row = $result->fetch_assoc()) {
					$row['note'] = utf8_encode($row['note']);
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