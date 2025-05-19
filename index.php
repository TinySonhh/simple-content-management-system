<?php
require 'api/auth.php';
?>
<?php
require_once 'helpers/env.php';
// Include the configuration file
include_once 'api/__config.php';
include_once 'api/utils.php';

// Load the configuration
$configs = loadConfig();
$MY_DIR_ROOT = $configs['rootPath'] ?? MY_DIR_ROOT;

$default_sub_paths = [
	'cdn/products' => 'cdn > products icons',
	'home/img/products' => 'home > img > products icons x*x',
	'home/img/products/posters' => 'home > img > products posters 1024*500',
	'home/img/posts' => 'home > img > posts icons 320*200',
	'home/img' => 'home > img any images & sizes',
	'cdn/play/gameAlias' => 'cdn > play > gameAlias',
	'cdn/play/gameAlias/screenshots' => 'cdn > play > gameAlias > screenshots',
	'cdn/companies' => 'cdn > companies logos & icons',
];

$use_default_sub_paths = $_REQUEST['use_default_sub_paths'] ?? false;
$default_sub_paths = loadAllPaths(__DIR__ . ($use_default_sub_paths ? '/data/default-paths.json' : '/data/paths.json'));
?>
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex, nofollow">

	<title><?=APP_NAME?></title>

	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>
	
	<link rel="stylesheet" href="css/common.css">
	<link rel="stylesheet" href="css/main.css">	
	<link rel="stylesheet" href="css/app.css">
	<script src="js/common.js"></script>
	<script src="js/purify.min.js"></script>
	<script src="js/anti-hacking.js"></script>	
	<script src="js/popup.js"></script>	
	<script src="js/modals.js"></script>			
	<script class="auto-delete">	
		const HOST_NAME_URL = "<?= HOST_NAME_URL ?>";	
		window.apiToken = "<?=$_SESSION['jwt']?? '---' ?>";
		$(".auto-delete").remove();
	</script>	
</head>

