function getQueryValue(param){
	let query = window.location.search;
	query = query.replace("?","");

	let queries = query.split("&");
	try{
		if(queries.length > 0){
			for (let i = 0; i < queries.length; i++) {
				let pair = queries[i].split("=");
				if(pair.length>0){
					if(pair[0]==param){
						return pair[1];
					}
				}
			}				
		}
	}catch{
		console.log("bad...");
	}
	return "";	
}

function setCookie(cname, cvalue, shared = false) {
	var d = new Date();
	d.setTime(d.getTime() + (1 * 365 * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + (shared? ";domain=.hssoftvn.com":"");
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function hasObject(objectSelector){    
    return $(objectSelector).length > 0
}

function showHideObject(objectID, show = true){
	let obj = $(objectID);	

	if(show){
		obj.removeClass("d-none");
		obj.addClass("show");
		if(obj.hasClass("d-flexx")) {
			obj.removeClass("d-flexx")
			obj.addClass("d-flex")
		}
	} else {
		obj.addClass("d-none");
		obj.removeClass("show");
		if(obj.hasClass("d-flex")) {
			obj.removeClass("d-flex")
			obj.addClass("d-flexx")
		}
	}
}
function showObject(objectID){
	showHideObject(objectID, true);
}
function hideObject(objectID){
	showHideObject(objectID, false);
}

function isObjectVisible(objectID){
	let obj = $(objectID);
	return obj.length>0  && (obj.hasClass("show") || obj.hasClass("d-flex") || !obj.hasClass("d-none") );
}

function toggleDisplay(objectID){
	if(isObjectVisible(objectID)){
		showHideObject(objectID, false)
	} else {
		showHideObject(objectID, true);
	}
}

function isObjectVisibleDFlexNone(objectID){
	let obj = $(objectID);
	return obj.length>0 && obj.hasClass("d-flex");
}

function toggleDisplayDFlexNone(objectID){
	let obj = $(objectID);
	if(isObjectVisibleDFlexNone(objectID)){
		obj.addClass("d-none");
		obj.removeClass("d-flex");
	} else {
		obj.removeClass("d-none");
		obj.addClass("d-flex");
	}
}

function isObjectVisibleObj(obj){	
	return obj.length>0 && (obj.hasClass("show") || !obj.hasClass("d-flex") || !obj.hasClass("d-none"));
}
function toggleDisplayObj(obj){
	if(isObjectVisibleObj(obj)){
		obj.addClass("d-none");
		obj.removeClass("show");
	} else {
		obj.removeClass("d-none");
		obj.addClass("show");
	}
}

//elementm tag, id, src
function insertScript(e, t, n, r) {
	var a, i = e.getElementsByTagName(t)[0];
	e.getElementById(n) || ((a = e.createElement(t)).id = n, a.src = r, i.parentNode.insertBefore(a, i))
}

function loadOrderScripts(t, e, d) {
	var n = document.createElement("script");
	n.setAttribute("src", t), n.onload = function () {
		if (void 0 !== e) {
			var t = document.createElement("script");
			t.setAttribute("src", e), t.onload = function () {
				if (void 0 !== d) {
					var t = document.createElement("script");
					t.setAttribute("src", d), t.onload = function () {
						//do something after loaded
					}, document.body.appendChild(t)
				}
			}, document.body.appendChild(t)
		}
	}, document.body.appendChild(n)
}

function localSave(keyname, data){
	if (typeof(Storage) !== "undefined") {
		// Store
		localStorage.setItem(keyname, data);
		
	} else {		
	}
}

function localGet(keyname){
	if (typeof(Storage) !== "undefined") {
		// Store
		return localStorage.getItem(keyname);
	} else {		
		return null;
	}
}

function scrollToCenter (container, elem, speed, offset = 0) {
	var active = jQuery(container).find(elem); // find the active element
	var activeWidth = active.width() / 2; // get active width center
	if(active.length > 0){
		var pos = active.position().left + activeWidth + offset; //get left position of active li + center position
		var elpos = jQuery(container).scrollLeft(); // get current scroll position
		var elW = jQuery(container).width(); //get div width				
		pos = pos + elpos - elW / 2; // for center position if you want adjust then change this

		jQuery(container).animate({
			scrollLeft: pos
		}, speed == undefined ? 1000 : speed);
	}
	
	//return this;
};

function saveClientTimeZone(){
	let ctz = new Date().getTimezoneOffset();
	ctz = ctz == 0 ? 0 : -ctz;

	localSave("ctz", ctz);
}

function getClientTimeZone(){
	return localGet("ctz");
}

function getMyTz() {
	let offset = (new Date()).getTimezoneOffset() / 60;
	let utc = " UTC" + (offset > 0 ? "-" : "+") + Math.abs(offset);
	return utc;
}

function toUtc(localDateTime){
	return new Date(localDateTime + getMyTz()).toGMTString()
}

function toLocaleTime(utcDateTime){
	return new Date(utcDateTime + " utc").toLocaleString()
}

function getLocaleTime(){
	return new Date().toLocaleString()
}

function formatLocaleTime(date){
	return new Date(date).toLocaleString();
}

function toHHMMSSJson(totalSeconds) {
	const totalMinutes = Math.floor(totalSeconds / 60);
  
	const seconds = totalSeconds % 60;
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
  
	return { h: hours, m: minutes, s: seconds };
}

function zeroPad(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}


function toHHMMSS(totalSeconds) {
	const totalMinutes = Math.floor(totalSeconds / 60);
  
	const seconds = totalSeconds % 60;
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	let text=""
	if(hours>0){
		text += zeroPad(hours, 2) + ":"
	}	
	text += zeroPad(minutes, 2) + ":"
	text += zeroPad(seconds, 2)

	return text
}


function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) 
		//|| window.innerWidth <= 768
		|| window.matchMedia("(max-width: 768px)").matches;
}

function isFilePreviewable(filename) {
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico',
		'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'mpeg', 'mpg',
		'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a',
		'txt', 'csv', 'log', 'json'];

	const ext = filename.split('.').pop().toLowerCase();
	return validExtensions.includes(ext);
}

function isImageFile(filename) {
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'];
	const ext = filename.split('.').pop().toLowerCase();
	return validExtensions.includes(ext);
}
function isCodeFile(filename) {
	return false;
	//list all code file extensions
	const validExtensions = ['htaccess', 'webmanifest', 'js', 'css', 'html','xml', 'php', 'java', 'c', 'cpp', 'cs', 'py', 'rb', 'go', 'swift'];	
	const ext = filename.split('.').pop().toLowerCase();
	return validExtensions.includes(ext);
}
