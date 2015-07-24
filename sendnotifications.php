<?php
    /* Send an SMS using Twilio. You can run this file 3 different ways:
     *
     * - Save it as sendnotifications.php and at the command line, run 
     *        php sendnotifications.php
     *
     * - Upload it to a web host and load mywebhost.com/sendnotifications.php 
     *   in a web browser.
     * - Download a local server like WAMP, MAMP or XAMPP. Point the web root 
     *   directory to the folder containing this file, and load 
     *   localhost:8888/sendnotifications.php in a web browser.
     */

    // Step 1: Download the Twilio-PHP library from twilio.com/docs/libraries, 
    // and move it into the folder containing this file.
    require "twilio-php-master/Services/Twilio.php";
    require "api_keys.php";
// Step 2: set our AccountSid and AuthToken from www.twilio.com/user/account
$AccountSid = "AC7a08e45fdc82a897753058314a687027";
$AuthToken = "9b7cd22c616ed010a391d93d8c37df18";
    
    // Step 3: instantiate a new Twilio Rest Client
    $client = new Services_Twilio($AccountSid, $AuthToken);

    // Step 4: make an array of people we know, to send them a message. 
    // Feel free to change/add your own phone number and name here.
    $people = array(
    #    "+14232902358" => "Nancy Wong",
        "+17069565023" => "ME"
        #"+14232807609" => "Sophie",
    );

    // Step 5: Loop over all our friends. $number is a phone number above, and 
    // $name is the name next to it
    foreach ($people as $number => $name) {

        $sms = $client->account->messages->sendMessage(

        // Step 6: Change the 'From' number below to be a valid Twilio number 
        // that you've purchased, or the (deprecated) Sandbox number
            "706-956-5023", 

            // the number we are sending to - Any phone number
            $number,

            // the sms body
            "Hey $name, Monkey Party at 6PM. Bring Bananas!",

            array("https://demo.twilio.com/owl.png", "https://demo.twilio.com/logo.png")
        );

        // Display a confirmation message on the screen
        echo "Sent message to $name";
    }

    $client->account->messages;
