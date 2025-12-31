<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Cookie;

class HomeController extends Controller
{
   public function index(Request $r)
   {
      return Inertia::render('Dashboard');
   }
   public function getSearchPage(Request $r)
   {
      $dept = $r->dept;
      $level = $r->level;
      $score = $r->score;
      $parent = $r->parent;
      $plant = $r->plant;
      $round = $r->round;
      $year = $r->year;
      $process = $r->process;
      $skill = $r->skill;
      $isSearch = $r->isSearch;
      $tier = $r->tier;
      $noTier = true;

      $searchLevel = $this->getSkillLvl();
      $searchPlant = $this->getPlant();
      $searchProcess = $this->getSkillCls();
      $searchParent = $this->getParentDept();

      $url = $r->fullUrl();
      $ip_address = $r->getClientIp(true);

      if ($isSearch) {
         $dataSkill = $this->getEmpSkillProc($plant, $skill, $score, $year, $round, $parent, $process, $level, $tier, $noTier, $url, $ip_address);
      } else {
         $dataSkill = [];
      }

      return Inertia::render('Search', [
         'parent' => $parent,
         'round' => $round,
         'year' => $year,
         'plant' => $plant,
         'level' => $level,
         'process' => $process,
         'skill' => $skill,
         'dept' => $dept,
         'score' => $score,
         'level' => $level,
         'dataskill' => $dataSkill,
         'search' => $isSearch,
         'scPlant' => $searchPlant,
         'scProcess' => $searchProcess,
         'scLevel' => $searchLevel,
         'scParent' => $searchParent,

      ]);
   }
   public function getDashboard(Request $r)
   {
      $jobcls = $r->jobcls;
      $year = $r->year;
      $plant = $r->plant;
      $qrt = $r->qrt;

      $url = $r->fullUrl();
      $status = true;
      $message = null;
      $ip_address = $r->getClientIp(true);
      // DB::connection()->enableQueryLog();
      $dashboard = "WITH BASE
            AS (SELECT COUNT (SKILL_CD)
                   OVER (PARTITION BY YEAR,
                                      ROUND_CD,
                                      EMPID)
                   T_SK,
                PLANT PLANT_LOCATION,
                YEAR,
                ROUND_CD,
                PARENT_NAME AS DEPT_NAME,
                EMPID,
                MULTI_SKILL_FLAG AS ACTUAL_SC_TEXT
           FROM PW_HR_MS_MV),
            BASE2
            AS (SELECT PLANT_LOCATION,
                     YEAR,
                     ROUND_CD,
                     DEPT_NAME,
                     ACTUAL_SC_TEXT
                  FROM BASE
               WHERE T_SK > 1),
            BASE_HEAD
            AS (SELECT SUM (CN) OVER (PARTITION BY YEAR, ROUND_CD) HEAD_TOT, A.*
                  FROM (  SELECT ROW_NUMBER ()
                                    OVER (PARTITION BY YEAR,
                                                      ROUND_CD,
                                                      PLANT_LOCATION,
                                                      DEPT_NAME
                                          ORDER BY PLANT_LOCATION)
                                    RN,
                                 COUNT (1)
                                    OVER (PARTITION BY YEAR,
                                                      ROUND_CD,
                                                      PLANT_LOCATION,
                                                      DEPT_NAME)
                                    CN,
                                 YEAR,
                                 ROUND_CD,
                                 EMPID,
                                 REPLACE (PLANT_LOCATION, 'PRD', '3P') PLANT_LOCATION,
                                 DEPT_NAME
                           FROM BASE A
                           WHERE A.T_SK > 1
                        GROUP BY YEAR,
                                 ROUND_CD,
                                 EMPID,
                                 PLANT_LOCATION,
                                 DEPT_NAME) A
               WHERE RN = 1),
            DATA
            AS (  SELECT PLANT_LOCATION,
                        YEAR,
                        ROUND_CD,
                        DEPT_NAME,
                        NVL (A, 0) + NVL (B, 0) + NVL (C, 0) + NVL (D, 0) TOT_SKILLS,
                        A,
                        B,
                        C,
                        D
                  FROM BASE2
                        PIVOT
                           (SUM (1)
                           FOR ACTUAL_SC_TEXT
                           IN ('A' AS A, 'B' AS B, 'C' AS C, 'D' AS D)) A
               ORDER BY LENGTH (PLANT_LOCATION), PLANT_LOCATION ASC)
            SELECT CASE
                  WHEN LENGTH (A.PLANT_LOCATION) = 1
                  THEN
                     'PLANT ' || A.PLANT_LOCATION
                  ELSE
                     A.PLANT_LOCATION
               END
                  PLANT,
               A.PLANT_LOCATION,
               A.DEPT_NAME,
               A.YEAR,
               A.ROUND_CD,
               B.CN HEADCOUNT,
               B.HEAD_TOT,
               A.TOT_SKILLS,
               SUM (A.TOT_SKILLS) OVER (PARTITION BY NULL) TOT,
               TO_CHAR (NVL (A.A / A.TOT_SKILLS * 100, 0), 'FM99990.00') || '%' A_PER,
               NVL (A.A, 0) A_TOT,
               TO_CHAR (NVL (A.B / A.TOT_SKILLS * 100, 0), 'FM99990.00') || '%' B_PER,
               NVL (A.B, 0) B_TOT,
               TO_CHAR (NVL (A.C / A.TOT_SKILLS * 100, 0), 'FM99990.00') || '%' C_PER,
               NVL (A.C, 0) C_TOT,
               TO_CHAR (NVL (A.D / A.TOT_SKILLS * 100, 0), 'FM99990.00') || '%' D_PER,
               NVL (A.D, 0) D_TOT
            FROM DATA A
               LEFT JOIN BASE_HEAD B
                  ON (    A.YEAR = B.YEAR
                     AND A.ROUND_CD = B.ROUND_CD
                     AND A.PLANT_LOCATION = B.PLANT_LOCATION
                     AND A.DEPT_NAME = B.DEPT_NAME)
            WHERE A.YEAR = '$year' AND A.ROUND_CD = '$qrt'
            AND A.PLANT_LOCATION NOT IN ('ASSIST', 'DIRECT', 'INDIRECT')
            ORDER BY DEPT_NAME, LENGTH (PLANT_LOCATION), PLANT_LOCATION ASC";

      try {
         $db_exec =  DB::select($dashboard);
         // $queries = DB::getQueryLog();
         //dd($queries);
      } catch (\Exception $e) {
         $status = false;
         $message = $e->getMessage();
         $db_exec = [];
      }

      $this->setLogMskill($status, 'Dashboard', $url, $message, $ip_address);
      return ['item' => $db_exec];
   }

