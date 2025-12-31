<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class MasterRepairmentController extends Controller
{
    public function masterRprmFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "  SELECT a.t_default AS company,
                                a.c_group as group_id,
                                a.c_comcode AS master_cd,
                                a.n_comname AS master_nm,
                                a.c_hr_code AS status,
                                NVL (b.n_hr_name, a.n_hr_name) AS group_type,
                                DECODE(NVL (b.n_hr_name, a.n_hr_name), 'DOM', 'Dormitory', 'GEN', 'General') AS group_type_nm,
                                a.t_buffer AS group_cd,
                                b.n_comname AS group_nm
                            FROM TRTB_M_COMMON a
                                LEFT JOIN TRTB_M_COMMON b
                                    ON (b.c_group = 'GR3' AND a.t_buffer = b.c_comcode)
                        WHERE     a.c_group IN ('GR3', 'GR4')
                                AND a.c_hr_code = 'A'
                                AND (a.t_default IS NULL OR a.t_default = '$company')
                        ORDER BY a.c_group, a.t_buffer, a.n_comname";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function masterRprmLocationFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "  SELECT a.t_default AS company,
                                a.c_group as group_id,
                                a.c_comcode AS master_cd,
                                a.n_comname AS master_nm,
                                a.c_hr_code AS status,
                                NVL (b.n_hr_name, a.n_hr_name) AS group_type,
                                DECODE(NVL (b.n_hr_name, a.n_hr_name), 'DOM', 'Dormitory', 'GEN', 'General') AS group_type_nm,
                                a.t_buffer AS group_cd,
                                b.n_comname AS group_nm
                            FROM TRTB_M_COMMON a
                                LEFT JOIN TRTB_M_COMMON b
                                    ON (b.c_group = 'GR1' AND a.t_buffer = b.c_comcode)
                        WHERE     a.c_group IN ('GR1', 'GR2')
                                AND a.c_hr_code = 'A'
                                AND (a.t_default IS NULL OR a.t_default = '$company')
                        ORDER BY a.c_group, a.t_buffer, a.n_comname";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function masterRprmGrpFetch(Request $r)
    {
        $company = $r->company;
        $masterId = $r->masterId;
        try {
            $SQL = "SELECT a.t_default as company,
                    a.c_group,
                    a.c_comcode as code_id,
                    a.n_comname as code_nm,
                    a.c_comcode as value,
                    a.n_comname as label,
                    a.n_hr_name as group_type
                FROM TRTB_M_COMMON a
                where c_group = '$masterId' AND c_hr_code = 'A' AND (t_default is null or t_default = '$company')";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function masterRprmGrpInsert(Request $r)
    {
        $company = $r->company;
        $status = $r->status;
        $masterCd = $r->masterCd;
        $masterNm = $r->masterNm;
        $remark = $r->remark;
        $repairGrp = $r->repairGrp;
        $newGrp = $r->newGrp;
        $groupType = $r->groupType;
        $groupId = $r->groupId;
        $login_id = $r->login_id;

        if (empty($repairCd)) {
            $sqlMessage = "Data added successfully!";
        } else {
            $sqlMessage = "Data update successfully!";
        }
        try {
            $SQLInsert = "MERGE INTO trtb_m_common a
                            USING DUAL b
                                ON (a.c_group = '$groupId' AND a.c_comcode = '$masterCd')
                        WHEN MATCHED
                        THEN
                        UPDATE SET c_hr_code = '$status',
                                    n_comname = '$masterNm',
                                    N_hr_name = '$groupType'
                        WHEN NOT MATCHED
                        THEN
                        INSERT     (c_group,
                                    t_default,
                                    c_comcode,
                                    n_comname,
                                    c_hr_code,
                                    d_comname,
                                    n_hr_name,
                                    i_emp_no,
                                    d_reg)
                            VALUES ('$groupId',
                                    '$company',
                                    (SELECT 'RG' || (COUNT (1) + 1)
                                        FROM trtb_m_common
                                        WHERE c_group = '$groupId'),
                                    '$masterNm',
                                    '$status',
                                    'GA_RSV_UTILITY',
                                    '$groupType',
                                    '$login_id',
                                    SYSDATE)";

            $SQL = DB::update($SQLInsert);
            return ["data" => $SQL, "message" => $sqlMessage];
        } catch (\Exception $e) {
            return [
                "message" => "Data failed to add!",
                "err_msg" => $e->getMessage(),
            ];
        }
    }
    public function masterRprmInsert(Request $r)
    {
        $company = $r->company;
        $status = $r->status;
        $repairNm = $r->repairNm;
        $repairCd = $r->repairCd;
        $remark = $r->remark;
        $repairGrp = $r->repairGrp;
        $newGrp = $r->newGrp;
        $groupId = $r->groupId;
        $login_id = $r->login_id;

        if (empty($repairCd)) {
            $sqlMessage = "Data added successfully!";
        } else {
            $sqlMessage = "Data update successfully!";
        }
        try {
            $SQLInsert = "MERGE INTO trtb_m_common a
                            USING DUAL b
                                ON (a.c_group = '$groupId' AND a.c_comcode = ?)
                        WHEN MATCHED
                        THEN
                        UPDATE SET c_hr_code = ?,
                                    n_comname = ?,
                                    t_buffer = ?
                        WHEN NOT MATCHED
                        THEN
                        INSERT     (c_group,
                                    t_default,
                                    c_comcode,
                                    n_comname,
                                    c_hr_code,
                                    t_buffer,
                                    d_comname,
                                    i_emp_no,
                                    d_reg)
                            VALUES ('$groupId',
                                    ?,
                                    (SELECT 'R' || (COUNT (1) + 1)
                                        FROM trtb_m_common
                                        WHERE c_group = '$groupId'),
                                    ?,
                                    ?,
                                    ?,
                                    'GA_RSV_UTILITY',
                                    ?,
                                    SYSDATE)";

            $SQL = DB::update($SQLInsert, [
                $repairCd,
                $status,
                $repairNm,
                $repairGrp,
                $company,
                $repairNm,
                $status,
                $repairGrp,
                $login_id,
            ]);
            return ["data" => $SQL, "message" => $sqlMessage];
        } catch (\Exception $e) {
            return [
                "message" => "Data failed to add!",
                "err_msg" => $e->getMessage(),
            ];
        }
    }

    public function masterRprmDelete(Request $r)
    {
        $company = $r->company;
        $group_id = $r->group_id;
        $master_cd = $r->master_cd;
        $login_id = $r->login_id;
        try {
            $SQL =
                "UPDATE trtb_m_common SET c_hr_code = 'I', D_BUFFER = SYSDATE WHERE t_default = ? AND c_group = ? AND c_comcode = ?";

            $SQLDelete = DB::update($SQL, [
                //$login_id,
                $company,
                $group_id,
                $master_cd,
            ]);
            return [
                "data" => $SQLDelete,
                "message" => "Data deleted successfully!",
            ];
        } catch (\Exception $e) {
            return [
                "message" => "Data deletion failed!",
                "err_msg" => $e->getMessage(),
            ];
        }
    }
}
