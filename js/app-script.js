//const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const fileInput = $('.form-control-file');
const theSimplePreviewer = document.getElementById('theSimplePreviewer');
const statusDiv = document.getElementById('status');
const uploadedFilesDiv = document.getElementById('uploaded-files');

const myDivider = document.querySelector('.my-divider');
const boxHostPath = document.querySelector('.box-host-path');
const colPath = document.querySelector('.col-path');
const colFilelist = document.querySelector('.col-file-list');

let isDividerDragging = false;
myDivider.addEventListener('mousedown', function (e) {
	isDividerDragging = true;
	document.body.style.cursor = 'col-resize';
});

document.addEventListener('mousemove', function (e) {
      if (!isDividerDragging) return;

	  console.log("Dragging divider");

      const containerRect = boxHostPath.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;

      // Giới hạn min width
      const min = 50;
      const max = boxHostPath.offsetWidth - min;
      if (newWidth < min) newWidth = min;
      if (newWidth > max) newWidth = max;

      colPath.style.width = newWidth + 'px';
    });

document.addEventListener('mouseup', function () {
	isDividerDragging = false;
	document.body.style.cursor = 'default';
});

$("body").on('change', ".form-control-file", function(event) {
	theSimplePreviewer.innerHTML = '';
	toggleTheSimplePreviewer(forceShow=true);
	Array.from(this.files).forEach(file => {
		const li = document.createElement("div");
		li.classList.add(...'preview-item d-flex align-items-center'.split(/\s+/));
		li.classList.add(...'border-bottom -rounded p-1 small pointer'.split(/\s+/));
		li.style.padding = '0.05rem';
		li.setAttribute('data-fullPath', file.webkitRelativePath || file.name);
    	li.innerHTML = `<span class='pl-2'>${file.name}</span>`;
    	li.innerHTML += `<span class='remove-file-item ml-auto text-danger py-1 pl-2'><i class="fa fa-trash" aria-hidden="true"></i></span>`;
		theSimplePreviewer.appendChild(li);
	});
});

function getFileMapOf(files=[]){
	const fileMap = {};
	Array.from(files || []).forEach(file => {
		const fullPath = file.webkitRelativePath || file.name;
		fileMap[fullPath] = file;
	});
	return fileMap;
}

//FolderUploader is a global object that is defined in folder-uploader.js
//use for-in loop to iterate over files in fileMap
function removeFromUploadFileList(fileInputElement, targetNameOrPath) {
  const dt = new DataTransfer();

  Array.from(fileInputElement.files).forEach(file => {
    const fullPath = file.webkitRelativePath || file.name;
    if (fullPath !== targetNameOrPath) {
      dt.items.add(file); // giữ lại file
    }
  });

  fileInputElement.files = dt.files;
}