   public function getYear()
   {
      // DB::connection()->enableQueryLog();

      try {
         $year = DB::select(" SELECT DISTINCT YEAR ID, YEAR TEXT FROM PW_HR_MSKILL_T03");
         // $queries = DB::getQueryLog();
         //dd($queries);
         return $year;
      } catch (\Exception $e) {
         Log::info($e->getMessage());
         return [];
      }
   }

   public function getSkillCls()
   {
      try {
         // DB::connection()->enableQueryLog();
         $skill = DB::select(" SELECT DISTINCT A.JOBCLS_NM ID, A.JOBCLS_NM TEXT
                        FROM PW_HA_JOBCLS_T A, PW_HA_JOBCD_T B
                        WHERE     A.JOBCLS = B.JOBCLS
                           AND B.MULTI_SKILL_FLAG IS NOT NULL
                           AND A.eff_status = 'A'
                           AND A.EFFDT =
                                    (SELECT MAX (EFFDT)
                                       FROM PW_HA_JOBCLS_T AA
                                    WHERE     AA.JOBCLS = B.JOBCLS
                                          AND AA.SERVICE_ID = B.SERVICE_ID
                                          AND AA.DATASET = B.DATASET
                                          AND aa.eff_status = 'A'
                                          AND EFFDT < TRUNC (SYSDATE))
                           AND B.EFFDT =
                                    (SELECT MAX (EFFDT)
                                       FROM PW_HA_JOBCD_T AA
                                    WHERE     AA.JOBCD = B.JOBCD
                                          AND AA.SERVICE_ID = B.SERVICE_ID
                                          AND AA.DATASET = B.DATASET
                                          AND aa.eff_status = 'A'
                                          AND EFFDT < TRUNC (SYSDATE))
                        GROUP BY A.JOBCLS_NM
                        ORDER BY JOBCLS_NM");

         // $queries = DB::getQueryLog();
         // dd($queries);
         return $skill;
      } catch (\Exception $e) {
         Log::info($e->getMessage());
         return [];
      }
   }

   public function getPlant()
   {
      try {
         // DB::connection()->enableQueryLog();
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
                        AND D.PLANT_LOCATION NOT IN ('ASSIST','DIRECT','INDIRECT')
                        AND D.EFFDT =
                                (SELECT MAX (EFFDT)
                                    FROM PW_HA_DEPT_T
                                    WHERE     SERVICE_ID = D.SERVICE_ID
                                        AND DATASET = D.DATASET
                                        AND DEPT = D.DEPT
                                        AND EFFDT <= SYSDATE)
                    ORDER BY LENGTH(ID), ID ASC");

         // $queries = DB::getQueryLog();
         // dd($queries);
         return $plants;
      } catch (\Exception $e) {
         Log::info($e->getMessage());
         return [];
      }
   }
   public function getProc(Request $r)
   {
      $line = $r->line;
      return $this->getJob($line);
   }
   public function getJob($process)
   {
      try {
         // DB::connection()->enableQueryLog();
         $proc = DB::select("SELECT *
                     FROM (  SELECT PW_ZZ_UTIL_PG.GET_JOBCD_NM_FN (A.SERVICE_ID,
                                                                  A.DATASET,
                                                                  A.JOBCD,
                                                                  A.EFFDT,
                                                                  'ENG')
                                       AS ID,
                                    PW_ZZ_UTIL_PG.GET_JOBCD_NM_FN (A.SERVICE_ID,
                                                                  A.DATASET,
                                                                  A.JOBCD,
                                                                  A.EFFDT,
                                                                  'ENG')
                                       AS TEXT,
                                    ROW_NUMBER () OVER (PARTITION BY JOBCD_NM ORDER BY JOBCD) RN
                              FROM PW_HA_JOBCD_T A
                              WHERE     ('' IS NULL OR JOBCLS = '$process')
                                    AND A.SERVICE_ID = 'TT'
                                    AND A.DATASET =
                                          PW_ZZ_UTIL_PG.GET_DATASET_FN ('TT', 'TT', 'JOBCD')
                                    AND EFF_STATUS = 'A'
                                    AND EFFDT =
                                          (SELECT MAX (EFFDT)
                                             FROM PW_HA_JOBCD_T B
                                             WHERE     B.SERVICE_ID = A.SERVICE_ID
                                                   AND B.DATASET = A.DATASET
                                                   AND B.JOBCD = A.JOBCD
                                                   AND B.EFFDT <= SYSDATE
                                                   AND A.MULTI_SKILL_FLAG IS NOT NULL)
                           ORDER BY JOBCD_NM ASC)
                     WHERE RN = 1");


         // $queries = DB::getQueryLog();
         // dd($queries);
         return $proc;
      } catch (\Exception $e) {
         Log::info($e->getMessage());
         return [];
      }
   }
   public function getParentDept()
   {
      try {
         // DB::connection()->enableQueryLog();
         $dept = DB::select("SELECT DISTINCT D.DEPT ID, TEAMNM TEXT
                              FROM PW_HA_DEPT_T D, VIEW_EAM100_S1 E
                           WHERE     D.SERVICE_ID = 'TT'
                                 AND D.DATASET =
                                          (SELECT PW_ZZ_UTIL_PG.GET_DATASET_FN ('TT', 'TT', 'DEPT')
                                             FROM DUAL)
                                 AND D.DEPT = E.DEPTCD
                                 AND DEPTCD LIKE '%STT%'
                                 AND D.PLANT_LOCATION IS NOT NULL
                                 AND D.PLANT_LOCATION NOT IN ('ASSIST', 'DIRECT')
                                 AND E.DEPTCD NOT IN ('STT190025','STT180002')
                                 AND D.EFFDT =
                                          (SELECT MAX (EFFDT)
                                             FROM PW_HA_DEPT_T
                                          WHERE     SERVICE_ID = D.SERVICE_ID
                                                AND DATASET = D.DATASET
                                                AND DEPT = D.DEPT
                                                AND EFFDT <= SYSDATE)
                        ORDER BY TEXT ASC");


         // $queries = DB::getQueryLog();
         // dd($queries);
         return $dept;
      } catch (\Exception $e) {
         Log::info($e->getMessage());
         return [];
      }
   }
   public function getEmpSkill(Request $r)
   {
      $dept = $r->dept;
      $proc = $r->proc;
      $value = $r->value;
      $year = $r->year;
      $qrt = $r->qrt;
      $parent = $r->parentDept;
      $skill = $r->skill;
      $level = $r->skillLvl;
      $tier = $r->tier;
      $noTier = false;

      $url = $r->fullUrl();
      $ip_address = $r->getClientIp(true);

      return $this->getEmpSkillProc($dept, $proc, $value, $year, $qrt, $parent, $skill, $level, $tier, $noTier, $url, $ip_address);
   }

   public function getEmpSkillProc($dept, $proc, $value, $year, $qrt, $parent, $skill, $level, $tier, $noTier, $url, $ip_address)
   {
      $status = true;
      $message = null;

      // DB::connection()->enableQueryLog();
      $userQue = "SELECT A.PLANT,
                     A.VSM_LINE,
                     A.YEAR,
                     A.ROUND_CD,
                     A.EMPID,
                     A.NAME,
                     A.JOB_POSITION_NM,
                     A.PROCESS_NM,
                     CASE
                        WHEN A.MULTI_SKILL_FLAG = 'A' THEN '100%'
                        WHEN A.MULTI_SKILL_FLAG = 'B' THEN '75%'
                        WHEN A.MULTI_SKILL_FLAG = 'C' THEN '50%'
                        WHEN A.MULTI_SKILL_FLAG = 'D' THEN '25%'
                     END
                        AS MULTI_SKILL_FLAG,
                     A.PARENT_NAME,
                     A.SKILL_LEVEL,
                     A.TIER_CD,
                     NVL(A.TIER_NM, '-') AS TIER_NM
               FROM (SELECT COUNT (1) OVER (PARTITION BY YEAR, ROUND_CD, EMPID) CN, A.*
                        FROM PW_HR_MS_MV A) A
               WHERE     1 = 1
                     AND (   '$parent' IS NULL
                        OR A.DEPT IN
                              (SELECT DEPT
                                 FROM PW_HA_TREE_NODE_T T
                                 WHERE     T.SERVICE_ID = 'TT'
                                       AND T.TREE_ID =
                                             (SELECT PW_HA_UTIL_PG.GET_DEF_TREE_ID (
                                                         'TT',
                                                         'TT',
                                                         SYSDATE)
                                                FROM DUAL)
                                       AND T.TREE_NODE_NO BETWEEN (SELECT PW_HA_UTIL_PG.get_dept_tree_node_no (
                                                                              'TT',
                                                                              T.TREE_ID,
                                                                              '$parent')
                                                                     FROM DUAL)
                                                               AND (SELECT PW_HA_UTIL_PG.get_dept_tree_node_no_end (
                                                                              'TT',
                                                                              T.TREE_ID,
                                                                              '$parent')
                                                                     FROM DUAL)))
      AND A.PLANT NOT IN ('DIRECT','ASSIST','INDIRECT')";
      if (!is_null($proc)) {
         $userQue = $userQue . " " . "AND A.PROCESS_NM LIKE '%$proc%'";
      }
      if (!is_null($year)) {
         $userQue = $userQue . " " . "AND A.YEAR = '$year'";
      }
      if (!is_null($value)) {
         $userQue = $userQue . " " . "AND A.MULTI_SKILL_FLAG = DECODE('$value', '100', 'A', '075', 'B','050', 'C', '025', 'D')";
      }
      if (!is_null($qrt)) {
         $userQue = $userQue . " " . "AND A.ROUND_CD = '$qrt'";
      }
      if (!is_null($skill)) {
         $userQue = $userQue . " " . "AND A.VSM_LINE LIKE '%$skill%'";
      }
      if (!is_null($dept)) {
         $userQue = $userQue . " " . "AND  A.PLANT = REPLACE('$dept', 'PRD', '3P') ";
      }
      if (!is_null($level)) {
         $userQue = $userQue . " " . "AND A.SKILL_LEVEL = '$level'";
      }
      if (!is_null($tier)) {
         $userQue = $userQue . " " . "AND A.TIER_CD = '$tier'";
      }
      if ($noTier) {
         $userQue = $userQue . " " . "AND A.CN > 1";
      }
      $userQue = $userQue . " " . "ORDER BY PLANT, VSM_LINE, NAME, EMPID, PROCESS_NM, MULTI_SKILL_FLAG";
      try {
         $user = DB::select($userQue);
         $this->setLogMskill($status, 'Search', $url, $message, $ip_address);
         // $queries = DB::getQueryLog();
         // dd($queries);
         return $user;
      } catch (\Exception $e) {
         $message = $e->getMessage();
         $status = false;
         $this->setLogMskill($status, 'Search', $url, $message, $ip_address);
         return [];
      }
   }

   public function getSkillLvl()
   {
      $query = "SELECT code_id id, code_nm text
                  FROM PW_ZZ_CODE_T
               WHERE code_class_id = 'MULTI_SKILL_FLAG'";
      try {
         $exec = DB::select($query);
         return $exec;
      } catch (\Exception $e) {
         Log::info($e->getMessage());
         return [];
      }
   }
   public function getDetailPage(Request $r)
   {
      $year = $r->year;
      $round = $r->round;
      $plant = $r->plant;
      $dept = $r->dept;

      $url = $r->fullUrl();
      $ip_address = $r->getClientIp(true);
      $status = true;;
      $message = null;


      // DB::connection()->enableQueryLog();
      $sql = "WITH BASE
      AS (SELECT COUNT (A.SKILL_CD)
          OVER (PARTITION BY A.YEAR,
                             A.ROUND_CD,
                             A.EMPID)
          T_SK,
        A.PLANT AS PLANT_LOCATION,
        A.PARENT_CD,
        A.PARENT_NAME AS PARENT_DEPT,
        A.PROCESS_CD,
        A.VSM_LINE AS PROCESS_NM,
        A.SKILL_CD,
        A.PROCESS_NM AS SKILL_NM,
        A.YEAR,
        A.ROUND_CD,
        A.SKILL_LEVEL,
        A.MULTI_SKILL_FLAG AS ACTUAL_SC_TEXT
   FROM PW_HR_MS_MV A),
  BASE2
   AS (SELECT  PLANT_LOCATION,
               PARENT_CD,
               PARENT_DEPT,
               PROCESS_CD,
               PROCESS_NM,
               SKILL_CD,
               SKILL_NM,
               YEAR,
               ROUND_CD,
               SKILL_LEVEL,
                  ACTUAL_SC_TEXT
         FROM base
         WHERE T_SK > 1),
      DATA
      AS (  SELECT YEAR,
                  ROUND_CD,
                  PLANT_LOCATION,
                  PARENT_CD,
                  PARENT_DEPT,
                  PROCESS_CD,
                  PROCESS_NM,
                  SKILL_CD,
                  SKILL_NM,
                  SKILL_LEVEL,
                  NVL (A, 0) + NVL (B, 0) + NVL (C, 0) + NVL (D, 0) TOT_SKILLS,
                  NVL (A, 0) A,
                  NVL (B, 0) B,
                  NVL (C, 0) C,
                  NVL (D, 0) D
            FROM BASE2
                  PIVOT
                     (SUM (1)
                     FOR ACTUAL_SC_TEXT
                     IN ('A' AS A, 'B' AS B, 'C' AS C, 'D' AS D)) A
         ORDER BY YEAR,
                  ROUND_CD,
                  LENGTH (PLANT_LOCATION),
                  PLANT_LOCATION,
                  PROCESS_NM,
                  SKILL_NM ASC)
SELECT SUM (TOT_SKILLS) OVER (PARTITION BY YEAR, ROUND_CD, PLANT_LOCATION)
         TOT_SKILL,
      COUNT (1) OVER (PARTITION BY PLANT_LOCATION) PLANT_CNT,
      COUNT (1)
         OVER (PARTITION BY YEAR,
                              ROUND_CD,
                              PLANT_LOCATION,
                              PARENT_DEPT,
                              PROCESS_NM
                              )
         PROCESS_CNT,
      COUNT (1)
         OVER (PARTITION BY YEAR,
                              ROUND_CD,
                              PLANT_LOCATION,
                              PARENT_DEPT
                              )
         PARENT_CNT,
      ROW_NUMBER ()
         OVER (PARTITION BY YEAR,
                              ROUND_CD,
                              PLANT_LOCATION,
                              PARENT_DEPT
               ORDER BY 1)
         PARENT_RN,
      ROW_NUMBER ()
         OVER (PARTITION BY YEAR,
                              ROUND_CD,
                              PLANT_LOCATION,
                              PARENT_DEPT,
                              PROCESS_NM
               ORDER BY PROCESS_NM, SKILL_NM)
         PROCESS_RN,
      CASE
         WHEN LENGTH (PLANT_LOCATION) = 1 THEN 'PLANT ' || PLANT_LOCATION
         ELSE REPLACE (PLANT_LOCATION, 'PRD', '3P')
      END
         PLANT,
      DT.*
   FROM DATA DT
   WHERE  YEAR = '$year'
         AND ROUND_CD = '$round'
         AND REPLACE(PLANT_LOCATION, 'PRD', '3P') = '$plant'
         AND PARENT_DEPT = '$dept'
         ORDER BY PROCESS_NM, PROCESS_RN, SKILL_NM";

      try {
         $getDetail = DB::select($sql);
         // $queries = DB::getQueryLog();
         // dd($queries);
      } catch (\Exception $e) {
         $message = $e->getMessage();
         $status = false;
         $getDetail = [];
      }

      $this->setLogMskill($status, 'Detail Dashboard', $url, $message, $ip_address);
      return Inertia::render('DetailDashboard', [
         'detail' => $getDetail,
      ]);
   }
   public function setLogMskill($status, $page, $action, $message, $ip_address)
   {
      $value = Cookie::get('Login');
      try {
         $sql = DB::update("INSERT INTO PW_ZZ_MULTISKILL_LOG_T (EMPID, STATUS, PAGE, ACTION_LINK, MESSAGE, ADD_DTTM, IP_ADDRESS)
                                 VALUES (?, ?, ?, ?, ?, SYSDATE, ?)", [$value, $status, $page, $action, $message, $ip_address]);
      } catch (\Exception $e) {
      }
   }
}
