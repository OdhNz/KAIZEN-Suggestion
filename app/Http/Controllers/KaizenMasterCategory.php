<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Cookie;

class KaizenMasterCategory extends Controller
{
    public function fetchCategory(Request $r)
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
                                where company = 'TT' 
                                AND  ('$categoryId' IS NULL OR a.category_id = '$categoryId')");
            return $SQL;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function setCategoryData(Request $r)
    {
        $date = Carbon::now();
        $time = time();
        $kaizenId = $r->kaizenId;
        $company = $r->company;
        $loginId = $r->loginId;
        $title = $r->title;
        $kaizenDesc = $r->kaizenDesc;
        $status = $r->status;
        $color = $r->color;
        $kaizenImg = $r->kaizenImg;
        $oldKaizenImg = $r->oldKaizenImg;
        $kaizenFile = [];

        try {
            $kaizenFile = $this->kaizenFileStore(
                new Request([
                    'company' => $company,
                    'file' => $kaizenImg,
                    'status' => 'MASTER',
                    'time' => $time,
                ])
            );
            DB::update(
                "MERGE INTO KAIZEN_CATEGORY_T a
                        USING (SELECT :COMPANY AS company,
                                    :ID AS id,
                                    :TITLE AS title,
                                    :STATUS AS status,
                                    :KAIZEN_DESC AS kaizen_desc,
                                    :PATH AS PATH,
                                    :COLOR AS COLOR,
                                    :LOGIN_ID AS login_id,
                                    SYSDATE AS dt
                                FROM DUAL) b
                            ON (a.company = b.company AND a.category_id = b.id)
                    WHEN MATCHED
                    THEN
                    UPDATE SET a.name = b.title,
                                a.remark = b.kaizen_desc,
                                a.cat_file = nvl(b.PATH, a.cat_file),
                                a.status = b.status,
                                a.color = b.color,
                                a.upd_id = b.login_id,
                                a.upd_dttm = b.dt
                    WHEN NOT MATCHED
                    THEN
                    INSERT     (a.company,
                                a.category_id,
                                a.name,
                                a.remark,
                                a.cat_file,
                                a.color,
                                a.status,
                                a.add_id,
                                a.add_dttm,
                                a.upd_id,
                                a.upd_dttm)
                        VALUES (b.company,
                                (SELECT MAX (category_id) + 1 AS cnt
                                    FROM kaizen_category_t),
                                b.title,
                                b.kaizen_desc,
                                b.PATH,
                                b.color,
                                b.status,
                                b.login_id,
                                b.dt,
                                b.login_id,
                                b.dt)",
                [
                    ":COMPANY" => $company,
                    ":ID" => $kaizenId,
                    ":TITLE" => $title,
                    ":STATUS" => $status,
                    ":KAIZEN_DESC" => $kaizenDesc,
                    ":PATH" => $kaizenFile["path"],
                    ":COLOR" => $color,
                    ":LOGIN_ID" => $loginId,
                ]
            );

            if (!empty($kaizenImg) && !empty($oldKaizenImg)) {
                $this->kaizenFileDelete(
                    new Request([
                        'path' => $oldKaizenImg,
                    ])
                );
            }

            return [
                "message" => 'S',
                "status" => 200,
            ];
        } catch (\Exception $e) {
            $this->kaizenFileDelete(
                new Request([
                    'path' => $kaizenFile['path'],
                ])
            );

            return [
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
            if (empty($file)) {
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
    public function kaizenFileDelete(Request $r)
    {
        $filePaths = $r->path;
        if (!empty($filePaths)) {
            Storage::disk('kaizen')->delete($filePaths);
        }
    }
}