<body class="bg-light">
	<div class="container py-2">

		<div class="d-flex justify-content-between align-items-center mb-3">
			<h4 class="my-2 text-center">Multi Host File Uploader</h4>
			<a href="logout.php" class="btn btn-outline-secondary btn-sm">Logout</a>
		</div>

		<form id="upload-form" enctype="multipart/form-data" method="POST">
			<!--SELECT FILES-->
			<label for="file-input" class="mb-1 fw-450 text-violet">① Select Files</label>
			<div class="form-group d-flex flex-column alert-light border rounded p-1 mb-1" style="gap: 0.25rem;">
				<input type="file" class="form-control-file form-control-sm px-1 py-1 mb-1" id="file-input" name="files[]" multiple>
				<input type="file" class="form-control-file form-control-sm px-2 py-1 mb-1 d-none" id="file-input-2" name="files2[]" multiple>
			</div>

			<!--SELECT HOSTS-->
			<div class="d-flex flex-wrap font-weight-normal mt-3  text-violet">
				<label for="host-select" class="toggle-host-selector pointer mb-0">② Select Host(s)</label>
				<span class="toggle-host-selector d-block ml-auto pointer"><i class="icon fa fa-chevron-up" aria-hidden="true"></i></span>
			</div>
			
			<!--HOST SELECTOR-->			
			<div class="alert-light rounded border p-2 mb-2">
				<div class="input-group input-group-sm d-flex flex-row align-items-baseline">
					<label class="-input-group-text input-group-prepend small" for="host-root" style="min-width: 2.5rem;">Root</label>
					<input type="text" class="form-control form-control-sm small" id="host-root" name="host_root" value="<?= $MY_DIR_ROOT ?>"
						readonly>
					<button style="width: 4rem;" class="btn btn-sm btn-warning input-group-append ml-1 d-block" type="button" id="set-root"><i
							class="fa fa-edit" aria-hidden="true"></i> Edit</button>
				</div>
				<div class="input-group input-group-sm">
					<label class="input-group-prepend align-self-center my-0 small" for="sub-path"  style="min-width: 2.5rem;">Path</label>
					<input type="text" class="form-control form-control-sm" id="sub-path" name="sub_path" value=""
						placeholder="Enter sub path">
					<button style="width: 4rem;" class="btn btn-sm btn-outline-violet input-group-append ml-1 d-block" type="button" id="add-path"><i
							class="fa fa-plus" aria-hidden="true"></i> Add</button>
				</div>

				<div class="text-host-summary d-none overflow-scroll mt-2">
					<small class="text-muted"></small>
				</div>
			</div>
			
			<div class="box-host-path row no-gutters d-flex position-relative border rounded">				
				<span class="hide-path-selector float-left pointer my-2 d-none d-sm-block position-absolute"
					title="Toggle the paths list"
					style="z-index: 1;top: 0.25rem;left: 0.25rem;">
					<i class="fa fa-eye-slash" aria-hidden="true"></i>
				</span>
				<div class="col-path col col-12 col-sm-4 rounded alert-light p-1">					
					<div class="d-flex flex-wrap my-2 pl-4 text-violet">
						<span class="toggle-path-selector pointer">③ Paths List</span>
						<span class="toggle-path-selector d-block ml-auto pointer d-sm-none"><i class="icon fa fa-chevron-up" aria-hidden="true"></i></span>						
					</div>
					<!--PATH SELECTOR-->
					<div class="box-host-selector d-flex flex-wrap alert-light rounded border-0 p-1" style="gap: 0.15rem;">				
						<div class="form-group d-flex flex-column border-0 rounded w-100 my-0" style="gap: 0.25rem;">
							<div class="input-group input-group-sm border-0 m-0 d-flex flex-column w-100">
								<select multiple class="form-control form-control-sm rounded py-1 w-100" id="host-select" name="hosts[]" style="min-height: 250px;">
									<?php foreach ($default_sub_paths as $path => $label): ?>
										<option value="<?= $path ?>"><?= $label ?></option>
									<?php endforeach; ?>
								</select>
								<div class="d-flex flex-row w-100 my-1 overflow-auto alert-warning py-1 rounded" style="gap: 0.25rem;">
									<button class="btn btn-small btn-outline-danger input-group-append ml-1 d-block font-weight-normal" type="button"
										id="save-paths"><i class="fa fa-save" aria-hidden="true"></i> Save</button>
									<button class="btn btn-small btn-outline-dark input-group-append ml-auto d-block font-weight-normal" type="button"
										id="delete-path"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</button>
									<button class="btn btn-small btn-outline-dark input-group-append ml-1 d-block font-weight-normal" type="button"
										id="clear-all-path"><i class="fa fa-close" aria-hidden="true"></i> Clear</button>
									<button class="btn btn-small btn-outline-dark input-group-append ml-1 d-block font-weight-normal" type="button"
										id="reload-all-path"><i class="fa fa-refresh" aria-hidden="true"></i> Reload</button>
								</div>
							</div>
							<small class="game-alias-info form-text text-danger mb-2 d-none">Make sure to replace <b>gameAlias</b> as
							yours.</small>
						</div>
					</div>
				</div>

				<div class="col-file-list col col-12 col-sm-8 alert-light rounded border-0 p-1">
					<!--FILES LIST-->
					<div class="d-flex flex-wrap my-2 text-violet pl-4">
						<span class="toggle-file-list pointer ">④ File List of <span class="file-list-of-sub-path mx-2"></span></span>
						<span class="toggle-file-list ml-auto pointer d-sm-none"><i class="icon fa fa-chevron-up"
								aria-hidden="true"></i></span>
					</div>
					<div class="file-list my-1 alert-light rounded border text-dark small flex-column">
						<div class="d-flex action-bar align-items-center justify-content-between w-100 sticky-top" style="gap: 0.25rem;">
							<span class="btn btn-sm btn-small btn-outline-secondary px-2 m-1" id="file-list-go-back"><i class="fa fa-level-up fa-1-25x" aria-hidden="true"></i> ..</span>
						</div>
						<div id="uploaded-files" class="overflow-auto" style="min-height:250px; max-height: 50vh;"></div>
					</div>
				</div>

			</div>


			<!--PREVIEWER-->
			<div class="d-flex flex-wrap mt-3 text-violet">
				<span class="toggle-previewer pointer">⑤ Previewer (images only)</span>
				<span class="toggle-previewer d-block ml-auto pointer"><i class="icon fa fa-caret-down" aria-hidden="true"></i></span>
			</div>
			<div id="preview" class="d-none flex-wrap alert-light rounded border"
				style="min-height:66px; max-height: 72px;"></div>

			<!--UPLOAD STATUS-->
			<div class="box-status">
				<div class="d-flex align-items-center" style="gap: 1rem;">
					<span class="toggle-upload-status font-weight-normal text-violet my-2 pointer"> <i class="fa fa-info-circle" aria-hidden="true"></i> Upload status</span>					
					<span class="clear-upload-status d-block ml-auto pointer text-danger" title="Clear upload info"><i class="fa fa-trash-o" aria-hidden="true"></i></span>					
					<span class="toggle-upload-status d-block pointer text-violet" title="Toggle Status pane"><i class="icon fa fa-caret-up" aria-hidden="true"></i></span>
				</div>
				<div id="status" class="upload-status small d-flex flex-column  alert-light p-1 rounded border" style="min-height: 3rem;"></div>
			</div>

			<button type="submit" class="btn btn-primary mt-3 w-100 position-sticky"
				style="top:unset;bottom:1px;"><i class="fa fa-cloud-upload" aria-hidden="true"></i> Upload</button>
		</form>		

	</div>

	<script src="js/app-script.js"></script>	
	<script src="js/gallery-previewer.js"></script>	
	<script src="js/any-file-viewer.js"></script>	
	<script src="https://unpkg.com/mammoth/mammoth.browser.min.js"></script>
</body>

</html>