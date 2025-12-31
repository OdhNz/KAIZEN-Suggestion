<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Cookie;

class KaizenListController extends Controller
{
    public function fetchKaizenListData(Request $r)
    {
        $status = $r->status;
        $bgnDt = $r->bgnDt;
        $endDt = $r->endDt;
        try {
            $SQL = DB::select(
                "WITH data_support
                        AS (SELECT ROW_NUMBER ()
                                    OVER (PARTITION BY a.company, a.kaizen_id ORDER BY b.name)
                                    AS rn,
                                    a.company,
                                    a.kaizen_id,
                                    a.empno,
                                    b.name,
                                    b.org_lvl10_nm AS dept
                            FROM KAIZEN_SUPPORT_ID_T a
                                    LEFT JOIN PW_HR_EMPLOYEES_V@DL_TTAMESTOTTHCMIF B
                                    ON (a.company = b.company AND a.empno = b.empno)),
                        support_id
                        AS (SELECT *
                            FROM data_support
                                    PIVOT
                                    (MAX (empno)
                                    AS emp, MAX (name)
                                    AS name, MAX (dept)
                                    AS dept
                                    FOR rn
                                    IN (1 AS a, 2 AS b, 3 AS c, 4 AS d, 5 AS e)))
                    SELECT b.kaizen_id,
                        b.kaizen_id_nm,
                        b.title,
                        c.category_id,
                        c.name AS category_nm,
                        d.VALUE AS location_id,
                        d.label AS location_nm,
                        b.company,
                        b.empno,
                        a.name,
                        a.org_lvl10_nm AS dept,
                        TO_CHAR (b.tl_date, 'YYYY-MM-DD') AS tl_date,
                        TO_CHAR (b.bgn_dt, 'YYYY-MM-DD') AS bgn_dt,
                        TO_CHAR (b.end_dt, 'YYYY-MM-DD') AS end_dt,
                        b.bef_file,
                        b.doc,
                        b.bef_remark,
                        b.aft_file,
                        b.aft_remark,
                        e.a_emp AS emp1,
                        e.a_name AS name1,
                        e.a_dept AS dept1,
                        e.b_emp AS emp2,
                        e.b_name AS name2,
                        e.b_dept AS dept2,
                        e.c_emp AS emp3,
                        e.c_name AS name3,
                        e.c_dept AS dept3,
                        e.d_emp AS emp4,
                        e.d_name AS name4,
                        e.d_dept AS dept4,
                        e.e_emp AS emp5,
                        e.e_name AS name5,
                        e.e_dept AS dept5,
                        b.status,
                        decode(b.status, 'R', 'Reject', 'A', 'Approve', 'N', 'New') as status_nm
                    FROM kaizen_rsv_t b
                        LEFT JOIN pw_hr_employees_v@dl_ttamestotthcmif a
                            ON (a.empno = b.empno)
                        JOIN kaizen_category_t c ON (b.category_id = c.category_id)
                        JOIN kaizen_location_t d ON (b.location_id = d.VALUE)
                        LEFT JOIN support_id e ON (b.kaizen_id = e.kaizen_id)
                        WHERE (:STATUS IS NULL OR b.status = :STATUS1)
                        AND b.tl_date between TO_DATE(:BGN_DT, 'YYYYMMDD') AND TO_DATE(:END_DT, 'YYYYMMDD')
                        ORDER BY b.kaizen_id DESC",
                [
                    "STATUS" => $status,
                    "STATUS1" => $status,
                    "BGN_DT" => $bgnDt,
                    "END_DT" => $endDt,
                ]
            );
            return $SQL;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function kaizenSetStatus(Request $r)
    {
        $kaizen_id = $r->kaizen_id;
        $status = $r->action;
        $login_id = $r->loginId;
        try {
            $SQL = DB::update(
                "UPDATE KAIZEN_RSV_T
                    SET status = :STATUS, UPD_ID = :LOGIN_ID, UPD_DTTM = SYSDATE
                    WHERE kaizen_id = :KAIZEN_ID",
                [
                    "STATUS" => $status,
                    "LOGIN_ID" => $login_id,
                    "KAIZEN_ID" => $kaizen_id,
                ]
            );
            return [
                "message" => 'S',
                "status" => 200,
            ];
        } catch (\Exception $e) {
            return [
                "message" => $e,
                "status" => 400,
            ];
        }
    }
}
