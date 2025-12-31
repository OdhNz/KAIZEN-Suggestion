<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Illuminate\Http\Request;

class JWTMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->cookie('jwt');
        $secretKey = env('JWT_SECRET');

        if (!$token) {
            return response()->json(['error' => 'No token provided.'], 401);
        }

        try {
            $credentials = JWT::decode($token, new Key($secretKey, 'HS256'));
        } catch (ExpiredException $e) {
            return response()->json(
                ['error' => 'Provided token is expired.'],
                401
            );
        } catch (SignatureInvalidException $e) {
            return response()->json(
                ['error' => 'Wrong signature token or secret key.'],
                401
            );
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'An error occurred while decoding the token.'],
                401
            );
        }

        return $next($request);
    }
}
