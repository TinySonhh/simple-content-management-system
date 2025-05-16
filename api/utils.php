<?php

function loadConfig()
{
	$file = __DIR__ . '/../data/config.json';
	if (!file_exists($file)) {
		return [];
	}

	$config = [];
	$json = file_get_contents($file);
	$data = json_decode($json, true);
	foreach ($data as $key => $item) {
		$config[$key] = $item;		
	}
	return $config;
}

function loadAllPaths($file)
{
	if (!file_exists($file)) {
		return [];
	}

	$default_sub_paths = [];
	$json = file_get_contents($file);
	$data = json_decode($json, true);

	foreach ($data as $item) {
		if (isset($item['value']) && isset($item['text'])) {
			$default_sub_paths[$item['value']] = $item['text'];
		}
	}

	return $default_sub_paths;
}