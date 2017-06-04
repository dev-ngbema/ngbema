console = {};
console.log = function(i){return;};

/*:
 * コメントAjaxコンプリートイベントハンドラ
 * 
 * コメントAjaxの完了を取得しtabへイベントを発行
 *  https://api.abema.io/v1/slots/9JUxY4DtA1im9y/comments?limit=100
 */
chrome.webRequest.onCompleted.addListener(
	function (details){
		if (details.url.indexOf("/comments") == -1){
			return;
		}
		console.log("load comment");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			if (tabs.length>0) {
			    chrome.tabs.sendMessage(tabs[0].id, {type: "addComment"});  
			}
		});
	},
	{urls: [ "https://api.abema.io/*" ]},
	["responseHeaders"]
);
