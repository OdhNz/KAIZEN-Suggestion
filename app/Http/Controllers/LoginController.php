<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class LoginController extends Controller
{
    function generateToken($user)
    {
        $payload = [
            'sub' => $user->empid,
            'company' => $user->company,
            'status' => $user->status,
            'empid' => $user->empid,
            'empno' => $user->empno,
            'name' => $user->name,
            'gender_nm' => $user->gender_nm,
            'position_nm' => $user->position_nm,
            'deptcd' => $user->deptcd,
            'parent_dept_cd' => $user->parent_dept_cd,
            'parent_dept_nm' => $user->parent_dept_nm,
            'role' => $user->role,
            'login_id' => $user->login_id,
            'remark' => $user->remark,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + 9 * 60 * 60,
        ];
        return JWT::encode($payload, env('JWT_SECRET'), 'HS256');
    }

     /**
     * Simpan foto ke storage/app/public/profile_photos/{empid}.jpg
     */
    protected function storeProfilePhoto(string $empid): void
{
    $url = "https://gw.taekwang.com/images/ProfilePhoto/{$empid}.jpg";
    $path = "profile_photos/{$empid}.jpg";

    try {
        if (!Storage::disk('public')->exists('profile_photos')) {
            Storage::disk('public')->makeDirectory('profile_photos');
        }

        $response = Http::withOptions(['verify' => false])->get($url);

        if (!$response->successful()) {
            \Log::error("Download gagal untuk {$url}, status: ".$response->status());
            return;
        }

        Storage::disk('public')->put($path, $response->body());
        \Log::info("Foto tersimpan di {$path}");
    } catch (\Throwable $e) {
        \Log::error("storeProfilePhoto error: ".$e->getMessage());
    }
}


    public function login(Request $r)
    {
        $empid = $r->empid;
        $pass = $r->password;
        $auth = $r->auth;
        $pass = empty($pass) ? "Default" : $pass;
        $message = "";
        $JWT = "";
        $status = 200;
        try {
            $SQL = DB::select(
                "SELECT B.COMPANY,
                            A.STATUS,
                            B.EMPID,
                            B.EMPNO,
                            B.NAME,
                            B.GENDER_NM,
                            B.POSITION_NM,
                            B.DEPTCD,
                            B.ORG_LVL10 AS PARENT_DEPT_CD,
                            B.ORG_LVL10_NM AS PARENT_DEPT_NM,
                            A.ROLE,
                            C.LOGIN_ID,
                            B.EMAIL,
                            A.REMARK
                        FROM PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF B
                            JOIN KAIZEN_USER_T A ON (A.EMPID = B.EMPNO),
                            TDSBIZ.TKGW_USER_IAM_LGC_TBL@DL_TTAMESTOVTAMES C,
                            GA_RSV_AUTH_V D
                        WHERE     B.EMPNO = C.EMP_NO
                        AND (C.SHA_PWD = TDSBIZ.F_HASH_SHA256@DL_TTAMESTOVTAMES (:PASS) OR (c.emp_no = b.empno AND d.auth = :AUTH))
                        AND B.EMPNO = :EMPID",
                ['PASS' => $pass, 'AUTH' => $auth, 'EMPID' => $empid]
            );
            if (empty($SQL[0]->empid)) {
                $message =
                    "Authentication failed! Please double check your username and password...";
                $status = 400;
                return [
                    "status" => $status,
                    "meesage" => $message,
                ];
            }
            // Simpan foto otomatis
            $this->storeProfilePhoto($SQL[0]->empid);

            $JWT = $this->generateToken($SQL[0]);
            $JWTCookie = JWT::encode(
                ['value' => env('JWT_DESC')],
                env('JWT_SECRET'),
                'HS256'
            );
            $lifetime = 9 * 60;
            $cookie = Cookie::make(
                'jwt',
                $JWTCookie,
                $lifetime,
                null,
                null,
                false,
                true
            );
            $status = 200;
            return response()
                ->json([
                    "token" => $JWT,
                    "status" => $status,
                    "meesage" => $message,
                ])
                ->withCookie($cookie);
        } catch (\Exception $e) {
            $message = $e->getMessage();
            return ["message" => $message, "status" => 400];
        }
    }
    public function logout(Request $r)
    {
        try {
            $lifetime = -1;
            $cookie = Cookie::make(
                'jwt',
                "test",
                $lifetime,
                null,
                null,
                false,
                true
            );
            return response()
                ->json([
                    "status" => 200,
                ])
                ->withCookie($cookie);
        } catch (\Exception $e) {
            $message = $e->getMessage();
            return ["message" => $message, "status" => 400];
        }
    }

    /**
     * Route fallback untuk serve foto dari storage tanpa symlink
     */
    public function showPhoto(string $empid)
    {
        $path = storage_path("app/public/profile_photos/{$empid}.jpg");
    
        if (!file_exists($path)) {
            return response()->file(public_path('default-avatar.jpg'));
        }
    
        return response()->file($path, [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'max-age=86400, public',
        ]);
    }

}
