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
 * 
 */
function hidePopUp(isTimeTablePage){
	if (isTimeTablePage) {
		$("img[srcset*=tutorial]").parent().parent().parent().css("display", "none");
	} else {
		$("img[srcset*=tutorial]").parent().parent().css("display", "none");
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request.type);
	hidePopUp(request.type == "timetable");
	if (request.type != "addComment") {
		return;
	}
	var ng = optLoad();
	console.log("recieve addComment");
	
	var commentRoot = $("form").next();

	var el = commentRoot.find("p[class*='xH_fy']");
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
