<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserReservationController extends Controller
{
    public function rsvUserFetch(Request $r)
    {
        $company = $r->company;
        $login_id = $r->login_id;
        try {
            $SQL = "  SELECT a.company,
                            a.rsv_id,
                            a.rsv_cd,
                            a.cd_nm,
                            a.form_id,
                            to_char(a.tl_date, 'yyyy-mm-dd') as tl_date,
                            a.status,
                            DECODE (a.status,
                                    'N', 'NEW',
                                    'P', 'ON GOING',
                                    'S', 'COMPLETE',
                                    'C', 'COMPLETE')
                                AS status_nm,
                            a.rsv_user,
                            p.name,
                            p.org_lvl10_nm as dept_nm,
                            decode(a.message, '', a.remark, 'Admin Message : ' || a.message) as remark,
                            b.loc_grp_cd,
                            b.loc_grp_id,
                            b.loc_grp_nm,
                            b.loc_cd,
                            b.loc_id,
                            b.loc_nm,
                            c.repair_grp_cd,
                            c.repair_grp_id,
                            c.repair_grp_nm,
                            c.repair_id,
                            c.repair_nm
                        FROM PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF p 
                            join GA_RSV_RESERVATION_T a on (p.company = a.company and p.empid = a.rsv_user)
                                JOIN GA_RSV_LOCATION_V b
                                    ON (    a.company = b.company
                                        AND a.location_grp = b.loc_grp_id
                                        AND a.location_dtl = b.loc_id)
                                JOIN GA_RSV_REPAIR_V c
                                    ON (    a.company = c.company
                                        AND a.repair_grp = c.repair_grp_id
                                        AND a.repair_type = c.repair_id)
                        WHERE a.rsv_id = (SELECT MAX (rsv_id)
                                            FROM GA_RSV_RESERVATION_T b
                                            WHERE  a.company = b.company AND a.rsv_cd = b.rsv_cd) and a.company = '$company'  and a.rsv_user = '$login_id'
                            ORDER BY a.rsv_id DESC";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvLocationFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "SELECT a.t_buffer AS GROUP_ID, a.c_comcode AS VALUE, a.n_comname AS label, n_hr_name as TYPE
                        FROM TRTB_M_COMMON a
                    WHERE t_default = '$company' AND c_hr_code = 'A' AND c_group = 'GR2'
                    ORDER BY n_comname";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvLocationGrpFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "  SELECT a.c_comcode AS VALUE, a.n_comname AS label, n_hr_name as TYPE
                            FROM TRTB_M_COMMON a
                        WHERE t_default = '$company' AND c_hr_code = 'A' AND c_group = 'GR1'
                        ORDER BY n_comname";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function rsvRepairGrpFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "SELECT c_group as class, c_comcode as value, n_comname as label, n_hr_name as TYPE
                    FROM TRTB_M_COMMON
                    WHERE t_default = '$company' and c_hr_code = 'A' AND c_group = 'GR3' 
                    order by n_comname";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvRepairFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "SELECT c_group as class, c_comcode as value, n_comname as label, t_buffer as group_id
                    FROM TRTB_M_COMMON
                    WHERE t_default = '$company' and c_hr_code = 'A' AND c_group = 'GR4' 
                    order by c_comcode ";
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
            $SQL = "SELECT a.company,
                    a.code_class_id,
                    a.code_id,
                    a.code_nm,
                    a.descr
                FROM GA_RSV_CLASS_CODE_T a
                where code_class_id = 'GA_RSV_LOCATION_GRP' AND eff_status = 'A' AND (company is null or company = '$company')";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvReviewFetch(Request $r)
    {
        $company = $r->company;
        $repairCd = $r->repairCd;
        try {
            $SQL = "SELECT score, remark
                        FROM GA_RSV_REVIEW_T
                        WHERE company = '$company' AND rsv_cd = '$repairCd'";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvRepairSet(Request $r)
    {
        $company = $r->company;
        $repairDt = $r->tl_date;
        $repairLoc = $r->repairLoc;
        $repairLocGrp = $r->repairLocGrp;
        $repairGrp = $r->repairGrp;
        $repairType = $r->repairType;
        $repairCd = $r->repairCd;
        $remark = $r->remark;
        $formType = $r->formType;
        $formDtl = $r->formDtl;
        $status = $r->status;
        $login_id = $r->login_id;
        $file = $r->file;

        try {
            $sqlMessage = empty($locationCd)
                ? "Data added successfully!"
                : "Data update successfully!";
            $SqlSelCd = empty($repairCd)
                ? DB::select("WITH DATA
                                AS (  SELECT COUNT (1) AS CD_NM
                                        FROM GA_RSV_RESERVATION_T
                                        WHERE TRUNC (ADD_DTTM) = TRUNC (SYSDATE)
                                    GROUP BY TL_DATE)
                            SELECT GA_RSV_CD.NEXTVAL AS CD,
                                TO_CHAR (SYSDATE, 'yymmdd') || '-' || LPAD (NVL (CD_NM + 1, 1), 3, '0') as cd_nm
                            FROM DUAL LEFT JOIN DATA ON (1 = 1)")
                : '';
            $repairCd = empty($repairCd)
                ? $formType . $SqlSelCd[0]->cd
                : $repairCd;
            $SQLInsert = "INSERT INTO GA_RSV_RESERVATION_T (
                                 COMPANY
                                ,RSV_CD
                                ,CD_NM
                                ,FORM_ID
                                ,TL_DATE
                                ,STATUS
                                ,RSV_USER
                                ,LOCATION_GRP
                                ,LOCATION_DTL
                                ,REPAIR_GRP
                                ,REPAIR_TYPE
                                ,REMARK
                                ,ADD_PERSON_ID
                                ,ADD_DTTM
                                ,UPD_PERSON_ID
                                ,UPD_DTTM
                            )
                             VALUES (?, ?, ?, ?, TO_DATE(?, 'dd/mm/yyyy'), ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE, ?, SYSDATE)";

            $SQL = DB::update($SQLInsert, [
                $company,
                $repairCd,
                $SqlSelCd[0]->cd_nm,
                $formType,
                $repairDt,
                $status,
                $login_id,
                $repairLocGrp,
                $repairLoc,
                $repairGrp,
                $repairType,
                $remark,
                $login_id,
                $login_id,
            ]);

            if ($r->hasFile("file")) {
                $filename = $file->getClientOriginalName();
                $fileOrgname = pathinfo(
                    $file->getClientOriginalName(),
                    PATHINFO_FILENAME
                );
                $fileSize = $file->getSize();
                $fileExt = $file->extension();
                $fileType = $file->getClientMimeType();
                $filePath =
                    $formType . "/" . $repairCd . time() . '.' . $fileExt;

                $SQLFileInsert = "INSERT INTO GA_RSV_FILE_T (
                                                COMPANY
                                                ,FORM_CD
                                                ,FORM_ID
                                                ,FORM_DTL
                                                ,FILE_NAME
                                                ,ORG_FILE_NAME
                                                ,EXT
                                                ,FILE_SIZE
                                                ,CONTENT_TYPE
                                                ,FILE_PATH
                                                ,ADD_PERSON_ID
                                                ,ADD_DTTM
                                                ,UPD_PERSON_ID
                                                ,UPD_DTTM
                                            )
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  SYSDATE, ?, SYSDATE)";

                $SQLFile = DB::update($SQLFileInsert, [
                    $company,
                    $repairCd,
                    $formType,
                    $formDtl,
                    $filename,
                    $fileOrgname,
                    $fileExt,
                    $fileSize,
                    $fileType,
                    $filePath,
                    $login_id,
                    $login_id,
                ]);
                if (
                    !Storage::disk('repair')->put(
                        $filePath,
                        file_get_contents($file)
                    )
                ) {
                    return false;
                }
            }
            $email = DB::update("call GA_RSV_EMAIL_PG('$repairCd')");
            return [
                "data" => $SQL,
                "message" => $sqlMessage,
                "status" => 200,
            ];
        } catch (\Exception $e) {
            return [
                "message" => "Data failed to add!",
                "message_dtl" => $e->getMessage(),
                "status" => 400,
            ];
        }
    }
    public function rsvRepairReviewSet(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        $repairCd = $r->repairCd;
        $score = $r->score;
        $remark = $r->remark;
        $formType = $r->formType;
        $formDtl = $r->formDtl;
        $login_id = $r->login_id;
        $file = $r->file;
        $repair_status_request = new Request([
            'status' => 'C',
            'company' => $company,
            'login_id' => $login_id,
            'rsv_cd' => $repairCd,
        ]);

        try {
            $sqlMessage = empty($reviewCd)
                ? "Data added successfully!"
                : "Data update successfully!";
            $SQLInsert = "INSERT INTO GA_RSV_REVIEW_T (
                                 COMPANY
                                ,RSV_CD
                                ,FORM_ID
                                ,TL_DATE
                                ,SCORE
                                ,REMARK
                                ,ADD_PERSON_ID
                                ,ADD_DTTM
                                ,UPD_PERSON_ID
                                ,UPD_DTTM
                            )
                             VALUES (?, ?, ?, TO_DATE(?, 'dd/mm/yyyy'), ?, ?, ?, SYSDATE, ?, SYSDATE)";

            $SQL = DB::update($SQLInsert, [
                $company,
                $repairCd,
                $formType,
                $tl_date,
                $score,
                $remark,
                $login_id,
                $login_id,
            ]);

            if ($r->hasFile("file")) {
                $filename = $file->getClientOriginalName();
                $fileOrgname = pathinfo(
                    $file->getClientOriginalName(),
                    PATHINFO_FILENAME
                );
                $fileSize = $file->getSize();
                $fileExt = $file->extension();
                $fileType = $file->getClientMimeType();
                $filePath =
                    $formType . "/" . $repairCd . time() . '.' . $fileExt;

                $SQLFileInsert = "INSERT INTO GA_RSV_FILE_T (
                                                COMPANY
                                                ,FORM_CD
                                                ,FORM_ID
                                                ,FORM_DTL
                                                ,FILE_NAME
                                                ,ORG_FILE_NAME
                                                ,EXT
                                                ,FILE_SIZE
                                                ,CONTENT_TYPE
                                                ,FILE_PATH
                                                ,ADD_PERSON_ID
                                                ,ADD_DTTM
                                                ,UPD_PERSON_ID
                                                ,UPD_DTTM
                                            )
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  SYSDATE, ?, SYSDATE)";

                $SQLFile = DB::update($SQLFileInsert, [
                    $company,
                    $repairCd,
                    $formType,
                    $formDtl,
                    $filename,
                    $fileOrgname,
                    $fileExt,
                    $fileSize,
                    $fileType,
                    $filePath,
                    $login_id,
                    $login_id,
                ]);
                if (
                    !Storage::disk('repair')->put(
                        $filePath,
                        file_get_contents($file)
                    )
                ) {
                    return false;
                }
            }
            $setStatus = $this->rsvRepairStatusSet($repair_status_request);
            return [
                "data" => $SQL,
                "message" => $sqlMessage,
                "status" => 200,
            ];
        } catch (\Exception $e) {
            return [
                "message" => "Data failed to add!",
                "message_dtl" => $e->getMessage(),
                "status" => 400,
            ];
        }
    }
    public function rsvRepairFileFetch(Request $r)
    {
        $company = $r->company;
        $file_cd = $r->file_cd;
        $form_id = $r->form_id;

        try {
            $SQL = "SELECT COMPANY,
                            FILE_ID,
                            FORM_CD,
                            FORM_ID,
                            FORM_DTL,
                            FILE_NAME,
                            ORG_FILE_NAME,
                            EXT,
                            FILE_SIZE,
                            CONTENT_TYPE,
                            FILE_PATH
                        FROM GA_RSV_FILE_T
                        WHERE COMPANY = '$company' AND FORM_ID = '$form_id' AND FORM_CD = '$file_cd'";
            $SQLFile = DB::select($SQL);

            $fileContent = Storage::disk('repair')->get($SQLFile[0]->file_path);
            $base64 = base64_encode($fileContent);
            $mimeType = $SQLFile[0]->content_type;

            return response()->json([
                'data' => 'data:' . $mimeType . ';base64,' . $base64,
                'status' => 200,
                'statusText' => 'OK',
            ]);
        } catch (\Exception $e) {
            error_log($e->getMessage());
        }
    }
    public function rsvRepairStatusSet(Request $r)
    {
        $company = $r->company;
        $status = $r->status;
        $rsv_cd = $r->rsv_cd;
        $login_id = $r->login_id;

        try {
            $SQL = "UPDATE GA_RSV_RESERVATION_T a
                    SET STATUS = ?, UPD_DTTM = SYSDATE, upd_person_id = ?
                    WHERE     a.rsv_id = (SELECT MAX (rsv_id)
                                            FROM GA_RSV_RESERVATION_T b
                                            WHERE a.company = b.company AND a.rsv_cd = b.rsv_cd)
                        AND a.company = ? and a.rsv_cd = ?";

            $SQLUPDATE = DB::update($SQL, [
                $status,
                $login_id,
                $company,
                $rsv_cd,
            ]);
            return [
                "data" => $SQLUPDATE,
                "status" => 200,
                "message" => "Data update successfully!",
            ];
        } catch (\Exception $e) {
            return [
                "message" => "Data Update failed!",
                "message_dtl" => $e->getMessage(),
            ];
        }
    }

    public function masterLocationDelete(Request $r)
    {
        $company = $r->company;
        $location_cd = $r->location_cd;
        $login_id = $r->login_id;
        try {
            $SQL =
                "UPDATE GA_RSV_CLASS_CODE_T SET EFF_STATUS = 'I', UPD_PERSON_ID = ?, UPD_DTTM = SYSDATE WHERE t_default CODE_CLASS_ID = 'GA_RSV_LOCATION' AND CODE_ID = ?";

            $SQLDelete = DB::update($SQL, [$login_id, $location_cd]);
            return [
                "data" => $SQLDelete,
                "message" => "Data deleted successfully!",
            ];
        } catch (\Exception $e) {
            return ["message" => "Data deletion failed!"];
        }
    }
}
