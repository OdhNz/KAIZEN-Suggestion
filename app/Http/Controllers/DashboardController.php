<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    function fetchDashboardKaizen(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;

        try {
            // $kaizenAll = $this->fetchDashboardKaizen(
            //     new Request(["company" => $company, "tl_date" => $tl_date])
            // );
            // $kaizenCat = $this->fetchSumKaizenCategory(
            //     new Request(["company" => $company, "tl_date" => $tl_date])
            // );
            // $kaizenDept = $this->fetchSumKaizenDept(
            //     new Request(["company" => $company, "tl_date" => $tl_date])
            // );
            // $kaizenDay = $this->fetchSumKaizenDay(
            //     new Request(["company" => $company, "tl_date" => $tl_date])
            // );

            $kaizenAll = DB::select(
                "WITH base
                        AS (  SELECT status, COUNT (1) cnt
                                FROM KAIZEN_RSV_T
                                WHERE tl_date BETWEEN (  TRUNC (
                                          TRUNC (TO_DATE ( :DATE1, 'yyyymmdd'),
                                                 'mm')
                                        - 1,
                                        'mm')
                                   + 14)
                              AND (  TRUNC (TO_DATE ( :DATE2, 'yyyymmdd'),
                                            'mm')
                                   + 14)
                            GROUP BY status),
                        data
                        AS (SELECT *
                            FROM base
                                    PIVOT
                                    (MAX (cnt) FOR status IN ('R' AS r, 'A' AS a, 'N' AS n)))
                    SELECT NVL (r, 0) + NVL (a, 0) + NVL (n, 0) AS tot,
                        NVL (r, 0) AS r,
                        NVL (a, 0) AS a,
                        NVL (n, 0) AS n
                    FROM data",
                ["DATE1" => $tl_date, "DATE2" => $tl_date]
            );
            $kaizenCat = DB::select(
                "WITH base
                                    AS (  SELECT category_id, COUNT (1) AS cnt
                                            FROM kaizen_rsv_t
                                            WHERE tl_date BETWEEN (  TRUNC (
                                          TRUNC (TO_DATE ( :DATE1, 'yyyymmdd'),
                                                 'mm')
                                        - 1,
                                        'mm')
                                   + 14)
                              AND (  TRUNC (TO_DATE ( :DATE2, 'yyyymmdd'),
                                            'mm')
                                   + 14)
                                        GROUP BY category_id)
                                SELECT a.category_id, a.name, NVL (b.cnt, 0) cnt, a.color
                                    FROM kaizen_category_t a
                                        LEFT JOIN base b ON (a.category_id = b.category_id)
                                WHERE a.status = 'A'
                                ORDER BY category_id",
                ["DATE1" => $tl_date, "DATE2" => $tl_date]
            );
            $kaizenDept = DB::select(
                "SELECT b.org_lvl10_nm AS TYPE,
                            TO_CHAR(a.tl_date, 'MON') AS MONTH,
                            COUNT(1) AS VALUE
                     FROM kaizen_rsv_t a
                     JOIN PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF b
                       ON (a.company = b.company AND a.empno = b.empno)
                     WHERE a.tl_date BETWEEN TRUNC(TO_DATE(:DATE1, 'yyyymmdd'), 'mm') - 2*30
                                         AND TRUNC(TO_DATE(:DATE2, 'yyyymmdd'), 'mm') + 14
                                         AND b.org_lvl10_nm IS NOT NULL
                     GROUP BY b.org_lvl10_nm, TO_CHAR(a.tl_date, 'MON')
                     ORDER BY TYPE, MONTH",
                            ["DATE1" => $tl_date, "DATE2" => $tl_date]
                        );
            $kaizenDay = DB::select(
                "WITH dt
                    AS (    SELECT   TRUNC (TRUNC (TO_DATE ( :DATE1, 'yyyymmdd'), 'mm') - 1,
                                            'mm')
                                    + 14
                                    + LEVEL
                                    - 1
                                    AS dt
                            FROM DUAL
                        CONNECT BY LEVEL <=
                                        (TRUNC (TO_DATE ( :DATE2, 'yyyymmdd'), 'mm') + 14)
                                    - (  TRUNC (
                                                TRUNC (TO_DATE ( :DATE3, 'yyyymmdd'), 'mm')
                                            - 1,
                                            'mm')
                                        + 13))
                SELECT TO_CHAR (a.dt, 'mm-dd') AS letter, COUNT (b.tl_date) AS frequency
                    FROM dt a LEFT JOIN kaizen_rsv_t b ON (a.dt = b.tl_date)
                GROUP BY dt
                ORDER BY dt",
                ["DATE1" => $tl_date, "DATE2" => $tl_date, "DATE3" => $tl_date]
            );

            return [
                "status" => 200,
                "ALL" => $kaizenAll,
                "CAT" => $kaizenCat,
                "DEPT" => $kaizenDept,
                "DAY" => $kaizenDay,
            ];
        } catch (\Exeption $e) {
            return ["status" => 400, "message" => $e];
        }
    }

    function fetchSumKaizen(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = DB::select(
                "WITH base
                AS (  SELECT status, COUNT (1) cnt
                        FROM KAIZEN_RSV_T
                        WHERE tl_date BETWEEN (  TRUNC (
                                    TRUNC (TO_DATE ( :DATE1, 'yyyymmdd'),
                                            'mm')
                                - 1,
                                'mm')
                            + 14)
                        AND (  TRUNC (TO_DATE ( :DATE2, 'yyyymmdd'),
                                    'mm')
                            + 14)
                    GROUP BY status),
                data
                AS (SELECT *
                    FROM base
                            PIVOT
                            (MAX (cnt) FOR status IN ('R' AS r, 'A' AS a, 'N' AS n)))
            SELECT NVL (r, 0) + NVL (a, 0) + NVL (n, 0) AS tot,
                NVL (r, 0) AS r,
                NVL (a, 0) AS a,
                NVL (n, 0) AS n
            FROM data",
                ["DATE1" => $tl_date, "DATE2" => $tl_date]
            );
            return $SQL;
        } catch (\Exception $e) {
            return $e;
        }
    }
    function fetchSumKaizenCategory(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = DB::select(
                "WITH base
                    AS (  SELECT category_id, COUNT (1) AS cnt
                            FROM kaizen_rsv_t
                            WHERE tl_date BETWEEN (  TRUNC (
                            TRUNC (TO_DATE ( :DATE1, 'yyyymmdd'),
                                    'mm')
                        - 1,
                        'mm')
                    + 14)
                AND (  TRUNC (TO_DATE ( :DATE2, 'yyyymmdd'),
                            'mm')
                    + 14)
                        GROUP BY category_id)
                SELECT a.category_id, a.name, NVL (b.cnt, 0) cnt, a.color
                    FROM kaizen_category_t a
                        LEFT JOIN base b ON (a.category_id = b.category_id)
                WHERE a.status = 'A'
                ORDER BY category_id",
                ["DATE1" => $tl_date, "DATE2" => $tl_date]
            );
            return $SQL;
        } catch (\Exception $e) {
            return $e;
        }
    }
    function fetchSumKaizenDept(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = DB::select(
                "SELECT b.org_lvl10_nm AS TYPE,
                         TO_CHAR(a.tl_date, 'MON') AS MONTH,
                         COUNT(1) AS VALUE
                  FROM kaizen_rsv_t a
                  JOIN PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF b
                    ON (a.company = b.company AND a.empno = b.empno)
                  WHERE a.tl_date BETWEEN TRUNC(TO_DATE(:DATE1, 'yyyymmdd'), 'mm') - 2*30
                                      AND TRUNC(TO_DATE(:DATE2, 'yyyymmdd'), 'mm') + 14
                  GROUP BY b.org_lvl10_nm, TO_CHAR(a.tl_date, 'MON')
                  ORDER BY TYPE, MONTH;
                  ",
                ["DATE1" => $tl_date, "DATE2" => $tl_date]
            );
            return $SQL;
        } catch (\Exception $e) {
            return $e;
        }
    }
    function fetchSumKaizenDay(Request $r)
    {
        $company = $r->company;
        $tl_date = $r->tl_date;
        try {
            $SQL = DB::select(
                "WITH dt
                    AS (    SELECT   TRUNC (TRUNC (TO_DATE ( :DATE1, 'yyyymmdd'), 'mm') - 1,
                                            'mm')
                                    + 14
                                    + LEVEL
                                    - 1
                                    AS dt
                            FROM DUAL
                        CONNECT BY LEVEL <=
                                        (TRUNC (TO_DATE ( :DATE2, 'yyyymmdd'), 'mm') + 14)
                                    - (  TRUNC (
                                                TRUNC (TO_DATE ( :DATE3, 'yyyymmdd'), 'mm')
                                            - 1,
                                            'mm')
                                        + 13))
                SELECT TO_CHAR (a.dt, 'mm-dd') AS letter, COUNT (b.tl_date) AS frequency
                    FROM dt a LEFT JOIN kaizen_rsv_t b ON (a.dt = b.tl_date)
                GROUP BY dt
                ORDER BY dt",
                ["DATE1" => $tl_date, "DATE2" => $tl_date, "DATE3" => $tl_date]
            );
            return $SQL;
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function fetchKaizenByCategory(Request $r)
    {
        $categoryNm = $r->category;
        $tl_date = $r->tl_date;

        try {
            $SQL = DB::select(
                "WITH data_support AS (
                    SELECT ROW_NUMBER() OVER (PARTITION BY a.company, a.kaizen_id ORDER BY b.name) AS rn,
                           a.company,
                           a.kaizen_id,
                           a.empno,
                           b.name,
                           b.org_lvl10_nm AS dept
                    FROM KAIZEN_SUPPORT_ID_T a
                    LEFT JOIN PW_HR_EMPLOYEES_V@DL_TTAMESTOTTHCMIF b
                      ON (a.company = b.company AND a.empno = b.empno)
                ),
                support_id AS (
                    SELECT *
                    FROM data_support
                    PIVOT (
                        MAX(empno) AS emp,
                        MAX(name) AS name,
                        MAX(dept) AS dept
                        FOR rn IN (1 AS a, 2 AS b, 3 AS c, 4 AS d, 5 AS e)
                    )
                )
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
                       TO_CHAR(b.tl_date, 'YYYYMMDD') AS tl_date,
                       b.status,
                       DECODE(b.status, 'R','Reject','A','Approve','N','New') AS status_nm
                FROM kaizen_rsv_t b 
                LEFT JOIN pw_hr_employees_v@dl_ttamestotthcmif a ON (a.empno = b.empno)
                JOIN kaizen_category_t c ON (b.category_id = c.category_id)
                JOIN kaizen_location_t d ON (b.location_id = d.VALUE)
                LEFT JOIN support_id e ON (b.kaizen_id = e.kaizen_id)
                WHERE c.name = :CATEGORY_NM
                AND b.tl_date BETWEEN (  TRUNC (
										   TRUNC (
											   TO_DATE ( :DATE1, 'YYYYMMDD'),
											   'mm')
										 - 1,
										 'mm')
								   + 14)
							  AND (  TRUNC (TO_DATE ( :DATE2, 'YYYYMMDD'),
											'mm')
								   + 14)
                AND c.status = 'A'
                ORDER BY b.kaizen_id DESC", 
                ["CATEGORY_NM" => $categoryNm, "DATE1" => $tl_date, "DATE2" => $tl_date]
        );

            return response()->json($SQL, 200); // ✅ langsung array
        } catch (\Exception $e) {
            return response()->json(["status" => 400, "message" => $e->getMessage()], 400);
        }
    }

}
