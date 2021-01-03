#!/bin/bash

if [ -n "$CERTBOT_TOKEN" ]; then
    echo $CERTBOT_VALIDATION > webroot/.well-known/acme-challenge/$CERTBOT_TOKEN
fi

echo $CERTBOT_DOMAIN
echo $CERTBOT_VALIDATION
echo $CERTBOT_TOKEN
echo $CERTBOT_CERT_PATH
echo $CERTBOT_KEY_PATH
echo $CERTBOT_SNI_DOMAIN
echo $CERTBOT_AUTH_OUTPUT
