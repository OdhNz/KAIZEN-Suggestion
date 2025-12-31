<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class HomeController extends Controller
{
   public function index()
   {
      return Inertia::render('Dashboard');
   }
   public function getDashboard(Request $r)
   {
      $jobcls = $r->jobcls;
      $year = $r->year;
      $plant = $r->plant;
      $qrt = $r->qrt;
      DB::connection()->enableQueryLog();
      $dashboard = DB::select("SELECT S.PROCESS_NM AS nm,
        NVL (S.A_CNT_EMP_PER, 0) || '%' AS a_per,
        NVL (S.A_CNT_EMPID_PRO, 0) AS a_tot,
        NVL (S.B_CNT_EMP_PER, 0) || '%' AS b_per,
        NVL (S.B_CNT_EMPID_PRO, 0) AS b_tot,
        NVL (S.C_CNT_EMP_PER, 0) || '%' AS c_per,
        NVL (S.C_CNT_EMPID_PRO, 0) AS c_tot,
        NVL (S.D_CNT_EMP_PER, 0) || '%' AS d_per,
        NVL (S.D_CNT_EMPID_PRO, 0) AS d_tot,
        (  NVL (S.A_CNT_EMPID_PRO, 0)
         + NVL (S.B_CNT_EMPID_PRO, 0)
         + NVL (S.C_CNT_EMPID_PRO, 0))
           AS ACC,
           TO_CHAR (
              ROUND (
                   (  NVL (S.A_CNT_EMPID_PRO, 0)
                    + NVL (S.B_CNT_EMPID_PRO, 0)
                    + NVL (S.C_CNT_EMPID_PRO, 0))
                 / (SELECT COUNT (EMPID) CNT_EMPID
                      FROM (SELECT DISTINCT EMPID
                              FROM PW_HR_MSKILL_T03
                             WHERE     1 = 1
                                   AND PROCESS_CD = '$jobcls'
                                   AND YEAR = '$year')
                     WHERE 1 = 1)
                 * 100,
                 2),
              'FM90.99')
        || '%'
           AS TOTAL_PERSEN
   FROM (SELECT *
           FROM (SELECT T.PROCESS_NM,
                        T.ACTUAL_SC_TEXT,
                        T.CNT_EMPID_PRO,
                        TO_CHAR (ROUND ( (CNT_EMPID_PRO / cnt_emp) * 100, 2),
                                 'FM90.99')
                           AS cnt_emp_per
                   FROM (  SELECT PROCESS_NM,
                                  ACTUAL_SC_TEXT,
                                  NVL (COUNT (EMPID), 0) CNT_EMPID_PRO,
                                  (SELECT COUNT (EMPID) CNT_EMPID
                                     FROM (SELECT DISTINCT EMPID
                                             FROM PW_HR_MSKILL_T03
                                            WHERE     1 = 1
                                                  AND PROCESS_CD = '$jobcls'
                                                  AND YEAR = '$year')
                                    WHERE 1 = 1)
                                     AS cnt_emp
                             FROM (SELECT DISTINCT
                                          PW_ZZ_UTIL_PG.get_jobcd_nm_fn (
                                             A.SERVICE_ID,
                                             A.DATASET,
                                             A.JOBCD,
                                             A.EFFDT,
                                             'ENG')
                                             AS PROCESS_NM,
                                          B.EMPID,
                                          CASE
                                             WHEN ACTUAL_SCORE = '100' THEN 'A'
                                             WHEN ACTUAL_SCORE = '075' THEN 'B'
                                             WHEN ACTUAL_SCORE = '050' THEN 'C'
                                             WHEN ACTUAL_SCORE = '025' THEN 'D'
                                          END
                                             ACTUAL_SC_TEXT
                                     FROM PW_HA_JOBCD_T A
                                          JOIN PW_HR_MSKILL_T03 B
                                             ON (    A.SERVICE_ID = B.SERVICE_ID
                                                 AND A.JOBCLS = B.PROCESS_CD
                                                 AND A.JOBCD = B.SKILL_CD
                                                 AND B.COMPANY = 'TT'
                                                 AND B.YEAR = '$year')
                                          JOIN PW_HR_EMPLOYEES_V C
                                             ON (    B.EMPID = C.EMPID
                                                 AND A.JOBCD = C.JOBCD
                                                 AND B.SKILL_CD = C.JOBCD)
                                          JOIN PW_HA_DEPT_T D
                                             ON (C.DEPT = D.DEPT)
                                    WHERE     1 = 1
                                          AND A.MULTI_SKILL_FLAG IS NOT NULL
                                          AND A.EFF_STATUS = 'A'
                                          AND (CASE
                                                WHEN ROUND_CD = '$qrt' THEN 1
                                                WHEN 1=1 THEN 2
                                             END = CASE WHEN LENGTH('$qrt') >= 1 THEN 1 ELSE 2 END)
                                          AND A.EFFDT =
                                                 (SELECT MAX (A1.EFFDT)
                                                    FROM PW_HA_JOBCD_T A1
                                                   WHERE     A1.SERVICE_ID =
                                                                A.SERVICE_ID
                                                         AND A1.DATASET =
                                                                A.DATASET
                                                         AND A1.JOBCD = A.JOBCD
                                                         AND A1.EFFDT <= SYSDATE
                                                         AND A1.MULTI_SKILL_FLAG
                                                                IS NOT NULL)
                                          AND D.EFFDT =
                                                 (SELECT MAX (S.EFFDT)
                                                    FROM PW_HA_DEPT_T S
                                                   WHERE     S.SERVICE_ID =
                                                                D.SERVICE_ID
                                                         AND S.DEPT = D.DEPT)
                                          AND B.PROCESS_CD = '$jobcls'
                                          AND (CASE
                                                  WHEN D.PLANT_LOCATION = '$plant'
                                                  THEN
                                                     1
                                                  WHEN 1 = 1
                                                  THEN
                                                     2
                                               END =
                                                  CASE
                                                     WHEN LENGTH ('$plant') >= 1
                                                     THEN
                                                        1
                                                     ELSE
                                                        2
                                                  END))
                            WHERE 1 = 1
                         GROUP BY PROCESS_NM, ACTUAL_SC_TEXT) T
                  WHERE 1 = 1)
                PIVOT
                   (MIN (cnt_emp_per)
                   cnt_emp_per, MIN (CNT_EMPID_PRO)
                   CNT_EMPID_PRO
                   FOR ACTUAL_SC_TEXT
                   IN ('A' AS A, 'B' AS B, 'C' AS C, 'D' AS D))) S
                 WHERE 1 = 1 ORDER BY NM ASC");

      $queries = DB::getQueryLog();
      dd($queries);
      $tot_emp = DB::select("SELECT COUNT (EMPID) emp 
                FROM (SELECT DISTINCT a.EMPID
                     FROM PW_HR_MSKILL_T03 a, pw_hr_employees_v b, pw_ha_dept_t c
                     WHERE     1 = 1
                           AND a.EMPID = b.empid
                           AND b.dept = c.dept
                           AND PROCESS_CD = '$jobcls'
                           AND YEAR = '$year'
                           AND  (CASE
                                 WHEN c.plant_location = '$plant'
                                 THEN
                                    1
                                 WHEN 1 = 1
                                 THEN
                                    2
                              END =
                                 CASE
                                    WHEN LENGTH ('$plant') >= 1
                                    THEN
                                       1
                                    ELSE
                                       2
                                 END)) 
               WHERE 1 = 1");
      return ['item' => $dashboard, 'tot_emp' => $tot_emp];
   }
   public function getYear()
   {
      $year = DB::select(" SELECT DISTINCT YEAR ID, YEAR TEXT FROM PW_HR_MSKILL_T03");
      return $year;
   }

   public function getPlant()
   {
      $plants = DB::select("SELECT DISTINCT PLANT_LOCATION AS ID,
                PW_ZZ_UTIL_PG.get_code_nm_fn ('PLANT_LOCATION',
                                              PLANT_LOCATION,
                                              '',
                                              '',
                                              SYSDATE,
                                              'ENG')
                   TEXT
                    FROM PW_HA_DEPT_T D
                    WHERE     D.SERVICE_ID = 'TT'
                        AND D.DATASET =
                                (SELECT pw_zz_util_pg.get_dataset_fn ('TT', 'TT', 'DEPT')
                                    FROM DUAL)
                        AND D.PLANT_LOCATION IS NOT NULL
                        AND D.PLANT_LOCATION IN ('A','B','C','D','E','F','G')
                        AND D.EFFDT =
                                (SELECT MAX (EFFDT)
                                    FROM PW_HA_DEPT_T
                                    WHERE     SERVICE_ID = D.SERVICE_ID
                                        AND DATASET = D.DATASET
                                        AND DEPT = D.DEPT
                                        AND EFFDT <= SYSDATE)
                    ORDER BY ID ASC");
      return $plants;
   }
   public function getLine(Request $r)
   {
      $dept = $r->id;
      $lines = DB::select("SELECT T.* FROM(
         SELECT DISTINCT DPR_DEPT AS ID,
         CASE WHEN DPR_DEPT = 'ASS' THEN 'ASSEMBLY'
                  WHEN DPR_DEPT = 'CUT' THEN 'CUTTING'
                  WHEN DPR_DEPT = 'PRF' THEN 'PREFIT'
                  WHEN DPR_DEPT = 'STF' THEN 'STOCKFIT'
                  WHEN DPR_DEPT = 'STT' THEN 'STITCHING'
                  ELSE DPR_DEPT
              END AS TEXT
             FROM PW_HA_DEPT_T D
             WHERE D.SERVICE_ID ='TT'
              AND (CASE WHEN D.PLANT_LOCATION = '$dept' THEN 1 WHEN 1=1 THEN 2 END = CASE WHEN LENGTH('$dept') >= 1 THEN 1 ELSE 2 END)
              AND D.DPR_DEPT in ('CUT', 'ASS', 'PRF', 'STF', 'STT')
              AND D.DATASET = (SELECT PW_ZZ_UTIL_PG.GET_DATASET_FN('TT','TT','DEPT') FROM DUAL)
              AND D.PLANT_LOCATION IS NOT NULL
              AND D.EFFDT = (SELECT MAX(EFFDT) FROM PW_HA_DEPT_T 
                              WHERE SERVICE_ID = D.SERVICE_ID
                                AND DATASET = D.DATASET
                                AND DEPT = D.DEPT
                                AND EFFDT <= SYSDATE)) T
         ORDER BY ID ASC");
      return $lines;
   }

   public function getPart(Request $r)
   {
      $dept = $r->dept;
      $line = $r->line;
      $parts = DB::select("SELECT T.*
      FROM (SELECT DISTINCT DPR_DEPT ID, DPR_DEPT TEXT
              FROM PW_HA_DEPT_T D
             WHERE     D.SERVICE_ID = 'TT'
             AND (CASE WHEN D.PLANT_LOCATION = '$dept' THEN 1 WHEN 1 = 1 THEN 2 END = CASE WHEN LENGTH ('$dept') >= 1 THEN 1 ELSE 2 END)
            AND (CASE WHEN  D.DPR_DEPT = '$line' THEN 1 WHEN 1 = 1 THEN 2 END = CASE WHEN LENGTH ('$line') >= 1 THEN 1 ELSE 2 END)
            AND D.DPR_DEPT in ('CUT', 'ASS', 'PRF', 'STF', 'STT')
            AND D.DATASET =
                  (SELECT PW_ZZ_UTIL_PG.GET_DATASET_FN ('TT',
                                                         'TT',
                                                         'DEPT')
                     FROM DUAL)
            AND D.PLANT_LOCATION IS NOT NULL
            AND D.EFFDT =
                  (SELECT MAX (EFFDT)
                     FROM PW_HA_DEPT_T
                     WHERE     SERVICE_ID = D.SERVICE_ID
                           AND DATASET = D.DATASET
                           AND DEPT = D.DEPT
                           AND EFFDT <= SYSDATE)) T
            ORDER BY ID ASC");

      return $parts;
   }

   public function getProc(Request $r)
   {
      $dept = $r->dept;
      $line = $r->line;
      $part = $r->part;
      $proc = DB::select("SELECT DISTINCT B.JOBCD ID,
      PW_ZZ_UTIL_PG.GET_JOBCD_NM_FN (D.SERVICE_ID,
                                     D.DATASET,
                                     D.JOBCD,
                                     D.EFFDT,
                                     'ENG')
                                    AS TEXT
                           FROM PW_HR_EMPLOYEES_V B
                           JOIN PW_HA_DEPT_T C ON (B.DEPT = C.DEPT)
                           JOIN PW_HA_JOBCD_T D ON (B.JOBCD = D.JOBCD)
                           WHERE     1 = 1
                           AND C.SERVICE_ID = 'TT'
                           AND D.EFFDT =
                              (SELECT MAX (S.EFFDT)
                                 FROM PW_HA_JOBCD_T S
                                 WHERE     S.SERVICE_ID = D.SERVICE_ID
                                       AND S.DATASET = D.DATASET
                                       AND S.JOBCD = D.JOBCD)
                           AND C.EFFDT = (SELECT MAX (S.EFFDT)
                                       FROM PW_HA_DEPT_T S
                                       WHERE S.SERVICE_ID = C.SERVICE_ID --                        AND S.DATASET = C.DATASET
                                             AND S.DEPT = C.DEPT)
                           AND C.EFF_STATUS = 'A'
                           AND D.MULTI_SKILL_FLAG IS NOT NULL
                           AND (CASE WHEN C.PLANT_LOCATION = '$dept' THEN 1 WHEN 1 = 1 THEN 2 END =
                              CASE WHEN LENGTH ('$dept') >= 1 THEN 1 ELSE 2 END)
                           AND (CASE WHEN C.DPR_DEPT = '$part' THEN 1 WHEN 1 = 1 THEN 2 END =
                              CASE WHEN LENGTH ('$part') >= 1 THEN 1 ELSE 2 END)
                           ORDER BY TEXT ASC");
      return $proc;
   }
   public function getEmpSkill(Request $r)
   {
      $dept = $r->dept;
      $line = $r->line;
      $part = $r->part;
      $proc = $r->proc;
      $value = $r->value;
      $year = $r->year;
      $qrt = $r->qrt;
      DB::connection()->enableQueryLog();
      $user = DB::select("SELECT DISTINCT
      B.SERVICE_ID AS SERVICE_ID,
      B.COMPANY AS COMPANY,
      B.YEAR AS YEAR,
      B.EMPID AS EMPID,
      C.NAME,
      C.JOB_POSITION_NM,
      PW_HA_UTIL_PG.FN_GET_PLANT (C.COMPANY, C.DEPT, SYSDATE) PLANT,
      PW_HA_UTIL_PG.FN_GET_ERPDEPT_NM (C.SERVICE_ID,
                                       C.COMPANY,
                                       C.DEPT,
                                       SYSDATE)
         VSM_LINE,
      PW_ZZ_UTIL_PG.GET_JOBCD_NM_FN (A.SERVICE_ID,
                                     A.DATASET,
                                     A.JOBCD,
                                     A.EFFDT,
                                     'ENG')
         AS PROCESS_NM,
      CASE
         WHEN ACTUAL_SCORE = '100' THEN 'A'
         WHEN ACTUAL_SCORE = '075' THEN 'B'
         WHEN ACTUAL_SCORE = '050' THEN 'C'
         WHEN ACTUAL_SCORE = '025' THEN 'D'
      END
         AS MULTI_SKILL_FLAG
 FROM PW_HA_JOBCD_T A
      JOIN PW_HR_MSKILL_T03 B
         ON (    A.SERVICE_ID = B.SERVICE_ID
             AND A.JOBCLS = B.PROCESS_CD
             AND A.JOBCD = B.SKILL_CD
             AND B.COMPANY = 'TT'
             AND (CASE WHEN B.YEAR = '$year' THEN 1 WHEN B.YEAR = '2023' THEN 2 END =
                     CASE WHEN LENGTH ('$year') >= 1 THEN 1 ELSE 2 END))
      JOIN PW_HR_EMPLOYEES_V C ON (B.EMPID = C.EMPID)
      JOIN
      (SELECT DEPT
         FROM PW_HA_DEPT_T A
        WHERE     (CASE
                      WHEN PLANT_LOCATION = '$dept' THEN 1
                      WHEN 1 = 1 THEN 2
                   END = CASE WHEN LENGTH ('$dept') >= 1 THEN 1 ELSE 2 END)
              AND (CASE WHEN DPR_DEPT = '$part' THEN 1 WHEN 1 = 1 THEN 2 END =
                      CASE WHEN LENGTH ('$part') >= 1 THEN 1 ELSE 2 END)
              AND EFFDT = (SELECT MAX (B.EFFDT)
                     FROM PW_HA_DEPT_T B
                     WHERE A.DEPT = B.DEPT)
              AND EFF_STATUS = 'A') D
         ON C.DEPT = D.DEPT
WHERE     A.SERVICE_ID = 'TT'
      AND A.DATASET = PW_ZZ_UTIL_PG.GET_DATASET_FN ('TT', 'TT', 'JOBCD')
      AND (CASE WHEN A.JOBCD = '$proc' THEN 1
         WHEN 1=1 THEN 2
           END = CASE WHEN length('$proc') >= 1 THEN 1 ELSE 2 END)  
       AND A.EFF_STATUS = 'A'
       AND (CASE
         WHEN ACTUAL_SCORE = '$value' THEN 1
         WHEN ACTUAL_SCORE is not null THEN 2
      END = CASE WHEN length('$value') >= 1 THEN 1 ELSE 2 END)
      AND (CASE
               WHEN ROUND_CD = '$qrt' THEN 1
               WHEN 1=1 THEN 2
            END = CASE WHEN LENGTH('$qrt') >= 1 THEN 1 ELSE 2 END)
       AND A.EFFDT =
              (SELECT MAX (A1.EFFDT)
                 FROM PW_HA_JOBCD_T A1
                WHERE     A1.SERVICE_ID = A.SERVICE_ID
                      AND A1.DATASET = A.DATASET
                      AND A1.JOBCD = A.JOBCD
                      AND A1.EFFDT <= SYSDATE
                      AND A1.MULTI_SKILL_FLAG IS NOT NULL)");
                        $queries = DB::getQueryLog();
                        dd($queries);
      return $user;
   }
}
