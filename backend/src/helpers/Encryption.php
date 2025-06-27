<?php

define("KEY", "7dd8de8e0999bce1040bb141a599615e65433fab936db550995a5c1c020bc265");


/**
 * Encrypt a string
 *
 * @param string $data The data to encrypt
 * @return string The encrypted data in format: iv:encrypted_data
 */
function encrypt($data)
{
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', KEY, 0, $iv);
    return base64_encode($iv . ':' . $encrypted);
}

/**
 * Decrypt a string
 *
 * @param string $data The encrypted data in format: iv:encrypted_data
 * @return string|false The decrypted string or false on failure
 */
function decrypt($data)
{
    $data = base64_decode($data);
    $parts = explode(':', $data);
    if (count($parts) !== 2)
        return false;

    list($iv, $encrypted) = $parts;
    return openssl_decrypt($encrypted, 'aes-256-cbc', KEY, 0, $iv);
}