var isdebug = false;
if (!isdebug) {
	console = {};
	console.log = function(i){return;};
}

if (typeof chrome === "undefined" || !chrome.extension) {
	var chrome = browser;
}
var isHide = true;
var ngList = [];
var maxCommentCount = 30;

function optLoad() {
	chrome.storage.local.get(function(items) {
		if (items.ngWord) {
			var isHide = items.hideNg;
			var lines = items.ngWord.split(/\n/);
			for (var i = 0; i < lines.length; i++) {
				if (/\S/.test(lines[i])) {
					console.log(lines[i]);
					ngList.push(new RegExp($.trim(lines[i])));
				}
			}
			console.log(ngList);
		}
	});
	return ngList;
}

function isNg(str, ng) {
	for (var j = 0; j < ng.length; j++) {
		if (str.match(ng[j])) {
			return true;
		}
	}
	return false;
}

/**
 * #main > div > main > div > div > div.style__scroller___1TkXI >
 * div.styles__twitter-panel___2xfTL
 */
function hideTwitterPanel() {
	$("div[class *='styles__twitter']").css("display", "none");
	$("div.v3_wH").css("display", "none");
	$("div.v3_wA").css("display", "none");
}

/**
 * 
 */
function hideTablePopUp(){
	$("div[class*='styles__popup___']").parent("div").css("display", "none");
	$("div[class*='styles__tutorial-']").css("display", "none");
	$("div.fJ_fN").css("display", "none");
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	hideTablePopUp();
	hideTwitterPanel();
	if (request.type != "addComment") {
		return;
	}
	var ng = optLoad();
	console.log("recieve addComment");
	
	var commentRoot = $("[class*='styles__comment-list-wrapper___']:first");

	var el = commentRoot.find("p[class*='styles__message___']");
	var l = el.length > maxCommentCount ? maxCommentCount : el.length;
	for (var i = 0; i < el.length; i++) {
		if (i > l) {
			break;
		}
		var e = el.get(i);
		var etxt = e.textContent.toLowerCase();
		if (isNg(etxt,ng)) {
			console.log("NG:"+etxt);
			if (isHide) {
				$(e).attr("hidden", "hidden");
				$(e).siblings("p").attr("hidden", "hidden");
				e.textContent = "NGワード";
			} else {
				e.textContent = "NGワード";
			}
		}
	}
});
