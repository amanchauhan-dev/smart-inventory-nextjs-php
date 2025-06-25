<?php

namespace Src\Helpers;

class JWT
{
    private static $secret_key = 'your_super_secret_key'; // change this

    public static function encode($payload, $expiry = 7 * 24 * 3600)
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload['exp'] = time() + $expiry;

        $base64UrlHeader = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
        $base64UrlPayload = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');

        $signature = hash_hmac('sha256', "$base64UrlHeader.$base64UrlPayload", self::$secret_key, true);
        $base64UrlSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

        return "$base64UrlHeader.$base64UrlPayload.$base64UrlSignature";
    }

    public static function decode($jwt)
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3)
            return null;

        [$header, $payload, $signature] = $parts;
        $rawSig = hash_hmac('sha256', "$header.$payload", self::$secret_key, true);
        $validSig = rtrim(strtr(base64_encode($rawSig), '+/', '-_'), '=');

        if (!hash_equals($validSig, $signature))
            return null;

        $decoded = json_decode(base64_decode($payload), true);
        if ($decoded['exp'] < time())
            return null;

        return $decoded;
    }
}
