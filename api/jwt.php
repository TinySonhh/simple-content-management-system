<?php
require_once __DIR__ . '/jwt.core.php';

class MyJWT {
    //create a singleton instance, also called a static instance and initialize the class if it is not already initialized
    private static $_instance = null;
    public static function get(): MyJWT {
        if (self::$_instance === null) {
            self::$_instance = new MyJWT();
        }
        return self::$_instance;
    }
    public static function create(): MyJWT {
        return new MyJWT();
    }

    private $secret_key;
    private $algorithm;

    public function __construct() {
        $this->secret_key = env('APP_KEY');
        $this->algorithm = env('APP_ALGORITHM', 'HS256');
    }

    public function createToken($payload=[]) {
        $payload['iat'] = time();
        $payload['exp'] = time() + env('SESSION_LIFETIME', 3600);
        
        $jwt = JWT::encode($payload, $this->secret_key, $this->algorithm);
        $_SESSION['jwt'] = $jwt;

        return $jwt;
    }

    public function decodeToken($token, $callbackFailed = null) {
        try {
            $decoded = JWT::decode($token, $this->secret_key, [$this->algorithm]);
            return $decoded;
        } catch (Exception $e) {
            if($callbackFailed){
                if (is_callable($callbackFailed)) {
                    $callbackFailed($e);
                }
            }
        }
        return null;
    }
}
