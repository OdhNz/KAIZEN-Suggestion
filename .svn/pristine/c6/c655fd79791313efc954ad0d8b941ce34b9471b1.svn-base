<?php

namespace App\Http\Controllers\OLD;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Cookie;
class MasterDataPicController extends Controller
{
    public function fetchMasterClassData()
    {
        // DB::connection()->enableQueryLog();

        try {
            $SQL = DB::select(
                " select company, code_class_id, eff_status, descr from GA_RSV_CLASS_CODE_T"
            );
            // $queries = DB::getQueryLog();
            //dd($queries);
            return $SQL;
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return [];
        }
    }
    public function userPicEmpFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = DB::select(
                "  SELECT company,
                            empid,
                            name,
                            dept_nm,
                            position_nm,
                            email,
                            phone
                        FROM PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF a
                    WHERE   company = '$company' 
                            AND  NOT EXISTS
                                    (SELECT 1
                                    FROM GA_RSV_USER_T b
                                    WHERE a.empid = b.empid)
                            AND erp_dept_nm = 'GA'
                    ORDER BY name"
            );
            return $SQL;
        } catch (\Exception $e) {
            error_log($e->getMessage());
            return [];
        }
    }

    public function userPicFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = DB::select(
                " SELECT b.company,
                        empid,
                        name,
                        dept_nm,
                        position_nm,
                        email,
                        phone
                FROM PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF a
                    JOIN GA_RSV_CLASS_CODE_T b ON (a.empid = b.code_id)
                WHERE b.company = '$company' 
                    AND code_class_id = 'GA_RSV_PIC'"
            );
            return $SQL;
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return [];
        }
    }
    public function userPicInsert(Request $r)
    {
        $company = $r->company;
        $empid = $r->empid;
        $login_id = $r->login_id;
        try {
            $SQLInsert = "INSERT INTO GA_RSV_CLASS_CODE_T (
                            code_class_id,
                            company,
                            code_id,
                            code_nm,
                            eff_status,
                            add_person_id,
                            add_dttm,
                            upd_person_id,
                            upd_dttm)
                             VALUES ('GA_RSV_PIC', ?, ?, 'PIC','A', ?, SYSDATE, ?, SYSDATE)";

            $SQL = DB::update($SQLInsert, [
                $company,
                $empid,
                $login_id,
                $login_id,
            ]);
            return $SQL;
        } catch (\Exception $e) {
            error_log($e->getMessage());
        }
    }

    public function userPicDelete(Request $r)
    {
        $company = $r->company;
        $empid = $r->empid;
        $login_id = $r->login_id;
        try {
            $SQLDelete =
                "DELETE FROM GA_RSV_CLASS_CODE_T WHERE code_class_id = 'GA_RSV_PIC' AND company= ? AND code_id = ?";

            $SQL = DB::delete($SQLDelete, [$company, $empid]);
            return $SQL;
        } catch (\Exception $e) {
            error_log($e->getMessage());
        }
    }
}
