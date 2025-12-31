<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminReservationController extends Controller
{
    public function rsvAdminFetch(Request $r)
    {
        $company = $r->company;
        $login_id = $r->login_id;
        $bgn = $r->bgn;
        $end = $r->end;
        try {
            $SQL = "  SELECT a.company,
                            a.rsv_id,
                            b.loc_category,
                            decode(b.loc_category, 'GEN', 'General', 'DOM', 'Dormitory') as loc_category_nm,
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
                            a.rsv_user ||' \n ' ||  p.name as id_nm,
                            ' ' || decode(b.loc_category, 'GEN', 'General', 'DOM', 'Dormitory') || ' \n ' || b.loc_grp_nm ||' \n ' || b.loc_nm as location_fnm,
                            p.org_lvl10_nm as dept_nm,
                            a.remark,
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
                                            WHERE  a.company = b.company AND a.rsv_cd = b.rsv_cd) 
                            AND a.company = '$company'
                            AND a.tl_date BETWEEN to_date('$bgn','yyyy-mm-dd') AND to_date('$end','yyyy-mm-dd')
                        ORDER BY a.rsv_id desc ";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvAdminPicFetch(Request $r)
    {
        $company = $r->company;
        $login_id = $r->login_id;
        try {
            $SQL = "SELECT company,
                        empid AS VALUE,
                        name,
                        position_nm as position,
                        empid || ' - ' || name || ' - ' || position_nm AS label
                    FROM PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF
                    WHERE     company = '$company'
                        AND expat = 'N'
                        AND retire_YN = 'N'
                        AND erp_dept_nm = 'GA'";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvAdminRsvDetailPicFetch(Request $r)
    {
        $company = $r->company;
        $repair_cd = $r->repair_cd;

        try {
            $SQL = "SELECT  company,
                            empid,
                            name,
                            position
                        FROM GA_RSV_DETAIL_PIC_T
                        WHERE company = '$company' and rsv_cd = '$repair_cd'";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvAdminRsvDetailFetch(Request $r)
    {
        $company = $r->company;
        $login_id = $r->login_id;
        $repair_cd = $r->repair_cd;
        $rsv_pic_req = new Request([
            'company' => $company,
            'login_id' => $login_id,
            'repair_cd' => $repair_cd,
        ]);
        try {
            $SQL = "SELECT company,
                    form_id,
                    tl_date,
                    to_char(bgn_dt, 'yyyy-mm-dd') as bgn_dt,
                    to_char(end_dt, 'yyyy-mm-dd') as end_dt,
                    remark_dtl
                FROM GA_RSV_DETAIL_T
                WHERE company = '$company' and rsv_cd = '$repair_cd'";
            $SQLEX = DB::select($SQL);
            $SQL_PIC = $this->rsvAdminRsvDetailPicFetch($rsv_pic_req);
            return [
                "detail" => $SQLEX,
                "pic" => $SQL_PIC,
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
    public function rsvAdminAprSet(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        $bgnDt = $r->bgnDate;
        $endDt = $r->endDate;
        $repairCd = $r->repairCd;
        $rsv_dtl_id = $r->rsv_dtl_id;
        $remark = $r->remark;
        $pics = json_decode($r->pics);
        $last_pic = count($pics);
        $formType = $r->formType;
        $formDtl = $r->formDtl;
        $status = $r->status;
        $login_id = $r->login_id;
        $repair_status_request = new Request([
            'status' => 'P',
            'company' => $company,
            'login_id' => $login_id,
            'rsv_cd' => $repairCd,
        ]);
        try {
            $sqlMessage = empty($rsv_dtl_id)
                ? "Data added successfully!"
                : "Data update successfully!";

            $SQLInsert = "INSERT INTO GA_RSV_DETAIL_T (
                                 COMPANY
                                ,RSV_CD
                                ,FORM_ID
                                ,TL_DATE
                                ,BGN_DT
                                ,END_DT
                                ,REMARK_DTL
                                ,ADD_PERSON_ID
                                ,ADD_DTTM
                                ,UPD_PERSON_ID
                                ,UPD_DTTM
                            )
                             VALUES (?, ?, ?, SYSDATE, TO_DATE(?, 'dd/mm/yyyy'), TO_DATE(?, 'dd/mm/yyyy'), ?, ?, SYSDATE, ?, SYSDATE)";

            $SQLPics =
                "INSERT INTO GA_RSV_DETAIL_PIC_T (company, rsv_cd, empid, name, position, add_person_id, add_dttm)" .
                " ";
            foreach ($pics as $key => $value) {
                if ($key + 1 == $last_pic) {
                    $SQLPics =
                        $SQLPics .
                        "SELECT '$company' as company, '$repairCd' as repair_cd, '$value->value' as empid, '$value->name' as name, '$value->position' as position, '$login_id' as login_id, sysdate as add_dttm from dual";
                } else {
                    $SQLPics =
                        $SQLPics .
                        "SELECT '$company' as company, '$repairCd' as repair_cd, '$value->value' as empid, '$value->name' as name, '$value->position' as position, '$login_id' as login_id, sysdate as add_dttm from dual union all" .
                        " ";
                }
            }
            $SQL_DTL = DB::update($SQLInsert, [
                $company,
                $repairCd,
                $formType,
                $bgnDt,
                $endDt,
                $remark,
                $login_id,
                $login_id,
            ]);
            $SQL_DTL_PIC = DB::update($SQLPics);
            $setStatus = $this->rsvRepairStatusSet($repair_status_request);
            $email = DB::update("call GA_RSV_EMAIL_PG('$repairCd')");
            return [
                "data" => $SQLPics,
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
    public function rsvAdminCompleteSet(Request $r)
    {
        $company = $r->company;
        $repairCd = $r->repairCd;
        $progStatus = $r->progStatus;
        $remark = $r->remark;
        $formType = $r->formType;
        $formDtl = $r->formDtl;
        $status = $r->status;
        $login_id = $r->login_id;
        $file = $r->file;
        $repair_status_request = new Request([
            'status' => 'S',
            'company' => $company,
            'login_id' => $login_id,
            'rsv_cd' => $repairCd,
        ]);
        try {
            $sqlMessage = empty($repairCd)
                ? "Data added successfully!"
                : "Data update successfully!";

            $SQLUpdate = "UPDATE GA_RSV_DETAIL_T
                            SET PROG_DT = SYSDATE,
                                PROG_STATUS = ?,
                                PROG_REMARK = ?,
                                UPD_PERSON_ID = ?,
                                UPD_DTTM = SYSDATE
                            WHERE COMPANY = ? AND RSV_CD = ?";

            $SQL = DB::update($SQLUpdate, [
                $progStatus,
                $remark,
                $login_id,
                $company,
                $repairCd,
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
    public function rsvAdminRejectSet(Request $r)
    {
        $company = $r->company;
        $repairCd = $r->repairCd;
        $remark = $r->remark;
        $formType = $r->formType;
        $formDtl = $r->formDtl;
        $status = $r->status;
        $login_id = $r->login_id;

        try {
            $sqlMessage = empty($repairCd)
                ? "Data added successfully!"
                : "Data update successfully!";

            $SQLUpdate = "UPDATE GA_RSV_RESERVATION_T
                            SET STATUS =?,
                                MESSAGE = ?,
                                UPD_PERSON_ID = ?,
                                UPD_DTTM = SYSDATE
                            WHERE COMPANY = ? AND RSV_CD = ?";

            $SQL = DB::update($SQLUpdate, [
                $status,
                $remark,
                $login_id,
                $company,
                $repairCd,
            ]);

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
    public function rsvLocationFetch(Request $r)
    {
        $company = $r->company;
        try {
            $SQL = "  SELECT b.c_group AS class,
                            a.c_comcode AS group_id,
                            a.n_comname AS group_nm,
                            b.c_comcode AS value,
                            a.n_comname || ' - ' || b.n_comname AS label
                        FROM TRTB_M_COMMON a
                            JOIN TRTB_M_COMMON b
                                ON (    a.c_comcode = b.t_buffer
                                    AND a.c_group = 'GR1'
                                    AND b.c_group = 'GR2')
                    WHERE b.t_default = '$company'
                    ORDER BY b.n_comname";
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
            $SQL = "SELECT c_group as class, c_comcode as value, n_comname as label
                    FROM TRTB_M_COMMON
                    WHERE t_default = '$company' and c_group = 'GR3' 
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
                    WHERE t_default = '$company' and c_group = 'GR4' 
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
                                ,TL_DATE
                                ,SCORE
                                ,REMARK
                                ,ADD_PERSON_ID
                                ,ADD_DTTM
                                ,UPD_PERSON_ID
                                ,UPD_DTTM
                            )
                             VALUES (?, ?, TO_DATE(?, 'dd/mm/yyyy'), ?, ?, ?, SYSDATE, ?, SYSDATE)";

            $SQL = DB::update($SQLInsert, [
                $company,
                $repairCd,
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
                        WHERE COMPANY = '$company' AND FORM_CD = '$file_cd'";
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
