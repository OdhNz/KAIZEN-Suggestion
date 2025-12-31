<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Traits\SanitizedRequest;
use Carbon\Carbon;
use Cookie;

class KaizenFormController extends Controller
{
    use SanitizedRequest;
    public function fetchCategoryForm(Request $r)
    {
        $categoryId = $r->id;
        try {
            $SQL = DB::select("SELECT a.company,
                                    a.category_id,
                                    a.name,
                                    a.remark,
                                    a.cat_file,
                                    a.color,
                                    a.status
                                FROM KAIZEN_CATEGORY_T a
                                where a.status = 'A' 
                                AND ('$categoryId' IS NULL OR a.category_id = '$categoryId')");
            $categories = [];
            foreach ($SQL as $item) {
                $categories[] =  array_merge((array)$item, ['file' => $this->fetchKaizenFile(new Request([ 'path' => $item->cat_file]))]);
            }
            return $categories;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function fetchKaizenFile(Request $r)
    {
        $path = $r->path;

        try {
            $SQL = DB::select(
                "SELECT COMPANY,
                            FILE_NAME,
                            ORG_FILE_NAME,
                            EXT,
                            FILE_SIZE,
                            CONTENT_TYPE,
                            FILE_PATH
                        FROM KAIZEN_FILE_T
                        WHERE FILE_PATH = :PATH",
                ['PATH' => $path]
            );
            if (!$SQL[0]) {
                return "";
            }
            $fileContent = Storage::disk('kaizen')->get($path);
            $mimeType = $SQL[0]->content_type;
            $ext = $SQL[0]->ext;
            $base64 =
                'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
            return $base64;
            // return Storage::disk('kaizen')->response($path);
        } catch (\Exception $e) {
            error_log($e->getMessage());
        }
    }
    public function setKaizenForm(Request $r)
    {
        $date = Carbon::now();
        $time = time();
        $kaizenId = $r->kaizen_id;
        $company = $r->company;
        $login_id = $r->login_id;
        $title = $r->title;
        $category = $r->kaizenId;
        $empno = $r->empno;
        $beforeImg = $r->beforeImg;
        $afterImg = $r->afterImg;
        $beforeText = $r->beforeText;
        $afterText = $r->afterText;
        $file = $r->file;
        $bgnDt = $r->bgnDt;
        $endDt = $r->endDt;
        $supportId = $r->supportId;
        $location_id = $r->loc;
        $befImage = [];
        $aftImage = [];
        $kaizenFile = [];

        try {
            $befImage = $this->kaizenFileStore(
                new Request([
                    'empno' => $empno,
                    'file' => $beforeImg,
                    'status' => 'BEF',
                    'time' => $time,
                ])
            );
            $aftImage = $this->kaizenFileStore(
                new Request([
                    'empno' => $empno,
                    'file' => $afterImg,
                    'status' => 'AFT',
                    'time' => $time,
                ])
            );
            $kaizenFile = $this->kaizenFileStore(
                new Request([
                    'empno' => $empno,
                    'file' => $file,
                    'status' => 'FILE',
                    'time' => $time,
                ])
            );
            $kaizenCd = empty($kaizenId)
                ? DB::select("WITH DATA1 AS (SELECT COUNT (1) AS CD_ALL FROM KAIZEN_RSV_T),
                                    DATA2
                                    AS (  SELECT COUNT (1) AS CD_NM
                                            FROM KAIZEN_RSV_T
                                            WHERE TRUNC (ADD_DTTM) = TRUNC (SYSDATE)
                                        GROUP BY TL_DATE)
                                SELECT CD_ALL AS KAIZEN_ID,
                                        TO_CHAR (SYSDATE, 'yymmdd')
                                    || '-'
                                    || LPAD (NVL (CD_NM + 1, 1), 3, '0')
                                        AS KAIZEN_ID_NM
                                FROM DUAL
                                    LEFT JOIN DATA1 ON (1 = 1)
                                    LEFT JOIN DATA2 ON (1 = 1)")
                : [];
            DB::transaction(function () use (
                $company,
                $kaizenCd,
                $category,
                $title,
                $location_id,
                $empno,
                $bgnDt,
                $endDt,
                $kaizenFile,
                $befImage,
                $beforeText,
                $aftImage,
                $afterText,
                $supportId,
            ) {
                DB::update(
                    $this->setSupportIdTxt(
                        new Request([
                            'company' => $company,
                            'empno' => $empno,
                            'kaizen_id' => $kaizenCd[0]->kaizen_id,
                            'supportIds' => $supportId,
                        ])
                    )
                );
                DB::update(
                    "INSERT INTO KAIZEN_RSV_T (
                                 COMPANY      
                                ,KAIZEN_ID    
                                ,KAIZEN_ID_NM 
                                ,TITLE
                                ,CATEGORY_ID  
                                ,LOCATION_ID
                                ,EMPNO  
                                ,STATUS      
                                ,TL_DATE      
                                ,BGN_DT       
                                ,END_DT
                                ,DOC       
                                ,BEF_FILE     
                                ,BEF_REMARK   
                                ,AFT_FILE     
                                ,AFT_REMARK   
                                ,ADD_ID  
                                ,ADD_DTTM     
                                ,UPD_ID   
                                ,UPD_DTTM     
                            )
                             VALUES (:COMPANY, 
                                    :KAIZEN_ID, 
                                    :KAIZEN_ID_NM, 
                                    :TITLE,
                                    :CATEGORY_ID, 
                                    :LOCATION_ID,
                                    UPPER(:EMPNO),
                                    'N',
                                    TRUNC(SYSDATE),
                                    TO_DATE(:BGN_DT, 'yyyy-mm-dd'), 
                                    TO_DATE(:END_DT, 'yyyy-mm-dd'), 
                                    :DOC,
                                    :BEF_FILE, 
                                    :BEF_REMARK, 
                                    :AFT_FILE, 
                                    :AFT_REMARK, 
                                    'SYSTEM', 
                                    SYSDATE, 
                                    'SYSTEM', 
                                    SYSDATE)",
                    [
                        'COMPANY' => $company,
                        'KAIZEN_ID' => $kaizenCd[0]->kaizen_id,
                        'KAIZEN_ID_NM' => $kaizenCd[0]->kaizen_id_nm,
                        'TITLE' => $title,
                        'CATEGORY_ID' => $category,
                        'LOCATION_ID' => $location_id,
                        'EMPNO' => $empno,
                        'BGN_DT' => $bgnDt,
                        'END_DT' => $endDt,
                        'DOC' => $kaizenFile['path'],
                        'BEF_FILE' => $befImage['path'],
                        'BEF_REMARK' => $beforeText,
                        'AFT_FILE' => $aftImage['path'],
                        'AFT_REMARK' => $afterText,
                    ]
                );
            });

            return [
                "message" => 'S',
                "status" => 200,
            ];
        } catch (\Exception $e) {
            $this->kaizenFileDelete(
                new Request([
                    'path' => $befImage['path'],
                ])
            );
            $this->kaizenFileDelete(
                new Request([
                    'path' => $aftImage['path'],
                ])
            );
            $this->kaizenFileDelete(
                new Request([
                    'path' => $kaizenFile['path'],
                ])
            );
            return [
                "test" => $supportId,
                "message" => $e->getMessage(),
                "status" => 400,
            ];
        }
    }
    public function kaizenFileStore(Request $r)
    {
        $empno = $r->empno;
        $file = $r->file;
        $status = $r->status;
        $company = $r->company;

        try {
            if ($file == "null") {
                return ["name" => "", "path" => ""];
            }
            $filename = $file->getClientOriginalName();
            $fileOrgname = pathinfo(
                $file->getClientOriginalName(),
                PATHINFO_FILENAME
            );
            $fileSize = $file->getSize();
            $fileExt = $file->getClientOriginalExtension();
            $fileType = $file->getClientMimeType();
            $filePath =
                $status .
                "/" .
                "KZN" .
                $status .
                $empno .
                time() .
                '.' .
                $fileExt;
            if (
                !Storage::disk('kaizen')->put(
                    $filePath,
                    file_get_contents($file)
                )
            ) {
                return false;
            }

            DB::update(
                    "INSERT INTO KAIZEN_FILE_T (COMPANY,
                                                FILE_PATH,
                                                FILE_NAME,
                                                ORG_FILE_NAME,
                                                EXT,
                                                FILE_SIZE,
                                                CONTENT_TYPE)
                        VALUES ( :COMPANY,
                                :FILE_PATH,
                                :FILE_NAME,
                                :ORG_FILENAME,
                                :EXT,
                                :FILE_SIZE,
                                :CONTENT_TYPE)",
                        [
                            'COMPANY' => $company,
                            'FILE_PATH' => $filePath,
                            'FILE_NAME' => $filename,
                            'ORG_FILENAME' => $fileOrgname,
                            'EXT' => $fileExt,
                            'FILE_SIZE' => $fileSize,
                            'CONTENT_TYPE' => $fileType,
                        ]
                );            
            return ["name" => $filename, "path" => $filePath];
        } catch (\Exception $e) {
            return [
                "message" => "Data failed to add!",
                "message_dtl" => $e->getMessage(),
                "status" => 400,
            ];
        }
    }
    public function setSupportIdTxt(Request $r)
    {
        if (!$r->supportIds) {
            return "";
        }
        $supportIds = json_decode($r->supportIds);
        $company = $r->company;
        $kaizen_id = $r->kaizen_id;
        $lastIdx = count($supportIds);
        $SQL =
            "INSERT INTO KAIZEN_SUPPORT_ID_T (company, kaizen_id, empno, status, add_id, add_dttm, upd_id, upd_dttm)" .
            " ";
        foreach ($supportIds as $key => $value) {
            if ($key + 1 == $lastIdx) {
                $SQL =
                    $SQL .
                    "SELECT '$company' as company, 
                    '$kaizen_id' as kaizen_id, 
                    upper('$value') as empno, 
                    'A' as status,
                    'SYSTEM' as add_id, 
                    sysdate as add_dttm,
                    'SYSTEM' as upd_id, 
                    sysdate as upd_dttm 
                    from dual";
            } else {
                $SQL =
                    $SQL .
                    "SELECT '$company' as company, 
                    '$kaizen_id' as kaizen_id, 
                    upper('$value') as empno, 
                    'A' as status, 
                    'SYSTEM' as login_id, 
                    sysdate as add_dttm,
                    'SYSTEM' as upd_id, 
                    sysdate as upd_dttm 
                    from dual UNION ALL" .
                    " ";
            }
        }
        return $SQL;
    }
    public function kaizenFileDelete(Request $r)
    {
        $filePaths = $r->path;
        if (!empty($filePaths)) {
            Storage::disk('kaizen')->delete($filePaths);
        }
    }
    public function getEmpno(Request $r)
    {
        $empno = $r->empno;
        $SQL = "SELECT company,
                        empid,
                        name,
                        org_lvl11_nm AS dept
                    FROM PW_HR_EMPLOYEES_IFACE_MV@DL_TTAMESTOTTHCMIF p
                    WHERE empno = :EMPNO";

        try {
            $SQLEX = DB::select($SQL, ['EMPNO' => $empno]);
            return $SQLEX;
        } catch (\Exception $e) {
            return $e;
        }
    }
}
