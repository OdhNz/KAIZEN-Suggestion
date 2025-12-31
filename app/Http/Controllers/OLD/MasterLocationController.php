<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class MasterLocationController extends Controller
{
    public function masterLocationFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "SELECT a.t_default as company,
                    a.c_group,
                    a.c_comcode as location_cd,
                    a.n_comname as location_nm,
                    a.c_hr_code as status,
                    a.t_buffer as location_grp_cd,
                    b.n_comname as location_grp_nm
                FROM TRTB_M_COMMON a join TRTB_M_COMMON b on (b.c_group = 'GR1' and a.t_buffer = b.c_comcode)
                where a.c_group = 'GR2' AND a.c_hr_code = 'A' AND (a.t_default is null or a.t_default = '$company')
                order by a.t_buffer, a.n_comname";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function masterLocationGrpFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "SELECT a.t_default as company,
                    a.c_group,
                    a.c_comcode as code_id,
                    a.n_comname as code_nm
                FROM TRTB_M_COMMON a
                where c_group = 'GR1' AND c_hr_code = 'A' AND (t_default is null or t_default = '$company')";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function masterLocationInsert(Request $r)
    {
        // $company = $r->company;
        // $status = $r->status;
        // $locationNm = $r->locationNm;
        // $remark = $r->remark;
        // $locationGrp = $r->locationGrp;
        // $locationCd = $r->locationCd;
        // $login_id = $r->login_id;

        // if (empty($locationCd)) {
        //     $sqlMessage = "Data added successfully!";
        // } else {
        //     $sqlMessage = "Data update successfully!";
        // }
        try {
            //     $SQLInsert = "MERGE INTO trtb_m_common a
            //                     USING DUAL b
            //                         ON (a.c_group = 'GR2' AND a.c_comcode = ?)
            //                 WHEN MATCHED
            //                 THEN
            //                 UPDATE SET c_hr_code = ?,
            //                             n_comname = ?,
            //                             t_buffer = ?
            //                 WHEN NOT MATCHED
            //                 THEN
            //                 INSERT     (c_group,
            //                             t_default,
            //                             c_comcode,
            //                             n_comname,
            //                             c_hr_code,
            //                             t_buffer,
            //                             d_comname,
            //                             i_emp_no,
            //                             d_reg)
            //                     VALUES ('GR2',
            //                             ?,
            //                             (SELECT 'L' || (COUNT (1) + 1)
            //                                 FROM trtb_m_common
            //                                 WHERE c_group = 'GR2'),
            //                             ?,
            //                             ?,
            //                             ?,
            //                             'GA_RSV_UTILITY',
            //                             ?,
            //                             SYSDATE)";

            //     $SQL = DB::update($SQLInsert, [
            //         $locationCd,
            //         $status,
            //         $locationNm,
            //         $locationGrp,
            //         $company,
            //         $locationNm,
            //         $status,
            //         $locationGrp,
            //         $login_id,
            //     ]);
            return ["data" => "sadasdas", "message" => "aafasdfs"];
        } catch (\Exception $e) {
            return ["message" => "Data failed to add!"];
        }
    }

    public function masterLocationDelete(Request $r)
    {
        $company = $r->company;
        $location_cd = $r->location_cd;
        $login_id = $r->login_id;
        try {
            $SQL =
                "UPDATE trtb_m_common SET c_hr_code = 'I', D_BUFFER = SYSDATE WHERE t_default = ? AND c_group = 'GR2' AND c_comcode = ?";

            $SQLDelete = DB::update($SQL, [$login_id, $company, $location_cd]);
            return [
                "data" => $SQLDelete,
                "message" => "Data deleted successfully!",
            ];
        } catch (\Exception $e) {
            return ["message" => "Data deletion failed!"];
        }
    }
}
