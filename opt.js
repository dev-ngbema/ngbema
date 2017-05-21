function optSave() {
	var ngWord = document.getElementById('ngWord').value;
	var isHide = document.getElementById('hideNg').checked;
	chrome.storage.local.set({
		ngWord: ngWord,
		hideNg: hideNg
	}, function() {
	    var status = document.getElementById('status');
	    status.textContent = 'Options saved.';
	    setTimeout(function() {status.textContent = '';}, 750);
	});
}

function optLoad() {
	chrome.storage.local.get({
		ngWord: '',
		hideNg: false
	}, function(items) {
		document.getElementById('ngWord').value = items.ngWord;
		document.getElementById('hideNg').checked = items.hideNg;
	});
}

document.addEventListener('DOMContentLoaded', optLoad);
document.getElementById('save').addEventListener('click', optSave);