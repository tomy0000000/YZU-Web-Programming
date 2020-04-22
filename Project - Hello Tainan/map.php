<?php
$code = $_GET["code"];
header("Access-Control-Allow-Origin: *");
$context = stream_context_create(array("http" => array('method' => "GET",
    'header' => "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36\r\n"
    . "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8\r\n"
    . "Accept-Encoding:gzip, deflate\r\n"
    . "Accept-Language:zh-TW,zh;q=0.9,en;q=0.8\r\n"
    . "Connection:keep-alive\r\n"
    )));
$url = "http://www.2384.com.tw/qrcode/vstop?code=".(string)$code;
$res = file_get_contents($url, false, $context);
print($res);
?>