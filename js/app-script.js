//const fileInput = document.getElementById('file-input');
const fileInput = $('.form-control-file');
const preview = document.getElementById('preview');
const statusDiv = document.getElementById('status');
const uploadedFilesDiv = document.getElementById('uploaded-files');

$("body").on('change', ".form-control-file", function(event) {
	preview.innerHTML = '';
	Array.from(this.files).forEach(file => {
		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = e => {
				const img = document.createElement('img');
				img.src = e.target.result;
				img.classList.add('preview-img');
				preview.appendChild(img);
			};
			reader.readAsDataURL(file);
		}
	});
});

$('body').on('click', '#add-path', function() {
	const path = $('#sub-path').val();
	if (path) {
		const option = new Option(path, path);
		$('#host-select').append(option);
		$('#sub-path').val('');
	}
});

$('body').on('click', '#save-paths', function() {
	ModalPopup.confirmDangerous(`Are you sure you want to save these paths?`, "Save Paths", "Save").then(confirmation => {
	if (confirmation) {
		saveHosts();
		Toast.success("Hosts saved successfully");				
	}})	
});

$('body').on('click', '#reload-all-path', function (event) {
	ModalPopup.confirmDangerous(`Are you sure you want to reload all paths?`, "Reload Paths", "Reload")
		.then(confirmation => {
			if (confirmation) {
				fetch('api/load-path.php', {
						headers: {
							'Authorization': 'Bearer ' + window.apiToken
						},	
						method: 'POST'})
					.then(res => res.json())
					.then(data => {
						$('#host-select').empty();
						Object.keys(data).forEach(host => {
							const option = new Option(data[host], host);	
							$('#host-select').append(option);
						})					
						Toast.success("Hosts reloaded successfully");
					});
			}
		})
});

//implement the click event for set-root
$('body').on('click', '#set-root', function() {	
	ModalPopup.promptDangerous("Please enter the root path:", $('#host-root').val() ,"Set Root Path?", "Set").then(path => {
	if (path) {
		const regex = /^(\/?[^\/ ]*)+$/;
		if (regex.test(path)) {
			ModalPopup.confirmDangerous(`Are you sure you want to set this path as root?`, "Change Root Dir", "Change").then(confirmation => {
				if(confirmation){
					$('#host-root').val(path);
					saveRootPath();
					Toast.success("Root path set successfully");
				}
			})					
		} else {
			Toast.error("Please select a valid path.");
		}
	} else {
		Toast.error("Please select a valid path.");
	}});	
})


$('body').on('click', '#delete-path', function() {
	$('#host-select option:selected').remove();
});
$('body').on('click', '#clear-all-path', function() {
	$('#host-select').empty();
});

$('body').on('click', '#host-select option', function() {
	$('#sub-path').val($(this).val());
	$('.file-list-of-sub-path').text($(this).val());
	$('.game-alias-info').toggleClass('d-none', !$(this).val().includes('gameAlias'));
	loadUploadedFiles($(this).val());
});

