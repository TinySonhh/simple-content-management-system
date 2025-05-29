//folder-uploader.js
(function() {
	checkLibsStatus(['ModalPopup', 'Toast']);	
	if (window.FolderUploader) return; // Prevent multiple initializations
	const style = document.createElement('style');
	style.innerHTML = `
		#x-folder-uploader ul {
			list-style-type: none;
			font-family: monospace;
		}

		#x-folder-uploader li::before {
			content: "📁 ";
		}

		#x-folder-uploader li.file::before {
			content: "📄 ";
		}

		#x-folder-uploader .file:hover {
			text-decoration: underline;
			cursor: pointer;
		}

		#x-folder-uploader ul {
			transition: all 0.3s ease;
			padding: 0.25rem 1rem;
			margin: 0;
		}

		#x-folder-uploader li.hidden {
			display: none !important;
		}
	`;

	const htmlDiv = document.createElement('div');
		//Set tabindex to 0 to make it focusable and to be able to use the keyboard	
		htmlDiv.setAttribute('id', 'x-folder-uploader');
		htmlDiv.setAttribute('class', 'd-none');
		htmlDiv.setAttribute('tabIndex', '0');		
		htmlDiv.innerHTML = `
		<div class="fw-bold d-flex flex-row justify-content-between align-items-center">
			<span class="x-title d-none"> Upload Manager</span>
			<button id="btnSelectFolderX" type="button" class="btn btn-sm btn-light border">Select folder...</button>
			<span id="x-upload-selected-folder" class="text-truncate text-bold ml-auto">[no-folder]</span>
		</div>
		<div class="d-flex flex-row align-items-baseline pr-2">			
			<input type="file" id="x-folderInput" webkitdirectory multiple hidden>
		</div>
		<div id="treeContainer" class="overflow-auto small tree -bg-light text-dark rounded border my-1 p-2"
			style="max-height: 20vh; min-height: 10vh;"></div>
		
		
		<div class="d-flex flex-row align-items-center justify-content-start">
			<button id="btn-x-submit-folder-upload" type="button" class="btn btn-sm btn-primary mr-auto">Upload</button>	
			Search <input type="text" id="x-folder-uploader-searchBox" class="form-control small text-right ml-2 w-50"
				style="height: 2rem; max-width: 50vw;"
				placeholder="for file name... 🔍 ">
		</div>		
		`;

	window.FolderUploader = {
		parentContainerId: null,	
		treeContainer : document.getElementById("treeContainer"),
		folderInput : document.getElementById("x-folderInput"),
		xUploadSelectedFolder : document.getElementById("x-upload-selected-folder"),
		fileMap : {},
		btnXUploadFolder : document.getElementById("btn-x-submit-folder-upload"),
		host_root: "",
		sub_path: "",

		// Collects all files from the selected folder and its subfolders				
		flatFiles : [],
		collectFilesFromFolder(fileMap=[]) {
			const flatFiles = this.flatFiles;

			Object.keys(flatFiles).forEach(k => delete flatFiles[k]); // reset
			for (const [path, fileOrData] of Object.entries(fileMap)) {
				if (fileOrData instanceof File) {
					flatFiles.push({ file: fileOrData, relativePath: path });
				}
			}
		},

		setHostAndPath(host_root="", sub_path="") {
			this.host_root = host_root;
			this.sub_path = sub_path;
		},

		initialize(parentId, cbStarted, cbDone){			
			this.parentContainerId = parentId;			

			if(!this.parentContainerId){
				throw new Error("Parent container ID is not set.");
			}
			if($(this.parentContainerId).length == 0){			
				throw new Error("Parent container not found.");
			}
			document.head.appendChild(style);
			$(parentId).append(htmlDiv);

			this.treeContainer = document.getElementById("treeContainer")
			this.folderInput = document.getElementById("x-folderInput")
			this.xUploadSelectedFolder = document.getElementById("x-upload-selected-folder")
			this.btnXUploadFolder = document.getElementById("btn-x-submit-folder-upload")
			
			const self = this;
			$("#btnSelectFolderX").on("click", () => {
				if (window.showDirectoryPicker) {
					self.xUploadSelectedFolder.innerText = ""
					self.selectAllFilesFolderWithFSAPI((data)=> {
						self.xUploadSelectedFolder.innerText = data.parent;
					});
				} else {
					self.folderInput.click();
				}
			});

			$(this.btnXUploadFolder).on('click', (event) => {
				event.preventDefault(); // Prevent the default form submission
				this.uploadMultiple(this.host_root, this.sub_path, cbStarted, cbDone);
			});

			// Select folder using <input type="file" webkitdirectory>
			$(this.folderInput).on("change", () => {			
				const files = this.folderInput.files;
				
				const tree = {};
				Object.keys(this.fileMap).forEach(k => delete this.fileMap[k]); // reset

				for (const file of files) {
					const pathParts = file.webkitRelativePath.split('/');
					let current = tree;
					pathParts.forEach((part, index) => {
						if (index === pathParts.length - 1) {
							current[part] = file;
							//remove the root folder name inside the wekitRelativePath
							let tempArr = file.webkitRelativePath.split('/'); tempArr.shift()
							let newPath = tempArr.join('/')
							this.fileMap[newPath] = file;
						} else {
							//remove the root folder name
							if(index > 0){
								current[part] = current[part] || {};
								current = current[part];
							}
						}
					});
				}
				
				for (let key in tree){
					this.xUploadSelectedFolder.innerText = key;
					break
				}
				
				const cleanTree = tree;
				this.treeContainer.innerHTML = this.renderTree(cleanTree, '');
			});			
			``
			$('body').on('click', '#x-folder-uploader .file', function(event) {
				event.stopPropagation(); // Prevent the click event from bubbling up
				const fileEl = event.currentTarget;
				const fullPath = fileEl.getAttribute('data-fullPath');
				// Call the preview function with the full path
				self.previewLocalFile(fullPath);
			});

			$('body').on('click', '#x-folder-uploader .file .remove-file-item', function(event) {
				event.stopPropagation(); // Prevent the click event from bubbling up
				// Remove the file item from the preview list
				const fileEl = this.closest('.file');
				if (!fileEl) return; // Ensure fileEl is defined
				const fullPath = fileEl.getAttribute('data-fullPath');

				ModalPopup.confirmDangerous(`Are you sure you want to remove this file <b>${fullPath}</b> from the upload list?`, "Remove File?", "Remove").then(confirmation => {
				if (!confirmation) return; // If user cancels, do nothing
					// Remove the file from the fileMap
					self.removeFromUploadFileMap(fullPath);
					// Remove the file element from the DOM
					fileEl.remove();
					// Optionally, update the UI or notify the user
					Toast.success(`File <b>${fullPath}</b> removed from upload list.`);					
				});
				
			});

			$('#x-folder-uploader-searchBox').on('input', (event) => {
				const _this = event.target;
				const keyword = _this.value.trim().toLowerCase();
				const files = this.treeContainer.querySelectorAll('li.file');

				files.forEach(fileEl => {
					const name = fileEl.textContent.toLowerCase();
					fileEl.style.display = name.includes(keyword) ? '' : 'none';
					fileEl.innerHTML = this.highlightKeyword(fileEl.getAttribute('data-name'), keyword);
				});

				// Ẩn/hiện folder theo file con
				const folders = this.treeContainer.querySelectorAll('li:not(.file)');
				folders.forEach(folderEl => {
					const subItems = folderEl.querySelectorAll('li');
					const hasVisibleChild = Array.from(subItems).some(item => item.style.display !== 'none');
					//folderEl.style.display = hasVisibleChild ? '' : 'none';
					if (hasVisibleChild) {
						folderEl.classList.remove('hidden');
					} else {
						folderEl.classList.add('hidden');
					}
				});
			})

		},

		show: function() {
			$('#x-folder-uploader').removeClass('d-none');
		},

		hide: function() {
			$('#x-folder-uploader').addClass('d-none');
		},

		renderTree(node, path) {
			let html = '<ul>';
			for (const key in node) {
				const fullPath = path ? `${path}/${key}` : key;
				if (node[key] instanceof File) {
					//html += `<li class="file" onclick="previewLocalFile('${fullPath}')">${key}</li>`;
					html += `<li class="file d-flex border-bottom mt-1 py-1" data-fullPath="${fullPath}" data-name="${key}">`
					html += `	${key} `
					html += `	<span class='remove-file-item ml-auto text-danger pl-2'><i class="fa fa-trash" aria-hidden="true"></i></span>`
					html += `</li>`;
				} else {
					html += `<li>${key}${this.renderTree(node[key], fullPath)}</li>`;
				}
			}
			html += '</ul>';
			return html;
		},

		// File System Access API 
		async selectAllFilesFolderWithFSAPI (cbOnDone) {
			if (!window.showDirectoryPicker) {
				this.folderInput.click();
				return;
			}

			const fileMap = this.fileMap;

			Object.keys(fileMap).forEach(k => delete fileMap[k]); // reset
			const dirHandle = await showDirectoryPicker();
			cbOnDone && cbOnDone({parent: dirHandle.name});

			async function readDir(handle, path = '') {
				const current = {};
				for await (const [name, entry] of handle.entries()) {
					const fullPath = path ? `${path}/${name}` : name;
					if (entry.kind === 'file') {
						const file = await entry.getFile();
						current[name] = file;
						fileMap[fullPath] = file;
					} else if (entry.kind === 'directory') {
						current[name] = await readDir(entry, fullPath);
					}
				}
				return current;
			}

			const fullTree = await readDir(dirHandle);
			this.treeContainer.innerHTML = this.renderTree(fullTree, '');
		},
	
		uploadMultiple(host_root="", sub_path="", cbStarted, cbDone) {
			function handleFetchErrorForUpload(res) {	
				if (!res.ok || res.status == 401 || res.status == 403 || res.status == 404 || res.status == 500) {
					if(res.status == 400){
						ModalPopup.alertDangerous("Please select at least one host to upload.");
					} else {
						ModalPopup.alertDangerous(`Your working session expired, or you are not logged in correctly. Please try to login again.`);		
					}
					return {}
				}
				return res.json()
			}
			
			cbStarted && cbStarted()

			// Collect files from the fileMap
			this.flatFiles.length = 0; // reset
			const flatFiles = this.flatFiles;
			const fileMap = this.fileMap;
			
			this.collectFilesFromFolder(fileMap);			

			// Create a FormData object to hold the files
			const formData = new FormData();
			flatFiles.forEach(fileObj => {				
				formData.append('files[]', fileObj.file);
				formData.append('paths[]', fileObj.relativePath);
			});			
			formData.append('host_root', host_root);
			formData.append('sub_path', sub_path);

			// Send the FormData object using fetch
			let apiToken = window.apiToken || localStorage.getItem('apiToken');
			fetch("/api/upload-multi.php", {
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + apiToken
				},
				body: formData
			})
			.then(response => handleFetchErrorForUpload(response))
			.then(data => {
				// case of error and no data
				if(Object.keys(data).length == 0 || data.error || data.status=="error"){
					return
				}
				
				if (data.error) {
					Toast.error(data.error);
					return;
				}

				Toast.success(`Upload successful!`);
				cbDone && cbDone(formData, data)				
			})
			.catch(error => {
				Toast.error('Upload error:', error);
				cbDone && cbDone(formData, {})
			});
		},

		// Search for files by name, highlight keyword, and hide folders without visible files	
		highlightKeyword(text, keyword) {
			if (!keyword) return text;
			const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
		},

		// Preview file
		async previewLocalFile (path) {
			AnyFileViewer.previewUploadFile(path, this.fileMap)
			return
		},

		//use for-in loop to iterate over files in fileMap
		async removeFromUploadFileMap(targetNameOrPath) {
			for (let key in this.fileMap){
				if (!this.fileMap.hasOwnProperty(key)) continue; // skip inherited properties
				if (key === targetNameOrPath) {
					this.fileMap[key] = null; // remove the file from the map
					delete this.fileMap[key]; // delete the key from the map
				}
			}
		}
	}	
})();