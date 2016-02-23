<?php

require 'shopifyPhpClass.php';

    $params = explode(",", $argv[1]);

    function generateRandomString($length = 6) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    try {
        $api = new \Shopify\PrivateAPI($params[0], $params[1], 'https://' . $params[2] . '.myshopify.com/admin');

        if (!$api->isLoggedIn() && !$api->login()) {
            echo 'invalid credentials';
        } else {

            # Create a 5% discount coupon
            $new_discount = ['discount' => [
                'applies_to_id' => '',
                'code' => generateRandomString(),
                'discount_type' => $params[3],
                'value' => (float)$params[4],
                'minimum_order_amount' => (float)$params[5]
            ]];

            # Set the CSRF token for the POST request
            try {
                $api->setToken('https://' . $params[2] . '.myshopify.com/admin/discounts/new');
            } catch (\Exception $ex) {
            }

            $do_discount = $api->doRequest('POST', 'discounts.json', $new_discount);

            if(is_object($do_discount)){
                echo $do_discount->discount->code;
            }else{
                echo "Error creating coupon :(, check to make sure that you have a shopify plus account";
            }
        }
    }
    catch(Exception $e){
        echo 'Message' . $e->getMessage();
    }