$('body').on('click', '#theSimplePreviewer .preview-item', function(event) {
	event.stopPropagation(); // Prevent the click event from bubbling up
	const fileEl = this;
	const fullPath = fileEl.getAttribute('data-fullPath');
	// Call the preview function with the full path
	let fileMap = getFileMapOf($('#file-input')[0].files);
	AnyFileViewer.previewUploadFile(fullPath, fileMap);
});
$('body').on('click', '#theSimplePreviewer .preview-item .remove-file-item', function(event) {
	event.stopPropagation(); // Prevent the click event from bubbling up
	// Remove the file item from the preview list
	const fileEl = this.closest('.preview-item');
	if (!fileEl) return; // Ensure fileEl is defined
	const fullPath = fileEl.getAttribute('data-fullPath');

	ModalPopup.confirmDangerous(`Are you sure you want to remove this file <b>${fullPath}</b> from the upload list?`, "Remove File?", "Remove").then(confirmation => {
	if (!confirmation) return; // If user cancels, do nothing
		// Remove the file from the input
		removeFromUploadFileList($('#file-input')[0], fullPath);
		// Remove the file item from the preview list
		fileEl.remove();
		if (theSimplePreviewer.children.length === 0) {
			toggleTheSimplePreviewer();
		}
		Toast.success("File removed from upload list.");
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
					.then(res => handleFetchError(res))
					.then(data => {
						$('#host-select').empty();
						Object.keys(data).forEach(host => {
							const option = new Option(data[host], host);	
							$('#host-select').append(option);
						})					
						Object.keys(data).length>0 && Toast.success("Hosts reloaded successfully");
					})
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
	const selectedOptions = $('#host-select')[0].selectedOptions;
	FolderUploader.setHostAndPath($('#host-root').val(), selectedOptions[0]?.value || '');
	//$('#host-select')[0].selectedOptions;
});

function toggleTheSimplePreviewer(forceShow=false) {
	if (theSimplePreviewer.classList.contains('d-none') || forceShow) {
		theSimplePreviewer.classList.remove('d-none');
		theSimplePreviewer.classList.add('d-flex');
	} else {
		theSimplePreviewer.classList.remove('d-flex');
		theSimplePreviewer.classList.add('d-none');
	}
	$('.toggle-previewer').closest('div').find('.icon').toggleClass('fa-caret-down fa-caret-up');
}
$('body').on('click', '.toggle-previewer', function() {
	toggleTheSimplePreviewer();
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
$('body').on('click', '.toggle-folder-uploader-selector', function() {
	$('#folder-upload-box').toggleClass('d-none d-flex');
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
	$('.col-file-list').toggleClass('col-sm-6');
	$(this).find('.icon').toggleClass('fa-eye-slash fa-eye');	
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
$('body').on('click', '.hide-filelist-selector', function() {
	$('.col-path').toggleClass('col-sm-6');
	$('.col-file-list').toggleClass('d-none');
	$(this).find('.icon').toggleClass('fa-eye-slash fa-eye');	
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

$('body').on('keydown', '#upload-form #sub-path', function(e) {  
	if(e.key === 'Enter') {
		$('#add-path').click()
	}
});
$('body').on('keydown', '#upload-form', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
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
	onUploadStarted()

	fetch('api/upload.php', {
			headers: {
				'Authorization': 'Bearer ' + window.apiToken
			},
			method: 'POST',
			body: formData
		})
		.then(res => handleFetchError(res))
		.then(data => {
			onUploadCompted(formData, data)
		});
});

function onUploadStarted(){
	statusDiv.innerHTML = '<p>Uploading...</p>';
}
function onUploadCompted(formData, result={}){
	//statusDiv.innerHTML = '';
	result.forEach(entry => {
		const p = document.createElement('p');
		p.textContent = `File: ${entry.name} to ${entry.host} - ${entry.status}`;
		statusDiv.appendChild(p);
	});
	
	let path = formData.get('sub_path');
	loadUploadedFiles(path);
}

FolderUploader.initialize('#folder-upload-box', onUploadStarted, onUploadCompted );
FolderUploader.show();

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
		const sub_path = `${path}/${name}`.replace(/^(\/*\s*)*/g, '');
		$('#sub-path').val(sub_path);
		$('.file-list-of-sub-path').text(sub_path);
		loadUploadedFiles(sub_path);
	}
});

$('body').on('click', '.btn-file-list-view', function() {
	const parent = $(this).closest('.file-row')
	let path = parent.data('path');
	let file = parent.data('name');	
	const url_path = `${HOST_NAME_URL}/${path}`
	const url = `${url_path}/${file}`	
	const moreItems = parent.parent().find('.file-previewable');
	let allPreviewable = [];
	if (moreItems.length > 0) {
		moreItems.each(function() {
			allPreviewable.push(url_path + "/" + $(this).data('name'));
		});
	}
	
	if(isImageFile(url)){
		GalleryPreviewer.show(allPreviewable, allPreviewable.indexOf(url));
	} else {
		AnyFileViewer.previewFile($('#host-root').val(), path, file)	
	}
})

function handleFetchError(res) {
	if (!res.ok || res.status == 401 || res.status == 403 || res.status == 404 || res.status == 500) {
		ModalPopup.alertDangerous(`Your working session expired, or you are not logged in correctly. Please try to login again.`);		
		return {}
	}
	return res.json()
}


function middleTruncate(text, maxLength=30) {
  if (text.length <= maxLength) return text;
  const keep = maxLength - 3;
  const front = Math.ceil(keep / 2);
  const back = Math.floor(keep / 2);
  return text.slice(0, front) + '...' + text.slice(text.length - back);
}

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
	}).then(res => handleFetchError(res)).then(data => {
		uploadedFilesDiv.innerHTML = '';
				
		Object.keys(data).forEach(host => {
			const hostDiv = document.createElement('div');
			hostDiv.classList.add('d-flex', 'flex-column', 'container');
			hostDiv.style.gap = '0.25rem';
			$('#selected-path').text(middleTruncate(`📁 ${host}`));
			$('#selected-path').attr('title', `📁 ${host}`);
			hostDiv.innerHTML = ``;
			data[host]?.forEach(file => {
				const fileRow = document.createElement('div');
				fileRow.classList.add('file-row', 'd-flex', 'align-items-center', 'justify-content-start', 'pointer');
				if(file.type == "file" && isFilePreviewable(file.name)){
					fileRow.classList.add('file-previewable');
				}
				fileRow.dataset.path = host;
				fileRow.dataset.name = file.name;
				fileRow.dataset.type = file.type;
				fileRow.innerHTML =
					`<span class='name ${file.type}'>${file.name}</span>
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
	})
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
		.then(res => handleFetchError(res))
		.then(data => {})
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
		.then(res => handleFetchError(res))
		.catch(err => console.error('Error:', err));
}

//loadUploadedFiles();