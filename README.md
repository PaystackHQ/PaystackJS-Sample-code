# Barebones Checkout using PaystackJS

CONTENTS OF THIS FILE
---------------------
   
 * Introduction
 * Requirements
 * Files
 * Installation
 * Configuration
 * Run
 * Test Verve card
 * Security
 
## Introduction

You can now accept card details directly on your website while using PaystackJS to handle the checkout.

## Requirements

To run this sample, you need an apache server that supports:

- PHP 5.4
- TLSv1.2

## Files

### [pay.html](pay.html)

This contains divs and forms whose ids and attributes have been set to the minimum required
to conclude checkout. *Please only add attributes to these except `form#checkout-form` 
which is our sample checkout .*.

To make this work for you, add the divs and forms as they are to your existing checkout page
and style them as required.

*IMPORTANT NOTE:*

*TO AVOID MISTAKENLY SENDING ANY OF THE FORM INFORMATION TO YOUR BACKEND, DO NOT SET A `name`
FOR ANY OF THE FIELDS IN THE PAYMENT FORMS.*

### [js/main.js](js/main.js)

This handles paystack.js on your behalf leaving you to only style the divs in `pay.html`

### [js/app.js](js/app.js)

This contains sample checkout code that communicates with your backend to start a transaction,
report client side errors and verify transactions when successful.

This will need to change in accordance with your flow. Do note that [js/main.js](js/main.js)
calls 2 functions in this file: `reportErrorToBackend` and `verifyTransactionOnBackend`. If 
you have to change their names and/or parameters, remember to ensure [js/main.js](js/main.js)
is edited to use them properly

### [index.php](index.php)

This is a sample backend that communicates with paystack's API in the sample. You will probably
have to dispose of this after reading through the sample code.

Your own backend will have to expose endpoints for getting an access code and verifying a transaction.

### [.htaccess](.htaccess)

This is part of our sample backend which ensures index.php handles all requests. Again, you will
probably have to dispose of this too.

## Installation

Download the code and host on an Apache server that supports TLSv1.2 and at least PHP 5.4.

## Configuration

Edit [index.php](index.php) providing your secret key.

## Run

To run the sample, navigate to the folder where you unzipped the sample.

## Test Verve card

Here is a test Verve card you can use with a test secret key:

- Card PAN: `5060666666666666666`
- Card CVC: `123`
- Expiry Date: any future date
- PIN: `1234`
- OTP: `123456`

## Security

If you discover any security related issues, please email support@paystack.com instead of
using the issue tracker.

## Contact

For more enquiries and technical questions regarding this sample, please post
on our issue tracker: https://github.com/PaystackHQ/PaystackJS-Sample-code/issues.

