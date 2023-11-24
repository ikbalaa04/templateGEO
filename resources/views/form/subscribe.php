<?php
header('Content-type: application/json');

require 'php-mailer/Exception.php';
require 'php-mailer/PHPMailer.php';
require 'php-mailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer();
$emailTO = $emailBCC =  $emailCC = array(); $formEmail = '';

### Enter Your Sitename 
$sitename = 'Your Sitename';

### Enter your email addresses: @required
$emailTO[] = array( 'email' => 'email@yoursite.com', 'name' => 'Name' );

### Enable bellow parameters & update your CC email if require.
//$emailCC[] = array( 'email' => 'email@yoursite.com', 'name' => 'Your Name' );

### Enter Email Subject
$subject = "Subscribtion Notification" . ' - ' . $sitename; 

### If your did not recive email after submit form please enable below line and must change to your correct domain name. eg. noreply@example.com
//$formEmail = 'noreply@yoursite.com';

### Success Messages
$success = 'You have <strong>successfully</strong> Subscribed.';

if( $_SERVER['REQUEST_METHOD'] == 'POST') {
	if (isset($_POST["email"]) && $_POST["email"] != '' && !(empty($emailTO))) {
		### Form Fields
		$cf_email = $_POST["email"];

		### If you want use SMTP 
		// $mail->isSMTP();
		// $mail->SMTPDebug = 0;
		// $mail->Host = 'smtp_host';
		// $mail->Port = 587;
		// $mail->SMTPAuth = true;
		// $mail->Username = 'smtp_username';
		// $mail->Password = 'smtp_password';

		### Regular email configure
		$mail->IsHTML(true);
		$mail->CharSet = 'UTF-8';

		$mail->From = ($formEmail !='') ? $formEmail : $cf_email;
		$mail->FromName = $sitename;
		$mail->AddReplyTo($cf_email, $cf_email);
		$mail->Subject = $subject;
		
		foreach( $emailTO as $to ) {
			$mail->AddAddress( $to['email'] , $to['name'] );
		}
		
		### if CC found
		if (!empty($emailCC)) {
			foreach( $emailCC as $cc ) {
				$mail->AddCC( $cc['email'] , $cc['name'] );
			}
		}

		### Include Form Fields into Body Message
		$bodymsg  = isset($cf_email) ? "Subscribe Email: $cf_email<br><br>" : '';
		$bodymsg .= $_SERVER['HTTP_REFERER'] ? '<br>---<br><br>This email was sent from ['.$sitename.']: ' . $_SERVER['HTTP_REFERER'] : '';
		
		$mail->MsgHTML($bodymsg);
		$mailed = $mail->Send();
		$errors = $mail->ErrorInfo;
		
		if( $mailed === true ) {
			$response = ['result' => "success", 'message' => $success];
		} else {
			$response = ['result' => "error", 'message' => $errors];
		}
		echo json_encode($response);
	} else {
		echo json_encode([
			'result' => "error", 
			'message' => 'Please <strong>Fill up</strong> a correct and try again.'
		]);
	}
}