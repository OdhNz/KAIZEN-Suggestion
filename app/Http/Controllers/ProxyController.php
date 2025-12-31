<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;

class ProxyController extends Controller
{
    public function profilePhoto($empid)
    {
        $url = "https://gw.taekwang.com/images/ProfilePhoto/{$empid}.jpg";
        return $this->proxyRemote($url, 'image/jpeg');
    }

    public function fetchByUrl(Request $request)
    {
        $url = $request->query('url');
        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            return response()->json(['error' => 'Invalid URL'], 400);
        }
        return $this->proxyRemote($url);
    }

    public function fetchByPath(Request $request)
    {
        $base = $request->query('base');
        $path = $request->query('path');

        if (!$base || !$path) {
            return response()->json(['error' => 'base and path required'], 400);
        }

        $allowedHosts = ['gw.taekwang.com', 'cdn.gw.taekwang.com'];
        $host = parse_url($base, PHP_URL_HOST);
        if (!in_array($host, $allowedHosts, true)) {
            return response()->json(['error' => 'Host not allowed'], 403);
        }

        $url = rtrim($base, '/') . '/' . ltrim($path, '/');
        return $this->proxyRemote($url);
    }

    protected function proxyRemote(string $url, ?string $forceContentType = null)
    {
        try {
            $client = new Client(['verify' => false, 'timeout' => 10]);
            $cacheKey = 'proxy:' . md5($url);
    
            $cached = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($client, $url, $forceContentType) {
                $res = $client->get($url, [
                    'headers' => [
                        'Accept' => '*/*',
                        'User-Agent' => 'Laravel-Proxy/1.0',
                    ],
                ]);
    
                if ($res->getStatusCode() !== 200) {
                    throw new \Exception('Upstream error');
                }
    
                $body = $res->getBody()->getContents();
                $contentType = $forceContentType ?? $res->getHeaderLine('Content-Type');
                if (!$contentType) {
                    $contentType = $this->guessContentTypeFromUrl($url) ?? 'application/octet-stream';
                }
    
                return ['body' => $body, 'contentType' => $contentType];
            });
    
            return response($cached['body'], 200)
                ->header('Content-Type', $cached['contentType'])
                ->header('Cache-Control', 'public, max-age=1800') // 30 menit
                ->header('Access-Control-Allow-Origin', '*');
        } catch (\Throwable $e) {
            Log::error('Proxy error: ' . $e->getMessage(), ['url' => $url]);
            return response()->json(['error' => 'Proxy failed'], 500);
        }
    }
    

    protected function guessContentTypeFromUrl(string $url): ?string
    {
        $ext = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
        $map = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'pdf' => 'application/pdf',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'csv' => 'text/csv',
            'txt' => 'text/plain',
            'svg' => 'image/svg+xml',
        ];
        return $map[$ext] ?? null;
    }
}
