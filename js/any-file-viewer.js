// any-file-viewer.js
(function() {
	const style = document.createElement('style');
	style.innerHTML = `
		#x-preview-box {
			position: fixed;
			top: 0; left: 0; right:0;
			height: 100vh;
			background: rgba(0, 0, 0, 0.85);
			display: none;			
			align-items: start;
			z-index: 9999;
			flex-direction: column;
		}

		#x-preview-content .center-horizontal{
			text-align: center !important;
			width: 100% !important;
		}

		#x-preview-content .center-vertical{
			align-items: center !important;
		}		
		
	`;
	document.head.appendChild(style);

	const htmlDiv = document.createElement('div');
	htmlDiv.innerHTML = `
		<div id="x-preview-box" class="p-2" >
			<div class="d-flex flex-row w-100 my-1 bg-dark px-2 py-1 rounded-top">
				<div class="text mr-2 text-white fw-bold d-2lines">File title goes here</div>
				<button class="btn btn-small btn-danger ml-auto"
					onclick="$('#x-preview-box').css('display','none');
						$('.x-preview-content').html('');
						$('audio, video').each(function(){this.pause();this.currentTime=0;});
					">
					<i class="fa fa-window-close" aria-hidden="true"></i>
				</button>
			</div>
			
			<div id="x-preview-content"
				class="overflow-auto d-flex alert-light text-body rounded border p-1 w-100 h-100"
				style="text-wrap-mode: wrap; text-wrap-style: auto;">
			</div>
		</div>		
	`
	document.body.appendChild(htmlDiv);
	window.ZZZZZZZ = {}
	window.AnyFileViewer = {
		previewFile: function(host_root, sub_path, file) {
			const ext = file.split('.').pop().toLowerCase();
			const url = 'api/preview.php';
			const preview = document.getElementById('x-preview-content');
			$('#x-preview-box').css('display','flex');
			$('#x-preview-box .text').text(`${sub_path}/${file}`);
			preview.innerHTML = '';

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + window.apiToken,
				},
				body: JSON.stringify({
						host_root: host_root,
						sub_path: sub_path,
						file: file
				})
			};

			function handleErrorIfHaving(res){
				if (res.status == 413) {
					Toast.error(`File size is too large. It cannot be larger than 5MB.`);
					return {}
				}
				if (!res.ok || res.status == 401 || res.status == 403 || res.status == 404 || res.status == 500) {
					Toast.error(`Your working session expired, or you are not logged in correctly. Please try to login again.`);		
					return {}
				}
				return res.arrayBuffer()
			}
			
			// list all video extensions as possible

			
			if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'mpeg', 'mpg'].includes(ext)) {				
				fetch(url, options)
					.then(res => handleErrorIfHaving(res))
					.then(data => {				
						const blob = new Blob([data]);
						const url = URL.createObjectURL(blob);		
						preview.innerHTML = `<video class="center-horizontal center-vertical " src="${url}" controls style="max-width:100%"></video>`;
					});
			} else if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext)) {				
				fetch(url, options)
					.then(res => handleErrorIfHaving(res))
					.then(data => {				
						const blob = new Blob([data]);
						const url = URL.createObjectURL(blob);			
						preview.innerHTML = `<audio class="center-horizontal center-vertical mt-5" src="${url}" controls style="max-width:100%"></audio>`;
					});
			} else if (ext === 'pdf') {				
				fetch(url, options)
					.then(res => handleErrorIfHaving(res))
					.then(pdfData => {				
						const blob = new Blob([pdfData], { type: 'application/pdf' });
						const url2 = URL.createObjectURL(blob);		
						preview.innerHTML = `<embed src="${url2}" type="application/pdf" style="width:100%; height: 100vh;">`;
					});
			} else if (['doc', 'docx'].includes(ext)) {
				fetch(url, options)
					.then(res => handleErrorIfHaving(res))
					.then(buffer => {
						window.mammoth.convertToHtml({
								arrayBuffer: buffer
							})
							.then(result => {
								preview.innerHTML = `<div class="p-2">${result.value}</div>`
							});
					});
			} else if (['htaccess', 'webmanifest', 'js', 'css', 'html','xml', 'php', 'java', 'c', 'cpp', 'cs', 'py', 'rb', 'go', 'swift', 'txt', 'json'].includes(ext)) {
				fetch(url, options).then(r => r.text()).then(text => {
					preview.innerHTML = `<textarea readonly spellcheck="false" class="w-100 bg-light small border-0 -rounded p-2" style="height:85vh;">${text}</textarea>`;
				});
			} else {			
				fetch(url, options)
					.then(res => handleErrorIfHaving(res))
					.then(data => {				
						const blob = new Blob([data]);
						const url = URL.createObjectURL(blob);			
						preview.innerHTML = `<p class="center-horizontal center-vertical mt-5">Not supported to preview. <a href="${url}" download="${file}">Please download to see</a></p>`;
					});				
			}			
		}
	}
})();
