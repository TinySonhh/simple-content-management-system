<?php
session_start();
session_destroy();
?>
<head>
	<title>Logging out...</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex, nofollow">
</head>
<script>
	localStorage && localStorage.clear();
	sessionStorage && sessionStorage.clear();
	document.cookie.split(";").forEach(function(c) {
		document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
	});

	setTimeout(function () {
		window.location.href = "login.php";
	}, 1000);
</script>
<?="Redirecting to login page..."?>
