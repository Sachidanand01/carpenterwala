<?php
	//Database (DB) Information Here
	$servername = "sql100.epizy.com";
	$username = "epiz_25083465";
	$password = "g69mTbSuJmA2D";
	$dbname = "epiz_25083465_message";

	//Create and Check DB connection
	
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	if($conn->connect_error){
	    die("Connection failed:" . $conn->connect_error);
	}
	
	//Create variables for each piece of information to be added to the DB table
	$Name = $_POST["Name"];
	$Mobile = $_POST["Mobile"];
	$Email = $_POST["Email"];
	$Messages = $_POST["Messages"];
	
	//Create SQL string
	$sql = "INSERT INTO message (Name, Mobile, Email, Messages)
	VALUES ('$Name', '$Mobile', '$Email',  '$Messages' )";
	
	//send Query and check to ensure there are no errors
	
	if($conn->query($sql) === TRUE)
	{
	echo "Thank you! Please check our WhatsApp Catlogue for price";
	}
	else
	{
	   "Error: " . $sql . "<br>". $conn->error;
	}
	//Close DB connection
	$conn->close();

    function test_input($data){
        $data=trim();
        $data=stripslashes($data);
        $data=htmlspecialchars($data);
        return $data;
    }
?>