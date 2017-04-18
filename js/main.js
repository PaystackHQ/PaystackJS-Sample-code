// You need not edit this file
// It's fully optimized to work with
// pay.html to conclude payment

function startPaystack(access_code){
    // Paystack object that will handle payment
    // Note that it is initialized asynchronously

    Paystack.init({
        access_code: access_code,
        form: "card-form"
    }).then(function(returnedObj){
        window.PAYSTACK = returnedObj;
        showCardEntry();
    }).catch(function(error){
        // If there was a problem, you may 
        // log to console (while testing)
        console.log("There was an error loading Paystack", error);
        // or report to your backend for debugging (in production)
        window.reportErrorToBackend(error);
    });

    function showCardEntry(){
        stopProcessing();
        $("#card-form").show();
        $("#failed").hide();
        $("#number").val('');
        $("#cvv").val('');
        $("#expiryMonth").val('');
        $("#expiryYear").val('');
        $("#card-form").submit(function(evt){
            startProcessing(evt);
            PAYSTACK.card.charge()
                .then(handleResponse, handleError);
        });
    }

    function startProcessing(e){
        e.preventDefault();
        $("#processing").show();
        e.target && $(e.target).hide();
        e.target && $(e.target).off('submit');
        $("#error").hide();
        $("#error-message").html('');
        $("#error-errors").html('');
    }

    function stopProcessing(){
        $("#processing").hide();
    }

    function startPinAuth(response){
        $("#pin-form").show();
        $("#pin-form").submit(function(e){
            startProcessing(e);
            PAYSTACK.card.charge({
                pin: fetchValueWhileClearingField('pin')
            }).then(handleResponse, handleError);
        });
    }

    function startOtpAuth(response){
        $("#otp-form").show();
        $("#otp-message").html(response.message);
        $("#otp-form").submit(function(e){
            startProcessing(e);
            PAYSTACK.card.validateToken({
                token: fetchValueWhileClearingField('otp')
            }).then(handleResponse, handleError);
        });
    }

    function start3dsAuth(response){
        $("#3ds-form").show();
        $("#3ds-message").html(response.message);
        $("#3ds-form").submit(function(e){
            startProcessing(e);
            PAYSTACK.card.verify3DS()
                .then(handleResponse, handleError);
        });
    }

    function startPhoneAuth(response){
        $("#phone-form").show();
        $("#phone-message").html(response.message);
        $("#phone-form").submit(function(e){
            startProcessing(e);
            PAYSTACK.card.validatePhone({
                phone: fetchValueWhileClearingField('phone')
            }).then(handleResponse, handleError);
        });
    }

    function showTimeout(response){
        $("#timeout").show();
        $("#timeout-message").html(response.message);
    }

    function showSuccess(response){
        $("#success").show();
        $("#success-message").html(response.message);
        $("#success-reference").html(response.data.reference);
        verifyTransactionOnBackend(response.data.reference);
    }

    function showFailed(response){
        $("#failed").show();
        $("#failed-message").html(response.message);
        showCardEntry();
    }

    function handleResponse(response){
        console.log(response);
        stopProcessing();
        switch(response.status) {
            case 'auth':
                switch(response.data.auth) {
                    case 'pin':
                        startPinAuth(response);
                        break;
                    case 'phone':
                        startPhoneAuth(response);
                        break;
                    case 'otp':
                        startOtpAuth(response);
                        break;
                    case '3DS':
                        start3dsAuth(response);
                        break;
                }
                break;
            case 'timeout':
                showTimeout(response);
                break;
            case 'success':
                showSuccess(response);
                break;
            case 'failed':
                showFailed(response);
                break;
        }
    }

    function handleError(error){
        $("#error").show();
        showPaystackError(error);
        console.log(error);
        reportErrorToBackend(error);
        showCardEntry();
    }

    function fetchValueWhileClearingField(id){
        var val = $('#'+id).val();
        $('#'+id).val('');
        return val;
    }

    function showPaystackError(error){
        if(!(typeof error.message === 'string')){
            // Not a paystack error
            return;
        }
        $("#error-message").html(error.message);
        if(!(Object.prototype.toString.call( error.errors ) === '[object Array]')){
            // Not an array of messages
            return;
        }
        var len = error.errors.length;
        // build the error string
        var errStr = '<ul>';
        for (i=0; i<len; ++i) {
            errStr = errStr+'<li>'+error.errors[i].field+': '+error.errors[i].message+'</li>';
        }
        $("#error-errors").html(errStr+'</ul>');
    }

}

