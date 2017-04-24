<?php
	session_start();
	
	//Connexion à la base de données
	try
	{
		$bdd = new PDO('mysql:host=localhost;dbname=test;charset=utf8', 'root', '');
	}
	catch (Exception $e)
	{
			die('Erreur : ' . $e->getMessage());
	}
?>
<!-- Début HTML-->
<html>
	
	<!-- Head -->
	<head>
		<title>Roulotte</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link href="Images/logo.png" type="image/png" rel="icon"/>
		<link rel="stylesheet" href="bootstrap/bootstrap.css"/>
	</head>
	
	<!-- Body -->
	<body>