$('body').on('click', '.toggle-previewer', function() {
	preview.classList.toggle('d-none');
	preview.classList.toggle('d-flex');
	$(this).closest('div').find('.icon').toggleClass('fa-caret-down fa-caret-up');
});
$('body').on('click', '.toggle-file-list', function() {
	$('.file-list').toggleClass('d-none');
	$(this).closest('div').find('.icon').toggleClass('fa-chevron-down fa-chevron-up');
});
$('body').on('click', '.toggle-host-selector', function() {
	$('.box-host-path').toggleClass('d-none d-flex');
	$(this).closest('div').find('.icon').toggleClass('fa-chevron-down fa-chevron-up');
	//also list all current selected options in teh select and assign to text-host-summary
	const selectedOptions = $('#host-select')[0].selectedOptions;
	if(selectedOptions.length == 0) {
		selectedText = "No host selected";
	}else {
		selectedText = "• " + Array.from(selectedOptions).map(option => option.value).join(' • ');
	}			
	$('.text-host-summary small').text(selectedText);
	$('.text-host-summary').toggleClass('d-none');
});
$('body').on('click', '.toggle-path-selector', function() {
	$('.box-host-selector').toggleClass('d-none d-flex');
	$(this).closest('div').find('.icon').toggleClass('fa-chevron-down fa-chevron-up');
	//also list all current selected options in teh select and assign to text-host-summary
	const selectedOptions = $('#host-select')[0].selectedOptions;
	if(selectedOptions.length == 0) {
		selectedText = "No host selected";
	}else {
		selectedText = "• " + Array.from(selectedOptions).map(option => option.value).join(' • ');
	}			
	$('.text-host-summary small').text(selectedText);
	$('.text-host-summary').toggleClass('d-none');
});
$('body').on('click', '.hide-path-selector', function() {
	$('.col-path').toggleClass('d-none');
	$('.col-file-list').toggleClass('col-sm-8');
	$(this).closest('div').find('.icon').toggleClass('fa-eye-slash fa-eye');	
	//also list all current selected options in teh select and assign to text-host-summary
	const selectedOptions = $('#host-select')[0].selectedOptions;
	if(selectedOptions.length == 0) {
		selectedText = "No host selected";
	}else {
		selectedText = "• " + Array.from(selectedOptions).map(option => option.value).join(' • ');
	}			
	$('.text-host-summary small').text(selectedText);
	$('.text-host-summary').toggleClass('d-none');
});
$('body').on('click', '.toggle-upload-status', function() {
	statusDiv.classList.toggle('d-none');
	statusDiv.classList.toggle('d-flex');
	$(this).closest('div').find('.icon').toggleClass('fa-caret-up fa-caret-down');
});

$('body').on('click', '.clear-upload-status', function() {
	ModalPopup.confirmDangerous(`Are you sure you want to clear the upload logs?`, "Clear logs", "Clear").then(confirmation => {
			if (confirmation) {
				statusDiv.innerHTML = '';
				Toast.success("Upload status cleared.");				
			}
		})	
});


$('body').on('submit', '#upload-form', function(e) {		
	e.preventDefault();

	if ($('#file-input')[0].files.length == 0 && $('#file-input-2')[0].files.length == 0) {
		ModalPopup.alertDangerous("Please select at least one file to upload.");
		return;
	}
	if ($('#host-select')[0].selectedOptions.length == 0) {
		ModalPopup.alertDangerous("Please select at least one host to upload.");
		return;
	}
	//Check if options does not contain gameAlias
	const selectedOptions = $('#host-select')[0].selectedOptions;
	const hasGameAlias = Array.from(selectedOptions).some(option => option.value.includes('gameAlias'));
	if (hasGameAlias) {
		ModalPopup.alertDangerous("Please make sure to replace `gameAlias` with your actual game alias.");
		return;
	}

	const formData = new FormData(e.target);
	statusDiv.innerHTML = '<p>Uploading...</p>';

	fetch('api/upload.php', {
			headers: {
				'Authorization': 'Bearer ' + window.apiToken
			},
			method: 'POST',
			body: formData
		})
		.then(res => res.json())
		.then(data => {
			statusDiv.innerHTML = '';
			data.forEach(entry => {
				const p = document.createElement('p');
				p.textContent = `File: ${entry.name} to ${entry.host} - ${entry.status}`;
				statusDiv.appendChild(p);
			});
			
			let path = formData.get('sub_path');
			loadUploadedFiles(path);
		});
});

//implement the click event for file-list-go-back
$('body').on('click', '#file-list-go-back', function() {	
	const sub_path = $('#sub-path').val();	
	const parent_path = sub_path.split('/').slice(0, -1).join('/');
	$('#sub-path').val(parent_path);
	$('.file-list-of-sub-path').text(parent_path);
	loadUploadedFiles(parent_path);
});

