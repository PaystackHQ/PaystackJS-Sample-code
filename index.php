<?php
require_once 'vendor/autoload.php';

// documented at https://github.com/yabacon/paystack-php
use Yabacon\Paystack;
use Yabacon\Paystack\MetadataBuilder;

define('PAYSTACK_SECRET', 'sk_test_badb30a68e7aa6913d8c6d4d7dda2b765f4c785c');

$path = filter_input(INPUT_GET, 'path');

// sample code to start a transaction
// more about thr transaction/initialize enpoint
// here: https://developers.paystack.co/v1.0/reference#initialize-a-transaction
if($path === 'new-access-code'){
    if(!(($email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) 
        && ($amount = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_FLOAT)))){
        http_response_code(400);
        die('Invalid Email or amount sent');
    }

    $amountinkobo = 100 * $amount;
    $builder = new MetadataBuilder();
    $builder->withCustomField('Started From', 'sample charge card backend');
    time()%2 && $builder->withCustomFilters(['recurring'=>true]);
    $metadata = $builder->build();

    try{
        $paystack = new Paystack(PAYSTACK_SECRET);
        $paystack->disableFileGetContentsFallback();
        $trx = $paystack->transaction->initialize([
            'amount'=>$amountinkobo,
            'email'=>$email,
            'metadata'=>$metadata,
        ]);
    } catch(Exception $e){
        http_response_code(400);
        die($e->getMessage());
    }

    die($trx->data->access_code);
}

// sample code to verify a transaction reference
// more about the transaction/verify enpoint
// here: https://developers.paystack.co/v1.0/reference#verifying-transactions
if(strpos($path, 'verify/') === 0){
    // whatever is after verify is our refernce
    $reference = substr($path, 7);

    try{
        $paystack = new Paystack(PAYSTACK_SECRET);
        $paystack->disableFileGetContentsFallback();
        $trx = $paystack->transaction->verify([
            'reference'=>$reference,
        ]);
    } catch(Exception $e){
        http_response_code(400);
        die($e->getMessage());
    }

    if($trx->data->status === 'success'){
        // give value
    }

    // dump gateway response for display to user
    die($trx->data->gateway_response);
}

// our payment form
if($path === 'payment'){
    include_once 'pay.html';
    die();
}

// our payment form
if(($path === '/') || ($path === '')){
    include_once 'pay.html';
    die();
}

// log a client-side error
if($path === 'report'){
    file_put_contents('client-errors.log', "\n".json_encode($_POST), FILE_APPEND);
    die();
}

// if it got here, it was neither of the recognized paths
// show the welcome message
http_response_code(404);
?><p>Your server is set up.
    <br>/<?php echo $path; ?> does not exist<br>
    Open <i>/payment</i> to test the form.
    </p>
