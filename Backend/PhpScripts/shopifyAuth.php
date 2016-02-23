<?php

require 'shopifyPhpClass.php';

$params = explode(",", $argv[1]);

try {
    $api = new \Shopify\PrivateAPI($params[0], $params[1], 'https://' . $params[2] . '.myshopify.com/admin');

    if (!$api->isLoggedIn() && !$api->login()) {
        echo 'Invalid Credentials';
    } else {
        echo 'Valid Credentials';
    }
}
catch(Exception $e){
    echo 'Invalid Credentials';
}



