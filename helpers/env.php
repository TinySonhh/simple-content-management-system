<?php
function loadEnvSimple($file)
{
    if (!file_exists($file)) return;

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Skip comments
        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        putenv("$name=$value");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}

function loadEnv($file)
{
    if (!file_exists($file)) return;

    $vars = [];

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;

        if (!preg_match('/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i', $line, $matches)) continue;

        $name = $matches[1];
        $value = $matches[2];

        // Remove wrapping quotes
        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        // Expand variables like ${VAR_NAME}
        $value = preg_replace_callback('/\${([A-Z0-9_]+)}/i', function ($match) use (&$vars) {
            $varName = $match[1];
            return $vars[$varName] ?? getenv($varName) ?? '';
        }, $value);

        $vars[$name] = $value;
        putenv("$name=$value");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}


/**
 * Custom env() function to retrieve environment variables.
 *
 * @param string $key The environment variable key.
 * @param mixed $default The default value to return if the variable is not set.
 * @return mixed The value of the environment variable or the default value.
 */
function env($key, $default = null) {
    $value = getenv($key);

    // Return the value if it exists, otherwise return the default
    return $value !== false ? $value : $default;
}

loadEnv(__DIR__ . '/../.env');