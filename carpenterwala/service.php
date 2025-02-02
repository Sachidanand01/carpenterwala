<?php

	//Database (DB) Information Here
	$servername = "sql100.infinityfree.com";
	$username = "epiz_25083465";
	$password = "g69mTbSuJmA2D";
	$dbname = "epiz_25083465_prospect";

    //Create and Check DB connection
	
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	if($conn->connect_error){
	die("Connection failed:" . $conn->connect_error);
	}
	
	//Create variables for each piece of information to be added to the DB table
	$name = $_POST["name"];
	$mobile = $_POST["mobile"];
	$servicetype = $_POST["servicetype"];

	
	//Create SQL string
	$sql = "INSERT INTO Lead (date, name, mobile, servicetype)
	VALUES (sysdate,'$name', '$mobile', '$servicetype')";
	
	//send Query and check to ensure there are no errors
    if ($conn->query($sql) === TRUE) {
    echo '<script>alert("Message Sent")</script>';
    header('Location: index.html');
    exit();
    } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    header('Location: index.html');
    exit();
    }

    
	//Close DB connection
	$conn->close();
    
?>