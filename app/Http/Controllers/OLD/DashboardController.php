<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    function rsvDsbSumFetch(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = "SELECT 'All Reservation' AS rsv_nm,
                            COUNT (1) AS rsv,
                            'General Reservation' AS loc_gen_nm,
                            SUM (CASE WHEN b.loc_category = 'GEN' THEN 1 ELSE 0 END) AS loc_gen,
                            'Dormitory Reservation' AS loc_dom_nm,
                            SUM (CASE WHEN b.loc_category = 'DOM' THEN 1 ELSE 0 END) AS loc_dom,
                            'New' AS new_nm,
                            SUM (CASE WHEN a.status = 'N' THEN 1 ELSE 0 END) AS new,
                            'Progress' AS prog_nm,
                            SUM (CASE WHEN a.status = 'P' THEN 1 ELSE 0 END) AS prog,
                            'Succcess' AS success_nm,
                            SUM (CASE WHEN a.status IN ('S', 'C') THEN 1 ELSE 0 END) AS success,
                            'Reject' AS rej_nm,
                            SUM (CASE WHEN a.status = 'R' THEN 1 ELSE 0 END) AS rej
                        FROM GA_RSV_RESERVATION_T a
                            JOIN GA_RSV_LOCATION_V b
                                ON (    a.company = b.company
                                    AND a.location_grp = b.loc_grp_id
                                    AND a.location_dtl = b.loc_id)
                            JOIN GA_RSV_REPAIR_V c
                                ON (    a.company = c.company
                                    AND a.repair_grp = c.repair_grp_id
                                    AND a.repair_type = c.repair_id)
                        WHERE     a.rsv_id = (SELECT MAX (rsv_id)
                                                FROM GA_RSV_RESERVATION_T b
                                                WHERE a.company = b.company AND a.rsv_cd = b.rsv_cd)
                            AND a.tl_date BETWEEN TRUNC (TO_DATE('$tl_date','yyyy-mm-dd'), 'mm') AND LAST_DAY (TO_DATE('$tl_date','yyyy-mm-dd'))";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    function rsvDsbReqFetch(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = "WITH dt
                    AS (SELECT TRUNC (TO_DATE('$tl_date','yyyy-mm-dd'), 'mm') bgn_dt, LAST_DAY (TO_DATE('$tl_date','yyyy-mm-dd')) end_dt
                        FROM DUAL),
                    month
                    AS (    SELECT bgn_dt + ROWNUM - 1 dt
                            FROM dt
                        CONNECT BY ROWNUM <=
                                        (  LAST_DAY (TRUNC (bgn_dt, 'mm'))
                                        - TRUNC (bgn_dt, 'mm'))
                                    + 1),
                    new
                    AS (  SELECT a.tl_date, COUNT (tl_date) AS dt_cnt
                            FROM GA_RSV_RESERVATION_T a
                                JOIN GA_RSV_LOCATION_V b
                                    ON (    a.company = b.company
                                        AND a.location_grp = b.loc_grp_id
                                        AND a.location_dtl = b.loc_id)
                                JOIN GA_RSV_REPAIR_V c
                                    ON (    a.company = c.company
                                        AND a.repair_grp = c.repair_grp_id
                                        AND a.repair_type = c.repair_id), dt
                            WHERE     a.rsv_id =
                                        (SELECT MAX (rsv_id)
                                            FROM GA_RSV_RESERVATION_T b
                                        WHERE a.company = b.company AND a.rsv_cd = b.rsv_cd)
                                AND a.tl_date BETWEEN dt.bgn_dt
                                                    AND dt.end_dt
                        GROUP BY a.tl_date),
                    ongo
                    AS (  SELECT TRUNC (a.tl_date) AS tl_date, COUNT (tl_date) AS val
                            FROM GA_RSV_DETAIL_T a, dt
                            WHERE TRUNC (a.tl_date) BETWEEN dt.bgn_dt
                                                    AND dt.end_dt
                        GROUP BY TRUNC (a.tl_date)),
                    comp
                    AS (  SELECT TRUNC (a.prog_dt) AS tl_date, COUNT (prog_dt) AS val
                            FROM GA_RSV_DETAIL_T a, dt
                            WHERE     prog_dt IS NOT NULL
                                AND TRUNC (a.tl_date) BETWEEN dt.bgn_dt
                                                    AND dt.end_dt
                        GROUP BY TRUNC (a.prog_dt))
                SELECT TO_CHAR (a.dt, 'dd-Dy') AS dt,
                        NVL (b.dt_cnt, 0) AS new,
                        NVL (c.val, 0) AS ongo,
                        NVL (d.val, 0) AS comp
                    FROM month a
                        LEFT JOIN new b ON (a.dt = b.tl_date)
                        LEFT JOIN ongo c ON (a.dt = c.tl_date)
                        LEFT JOIN comp d ON (a.dt = d.tl_date)
                ORDER BY dt";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    function rsvDsbReqBarFetch(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = "WITH week
                    AS (    SELECT TRUNC (TO_DATE('$tl_date','yyyy-mm-dd'), 'mm') + LEVEL - 1 AS dt
                            FROM DUAL
                        CONNECT BY TRUNC (TO_DATE('$tl_date','yyyy-mm-dd'), 'mm') + LEVEL - 1 < LAST_DAY (TO_DATE('$tl_date','yyyy-mm-dd'))),
                    label
                    AS (SELECT 'N' status FROM DUAL
                        UNION
                        SELECT 'P' FROM DUAL
                        UNION
                        SELECT 'C' FROM DUAL),
                    data_week
                    AS (SELECT a.dt, b.status
                        FROM week a JOIN label b ON (1 = 1)),
                    data
                    AS (SELECT 1 AS val, a.tl_date, 'N' AS status
                        FROM GA_RSV_RESERVATION_T a
                        UNION ALL
                        SELECT 1 AS val, TRUNC (tl_date) AS tl_date, 'P' AS status
                        FROM GA_RSV_DETAIL_T
                        UNION ALL
                        SELECT 1 AS val, TRUNC (PROG_DT) AS tl_date, 'C' AS status
                        FROM GA_RSV_DETAIL_T
                        WHERE PROG_DT IS NOT NULL),
                    chart
                    AS (  SELECT CASE
                                    WHEN TO_CHAR (TRUNC (a.dt, 'iw'), 'yyyymm') =
                                            TO_CHAR (a.dt, 'yyyymm')
                                    THEN
                                        TRUNC (a.dt, 'iw')
                                    ELSE
                                        TRUNC (a.dt, 'mm')
                                END
                                    AS dt,
                                NVL (SUM (val), 0) AS val,
                                a.status
                            FROM data_week a
                                LEFT JOIN data b
                                    ON (a.dt = b.tl_date AND a.status = b.status)
                        GROUP BY CASE
                                    WHEN TO_CHAR (TRUNC (a.dt, 'iw'), 'yyyymm') =
                                            TO_CHAR (a.dt, 'yyyymm')
                                    THEN
                                        TRUNC (a.dt, 'iw')
                                    ELSE
                                        TRUNC (a.dt, 'mm')
                                END,
                                a.status)
                SELECT TRIM (TO_CHAR (dt, 'Month')) AS mnth,
                            'week-'
                        || COUNT (1)
                            OVER (PARTITION BY TO_CHAR (dt, 'Month'), status ORDER BY dt)
                            AS week,
                        dt,
                        val,
                        status
                    FROM chart
                ORDER BY dt";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
    function rsvDsbStarPieFetch(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = "WITH week
                    AS (    SELECT TRUNC (TO_DATE('$tl_date','yyyy-mm-dd'), 'mm') + LEVEL - 1 AS dt
                            FROM DUAL
                        CONNECT BY TRUNC (TO_DATE('$tl_date','yyyy-mm-dd'), 'mm') + LEVEL - 1 < LAST_DAY (TO_DATE('$tl_date','yyyy-mm-dd'))),
                    star
                    AS (SELECT '1' AS star FROM DUAL
                        UNION
                        SELECT '2' AS star FROM DUAL
                        UNION
                        SELECT '3' AS star FROM DUAL
                        UNION
                        SELECT '4' AS star FROM DUAL
                        UNION
                        SELECT '5' AS star FROM DUAL),
                    data
                    AS (  SELECT c.score, SUM (1) AS val
                            FROM week w
                                JOIN GA_RSV_RESERVATION_T a ON (w.dt = a.tl_date)
                                JOIN GA_RSV_DETAIL_T b ON (a.rsv_cd = b.rsv_cd)
                                JOIN GA_RSV_REVIEW_T c ON (b.rsv_cd = c.rsv_cd)
                        GROUP BY score)
                SELECT a.star, nvl(b.val, 0) as val
                FROM star a left join data b on (a.star = b.score) 
                order by a.star desc";
            $SQLEX = DB::select($SQL);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
}
