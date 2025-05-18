<?php
session_start();

require_once 'helpers/env.php';
include_once 'api/__config.php';
require_once __DIR__ . '/api/jwt.core.php';

$valid_user = env('APP_USERNAME', 'admin');
$valid_pass = env('APP_PASSWORD', 'admin');

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$user = $_POST['username'] ?? '';
	$pass = $_POST['password'] ?? '';

	if ($user === $valid_user && $pass === $valid_pass) {
			$_SESSION['logged_in'] = true;
			//create jwt token
			$payload = [
				'username' => $user,				
				'exp' => time() + env('SESSION_LIFETIME', 3600)
			];
			$secret_key = env('APP_KEY');
			$algorithm = env('APP_ALGORITHM', 'HS256');
			$jwt = JWT::encode($payload, $secret_key, $algorithm);
			$_SESSION['jwt'] = $jwt;

			header('Location: index.php');
			exit;
	} else {
			$error = 'Invalid username or password';
	}
}
?>

<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body class="bg-light">
<div class="container mt-5">
	<div class="card mx-auto" style="max-width: 400px;">
		<div class="card-body">
			<h3 class="card-title text-center">Login</h3>
			<?php if ($error): ?>
				<div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
			<?php endif; ?>
			<form method="POST">
				<div class="form-group">
					<label>Username</label>
					<input type="text" name="username" class="form-control" required>
				</div>
				<div class="form-group">
					<label>Password</label>
					<input type="password" name="password" class="form-control" required>
				</div>
				<button class="btn btn-primary btn-block">Login</button>
			</form>
		</div>
	</div>
</div>
</body>
</html>
