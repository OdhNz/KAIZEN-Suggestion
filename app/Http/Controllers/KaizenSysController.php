<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Cookie;

class KaizenSysController extends Controller
{
    public function fetchKaizenLocation(Request $r)
    {
        try {
            $SQL = DB::select("SELECT company, VALUE, label
                                FROM kaizen_location_t
                                WHERE company = 'TT'");
            return $SQL;
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function fetchKaizenCategory(Request $r)
    {
        try {
            $SQL = DB::select("SELECT company, category_id AS VALUE, name AS label
                                FROM kaizen_category_t
                                WHERE company = 'TT'");
            return $SQL;
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
                return response()->json([
                    'data' => "",
                    'type' => "",
                    'ext' => "",
                    'status' => 250,
                    'statusText' => 'OK',
                ]);
            }
            $fileContent = Storage::disk('kaizen')->get($path);
            $mimeType = $SQL[0]->content_type;
            $ext = $SQL[0]->ext;
            $base64 =
                'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
            return response()->json([
                'data' => $base64,
                'type' => $mimeType,
                'ext' => $ext,
                'status' => 200,
                'statusText' => 'OK',
            ]);
            // return Storage::disk('kaizen')->response($path);
        } catch (\Exception $e) {
            error_log($e->getMessage());
        }
    }

    public function fetchKaizenFileBatch(Request $request)
    {
        $paths = $request->input('paths', []);
        $results = [];
        
        foreach ($paths as $path) {
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
            
                if (!$SQL || !isset($SQL[0])) {
                    $results[$path] = [
                        'data' => '',
                        'type' => '',
                        'ext' => '',
                        'status' => 404,
                        'statusText' => 'File not found',
                    ];
                    continue;
                }
            
                $fileContent = Storage::disk('kaizen')->get($path);
                $mimeType = $SQL[0]->content_type;
                $ext = $SQL[0]->ext;
                $base64 = 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
            
                $results[$path] = [
                    'data' => $base64,
                    'type' => $mimeType,
                    'ext' => $ext,
                    'status' => 200,
                    'statusText' => 'OK',
                ];
            } catch (\Exception $e) {
                Log::error("Gagal ambil file: " . $path . " - " . $e->getMessage());
                $results[$path] = [
                    'data' => '',
                    'type' => '',
                    'ext' => '',
                    'status' => 500,
                    'statusText' => 'Internal Server Error',
                ];
            }
        }
    
        return response()->json($results);
    }
    public function fetchDocumentDownload(Request $r)
    {
        $path = $r->path;

        try {
            $SQL = DB::select(
                "SELECT FILE_NAME, CONTENT_TYPE, FILE_PATH
                 FROM KAIZEN_FILE_T
                 WHERE FILE_PATH = :PATH",
                ['PATH' => $path]
            );
    
            if (!$SQL || count($SQL) === 0) {
                return response()->json([
                    'error' => 'File not found'
                ], 404);
            }
    
            $filename = $SQL[0]->file_name;
            $mimeType = $SQL[0]->content_type;
    
            // Ambil path absolut dari storage disk "kaizen"
            $absolutePath = Storage::disk('kaizen')->path($path);
    
            // Return file dengan header MIME yang benar
            return response()->download(
                $absolutePath,
                $filename,
                ['Content-Type' => $mimeType]
            );
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'error' => 'Internal Server Error'
            ], 500);
        }
    }
}
