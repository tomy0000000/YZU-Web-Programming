<?php

require_once('tcpdf/tcpdf_import.php');

/*---------------- Print PDF Start -----------------*/
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetFont('cid0jp','', 18);
$pdf->AddPage();

$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$address = $_POST['address'];
$product = $_POST['product'];
$model = $_POST['model'];
$ordernum = $_POST['ordernum'];
$html = <<<EOF
<style>
    img {
        width: 480px;
    }
    #caution {
        text-align: center;
    }
    table {
        border-left: 2px solid #cccccc;
        border-right: 2px solid #cccccc;
        border-top: 2px solid #cccccc;
        border-bottom: 2px solid #cccccc;
    }
    th {
        text-align: center;
        color: #ffffff;
        background-color: #2b2c2d;
    }
    td {
        padding: 6px 12px;
    }
    .first {
        background-color: #e9e9e9;
    }
    .second {
        background-color: #ffffff;
    }
</style>
<table>
    <tr class="first">
        <th colspan="4">
            Order #$ordernum
        </th>
    </tr>
    <tr class="second">
        <td colspan="4">
            <br>
            <img src="./pics/sentorder/revo-juliet.jpg" alt="Product Image" width="480" align="center">
        </td>
    </tr>
    <tr class="first">
        <td colspan="4" align="center">請於7天內持本訂單編號至實體店舖完成訂單</td>
    </tr>
    <tr class="second">
        <td>訂購人姓名</td>
        <td>$name</td>
        <td>電話</td>
        <td>$phone</td>
    </tr>
    <tr class="first">
        <td>Email</td>
        <td colspan="3">$email</td>
    </tr>
    <tr class="second">
        <td>地址</td>
        <td colspan="3">$address</td>
    </tr>
    <tr class="first">
        <td>$product</td>
        <td>$model</td>
        <td>1</td>
        <td>$449</td>
    </tr>
    <tr class="second">
        <td colspan="2"></td>
        <td>Total</td>
        <td>$449</td>
    </tr>
</table>
EOF;
/*----------------- Barcode Start ------------------*/
$style = array(
    'position' => '',
    'align' => 'C',
    'stretch' => false,
    'fitwidth' => true,
    'cellfitalign' => '',
    'border' => true,
    'hpadding' => 'auto',
    'vpadding' => 'auto',
    'fgcolor' => array(0,0,0),
    'bgcolor' => false,
    'text' => true,
    'font' => 'helvetica',
    'fontsize' => 8,
    'stretchtext' => 4
);
$pdf->write1DBarcode($ordernum, 'C39', '75', '', '50', 18, 0.4, $style, 'N');
/*------------------ Barcode End -------------------*/
$pdf->writeHTML($html);
$pdf->lastPage();
$pdf->Output('order.pdf', 'I');

/*---------------- Print PDF End -------------------*/

/*---------------- Sent Mail Start -----------------*/
$to = $email;
$subject = 'Your Order #'.$ordernum.' at Pure Cycles';
$message = <<<EOF
<style>
    img {
        width: 480px;
    }
    #caution {
        text-align: center;
    }
    table {
        border-left: 2px solid #cccccc;
        border-right: 2px solid #cccccc;
        border-top: 2px solid #cccccc;
        border-bottom: 2px solid #cccccc;
    }
    th {
        text-align: center;
        color: #ffffff;
        background-color: #2b2c2d;
    }
    td {
        padding: 6px 12px;
    }
    .first {
        background-color: #e9e9e9;
    }
    .second {
        background-color: #ffffff;
    }
</style>
<table border="1">
    <tr class="first">
        <th colspan="4">
            Order #$ordernum
        </th>
    </tr>
    <tr class="second">
        <td colspan="4" align="center">請於7天內持本訂單編號至實體店舖完成訂單</td>
    </tr>
    <tr class="first">
        <td>訂購人姓名</td>
        <td>$name</td>
        <td>電話</td>
        <td>$phone</td>
    </tr>
    <tr class="second">
        <td>Email</td>
        <td colspan="3">$email</td>
    </tr>
    <tr class="first">
        <td>地址</td>
        <td colspan="3">$address</td>
    </tr>
    <tr class="second">
        <td>$product</td>
        <td>$model</td>
        <td>1</td>
        <td>$449</td>
    </tr>
    <tr class="first">
        <td colspan="2"></td>
        <td>Total</td>
        <td>$449</td>
    </tr>
</table>
EOF;
$headers[] = 'From: Pure Cycles<order@purecycles.com>';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';

mail($to, $subject, $message, implode("\r\n", $headers));
/*---------------- Sent Mail End -------------------*/

?>