<?php

 if(isset($_POST['sendmsg']))
        {
                $mobile = $_POST["mobile"];
                $name = $_POST["name"];


                    $field = array(
                        "sender_id" => "FSTSMS",
                        "language" => "english",
                        "route" => "qt",
                        "numbers" => "8095551001",
                        "message" => "22697",
                        "variables" => "{#BB#}|{#DD#}",
                        "variables_values" => $mobile|$name
                    );

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://www.fast2sms.com/dev/bulk",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_SSL_VERIFYHOST => 0,
  CURLOPT_SSL_VERIFYPEER => 0,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode($field),
  CURLOPT_HTTPHEADER => array(
    "authorization: TktWMymge5Kl4XpBdi0VYjcUO7SCaonz1vQfF2sNr8ExJHhZDu2ZFaGoHTf1rXW4sK6InmJcR9YxEiVM",
    "cache-control: no-cache",
    "accept: */*",
    "content-type: application/json"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

                    if ($err) {
                    echo "cURL Error #:" . $err;
                    } else {
                    echo $response;
                    }
//Quick Transactional Route Success Response:
                {
                    "return": true,
                    "request_id": "drhgp7cjyqxvfe9",
                    "message": [
                        "Message sent successfully"
                    ]
                }
    }
    
?>