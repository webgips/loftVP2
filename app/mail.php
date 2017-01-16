<?php
$name = $_POST['name'];
$phone = $_POST['phone'];
$street = $_POST['street'];
$house = $_POST['house'];
$building = $_POST['building'];
$room = $_POST['room'];
$floor = $_POST['floor'];
$comment = $_POST['comment'];
$pay = $_POST['pay'];
$dontcall = $_POST['dontcall'];
$mailsubj= "Заказ от $name";
$message = "Заказ от пользователя: $name";
$mailsubj= "Заказ от $name";
$message = "Заказ от пользователя $name  Номер телефона: $phone 
Заказ по адресу: $street дом $house корпус $building этаж $floor квартира $room  
Комментарий к заказу: $comment 
Оплата: $pay Не перезванивать: $dontcall";



$result = mail("webgips@gmail.com", $mailsubj, $message);
echo json_encode(array(
	'status' => $result;
));