$('body').on('click', '.file-row', function() {
	const path = $(this).data('path');
	const name = $(this).data('name');
	const type = $(this).data('type');

	if (type == "folder") {
		const sub_path = `${path}/${name}`;
		$('#sub-path').val(sub_path);
		$('.file-list-of-sub-path').text(sub_path);
		loadUploadedFiles(sub_path);
	}
});

$('body').on('click', '.btn-file-list-view', function() {
	const parent = $(this).closest('.file-row')
	let path = parent.data('path');
	let file = parent.data('name');	
	const url = `${HOST_NAME_URL}/${path}/${file}`
	if(isImageFile(url)){
		//const img = document.createElement('img');
		//img.src = url;
		//img.classList.add('preview-img');
		//preview.innerHTML = '';
		//preview.appendChild(img);
		GalleryPreviewer.show(url)
	} else {
		window.open(url, 'preview');
	}
})

function loadUploadedFiles(sub_path = "") {
	fetch('api/files.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + window.apiToken
		},
		body: JSON.stringify({
			host_root: $('#host-root').val(),
			sub_path: sub_path
		})
	}).then(res => res.json()).then(data => {
		uploadedFilesDiv.innerHTML = '';
				
		Object.keys(data).forEach(host => {
			const hostDiv = document.createElement('div');
			hostDiv.classList.add('d-flex', 'flex-column', 'container');
			hostDiv.style.gap = '0.25rem';
			hostDiv.innerHTML = `<div class="font-weight-bold"><i>[${host}]</i></div>`;
			data[host]?.forEach(file => {
				const fileRow = document.createElement('div');
				fileRow.classList.add('file-row', 'd-flex', 'align-items-center', 'justify-content-start', 'pointer');
				fileRow.dataset.path = host;
				fileRow.dataset.name = file.name;
				fileRow.dataset.type = file.type;
				fileRow.innerHTML =
					`<span>${file.name}</span>
					<button type='button' class='btn-file-list-view ml-auto btn btn-sm btn-small btn-primary ${(file.type=="file" && !isCodeFile(file.name))? "":"d-none"}'>
						<i class="fa fa-eye" aria-hidden="true"></i>
					</button>
					<button type='button' class='ml-1 btn btn-sm btn-small btn-danger ${(file.type=="file" && !isCodeFile(file.name))? "":"d-none"}' onclick="deleteFile('${host}', '${file.name}')">
						<i class="fa fa-trash" aria-hidden="true"></i>
					</button>`;
				hostDiv.appendChild(fileRow);
			});
			uploadedFilesDiv.appendChild(hostDiv);
		});
	});
}

function deleteFile(host, file) {
	ModalPopup.confirmDangerous(`Are you sure you want to delete this file <b>${file}</b>?`, "Delete File?", "Delete").then(confirmation => {
		if (confirmation) {
			let sub_path = $('#sub-path').val()
			fetch(`api/delete.php?host=${host}&file=${file}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + window.apiToken
					},
					body: JSON.stringify({
						host_root: $('#host-root').val(),
						sub_path: sub_path
					})
				}).then(res => res.json()).then(data => {
					if(data.status == "error") {
						ModalPopup.alertDangerous(data.message);
						return;
					}
					Toast.success("File deleted successfully.");								
					loadUploadedFiles(sub_path)
				});
		}
	});	
}

function saveHosts() {
	const select = document.getElementById('host-select');
	const selected = Array.from(select.options).map(opt => ({
		value: opt.value,
		text: opt.text
	}));

	fetch('api/save-path.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.apiToken
			},
			body: JSON.stringify(selected)
		})
		.then(res => res.json())
		.then(data => console.log(data))
		.catch(err => console.error('Error:', err));
}

// save root path to server
function saveRootPath() {
	const rootPath = $('#host-root').val();
	fetch('api/save-config.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.apiToken
			},
			body: JSON.stringify({ rootPath })
		})
		.then(res => res.json())
		.catch(err => console.error('Error:', err));
}

//loadUploadedFiles();