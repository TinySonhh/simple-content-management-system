<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/__config.php';
// Expect JSON input
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
$base =  $data['host_root'] ?? (__DIR__ . '/uploads');
$sub_path =  $data['sub_path'] ?? "";

$base = rtrim("$base/$sub_path", "/");
//echo "Base: $base\n";

$result = [];

try{
    if(empty($sub_path)){
        //Use detail level 2 for the root directory
        $useDetailLevel2 = false;
        if(!$useDetailLevel2){
            $host = trim($sub_path," \n\r\t\v\x00/");
            if(file_exists($base)){
                $children = scandir($base);
                $entries = array_diff($children, ['.', '..']);            
                //$result[$host] = array_values($entries);
                
                $result[$host] = [];
                foreach ($entries as $entry) {
                    $path = $base . DIRECTORY_SEPARATOR . $entry;
                    $result[$host][] = [
                        'name' => $entry,            
                        'type' => is_dir($path) ? 'folder' : 'file'
                    ];
                }
            } else {            
                $result[$host][] = [
                    'name' => "Directory does not exist.",                    
                    'type' => 'error'
                ];
            }
        } else{
            foreach (glob("$base/*", GLOB_ONLYDIR) as $hostDir) {            
                if(file_exists($hostDir)){
                    $host = basename($hostDir);
                    $children = scandir($hostDir);
                    $entries = array_diff($children, ['.', '..']);                
                    //$result[$host] = array_values($entries);            
                    
                    $result[$host] = [];
                    foreach ($entries as $entry) {
                        $path = $hostDir . DIRECTORY_SEPARATOR . $entry;
                        $result[$host][] = [
                            'name' => $entry,                  
                            'type' => is_dir($path) ? 'folder' : 'file'
                        ];
                    }
                } else {
                    $result[$host][] = [
                        'name' => "Directory does not exist.",                    
                        'type' => 'error'
                    ];
                }
            }
        }
    } else {
        $host = trim($sub_path," \n\r\t\v\x00/");
        if(file_exists($base)){
            $children = scandir($base);
            $entries = array_diff($children, ['.', '..']);            
            //$result[$host] = array_values($entries);
            
            $result[$host] = [];
            foreach ($entries as $entry) {
                $path = $base . DIRECTORY_SEPARATOR . $entry;
                $result[$host][] = [
                    'name' => $entry,            
                    'type' => is_dir($path) ? 'folder' : 'file'
                ];
            }
        } else {            
            $result[$host][] = [
                'name' => "Directory does not exist.",                    
                'type' => 'error'
            ];
        }
    }
} catch (Exception $e) {
    $result['error'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($result);
