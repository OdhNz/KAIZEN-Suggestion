<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class CalendarEvent extends Controller
{
    function rsvEvent(Request $r)
    {
        $company = $r->company;
        $bgn = $r->bgn;
        $end = $r->end;
        try {
            $SQL = "SELECT ROW_NUMBER () OVER (PARTITION BY NULL ORDER BY A.TL_DATE) AS RN,
                        a.company,
                        a.rsv_cd,
                        A.RSV_USER || ' - ' || C.REPAIR_NM AS TITLE,
                        COALESCE (TO_CHAR (B.BGN_DT, 'yyyy-mm-dd'),
                                    TO_CHAR (A.TL_DATE, 'yyyy-mm-dd'))
                            AS BGN_DT,
                        COALESCE (TO_CHAR (B.END_DT + 1, 'yyyy-mm-dd'),
                                    TO_CHAR (A.TL_DATE, 'yyyy-mm-dd'))
                            AS END_DT,
                        CASE
                            WHEN A.STATUS = 'R' THEN '#992525'
                            WHEN B.RSV_DTL_ID IS NULL THEN '#0b79b0'
                            WHEN B.RSV_DTL_ID IS NOT NULL AND B.PROG_DT IS NULL THEN '#c7851a'
                            WHEN B.PROG_DT IS NOT NULL THEN '#259946'
                        END
                            AS COLOR,
                            CASE
                            WHEN B.RSV_DTL_ID IS NULL THEN 'N'
                            WHEN B.RSV_DTL_ID IS NOT NULL AND B.PROG_DT IS NULL THEN 'P'
                            WHEN B.PROG_DT IS NOT NULL THEN 'C'
                        END
                            AS STATUS
                    FROM GA_RSV_RESERVATION_T A
                        LEFT JOIN GA_RSV_DETAIL_T B ON (A.RSV_CD = B.RSV_CD)
                        JOIN GA_RSV_REPAIR_V C
                            ON (A.REPAIR_GRP = C.REPAIR_GRP_ID AND A.REPAIR_TYPE = C.REPAIR_ID)
                            WHERE A.COMPANY = '$company'
                            AND A.TL_DATE BETWEEN TO_DATE ('$bgn', 'YYYY-MM-DD')
                            AND TO_DATE ('$end', 'YYYY-MM-DD')";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function rsvById(Request $r)
    {
        $company = $r->company;
        $login_id = $r->login_id;
        $rsv_cd = $r->rsv_cd;

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
                                            WHERE  a.company = b.company AND a.rsv_cd = b.rsv_cd) and a.company = '$company' and a.rsv_cd = '$rsv_cd'
                            ORDER BY a.rsv_id DESC";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
}
