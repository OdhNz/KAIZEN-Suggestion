<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Cookie;

class MainController extends Controller
{
    public function index(Request $r)
    {
        return Inertia::render('RouterPages');
    }
    public function getDocId()
    {
        try {
            $data = DB::select("SELECT GN_WB_DOC_SEQ.NEXTVAL AS ID FROM DUAL");
            return $data[0]->id;
        } catch (\Throwable $th) {
            error_log($th->getMessage());
        }
    }
    public function getLatesDoc($docId)
    {
        try {
            $data = DB::select(
                "select FILE_PATH, FILE_NAME, FILE_EXT, FILE_SIZE from GN_WB_DOCUMENT_T WHERE DOC_ID = '$docId'"
            );
            return $data[0];
        } catch (\Throwable $th) {
            error_log($th->getMessage());
        }
    }
    public function saveTags($docId, $tags)
    {
        $tagCnt = count($tags);
        $tagArr = [];
        $delete = "DELETE FROM GN_WB_DOCUMENT_TAGS_T WHERE DOC_ID = '$docId'";
        $insert = "INSERT INTO GN_WB_DOCUMENT_TAGS_T
        (DOC_ID, TAG1, TAG2, TAG3, TAG4, TAG5, TAG6, TAG7, TAG8, TAG9, TAG10, TAG11, TAG12, TAG13, TAG14, TAG15, ADD_PERSON_ID, ADD_DTTM, UPD_PERSON_ID, UPD_DTTM)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,SYSDATE,?,SYSDATE)";
        try {
            for ($i = 0; $i < 15; $i++) {
                if ($i < $tagCnt) {
                    $tagArr[$i] = "$tags[$i]";
                } else {
                    $tagArr[$i] = null;
                }
            }
            $value = ["$docId", ...$tagArr, "MRT", "MRT"];
            // $delx = DB::delete($delete);
            $insx = DB::update($insert, $value);
            return false;
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }
    public function saveDocument(Request $r)
    {
        $docId = $r->docId;
        $docTitle = $r->docTitle;
        $docNum = $r->docNum;
        $docCd = $r->docCd;
        $docVer = $r->version;
        $docRemark = $r->docRemark;
        $docLevel = $r->docLevel;
        $docDate = $r->docDt;
        $docCategory = $r->docCategory;
        $docArea = $r->docArea;
        $docPath = $r->docPath;
        $filename = $r->docName;
        $filename = $r->docName;
        $docTags = json_decode($r->tags, true);
        $docNewId = $this->getDocId();
        $docCd = empty($docCd) ? $docNewId : $docCd;
        if ($r->hasFile("file")) {
            $docNum = $docNum + 1;
            $docVer = 0;
            $file = $r->file;
            $filename = pathinfo(
                $file->getClientOriginalName(),
                PATHINFO_FILENAME
            );
            $fileSize = $file->getSize();
            $fileExt = $file->extension();
            $filePath =
                $docArea . "/" . time() . $file->getClientOriginalName();
        } else {
            $docVer = $docVer + 1;
            error_log("TIDAK FILE");
        }

        // $filePath = $file->getClientOriginalName();
        // $sqlTag = "select $docTags[level - 0] from dual connect by rownum < $docTagsCnt"

        $sqlInsertDoc = "INSERT INTO GN_WB_DOCUMENT_T (
                            DOC_ID,
                            DOC_CD,
                            DOC_NUM,
                            DOC_VER,
                            DOC_TITLE,
                            DOC_DATE,
                            DOC_CATEGORY,
                            DOC_LEVEL,
                            DOC_AREA,
                            DOC_REMARK,
                            FILE_PATH,
                            FILE_NAME,
                            FILE_EXT,
                            FILE_SIZE,
                            ADD_PERSON_ID,
                            ADD_DTTM,
                            UPD_PERSON_ID,
                            UPD_DTTM
                            )
                             VALUES (?, ?, ?, ?, ?, TO_DATE(?, 'dd/mm/yyyy'), ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE, ?, SYSDATE)";

        try {
            $this->saveTags($docNewId, $docTags);

            $sql = DB::update($sqlInsertDoc, [
                $docNewId,
                $docCd,
                $docNum,
                $docVer,
                $docTitle,
                $docDate,
                $docCategory,
                $docLevel,
                $docArea,
                $docRemark,
                $filePath,
                $filename,
                $fileExt,
                $fileSize,
                "MRT",
                "MRT",
            ]);

            // if (
            //     !Storage::disk('document')->put(
            //         $filePath,
            //         file_get_contents($file)
            //     )
            // ) {
            //     return false;
            // }
        } catch (\Exception $e) {
            error_log($e->getMessage());
        }
        return ['item' => $sql];
    }

    public function getDocument(Request $r)
    {
        $company = $r->company;
        $file_cd = $r->file_cd;
        $filename = $file->getClientOriginalName();

        try {
            return $item = Storage::disk('document')->download($filename);
        } catch (\Exception $e) {
            error_log($e->getMessage());
        }
    }
}
