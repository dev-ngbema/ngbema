var isdebug = false;
if (!isdebug) {
	console = {};
	console.log = function(i) {
		return;
	};
}
// 番組表ポップアップURL
var urlDailyHighlightPopups = "https://api.abema.io/v1/dailyHighlightPopups";
// 各Pageで表示時に呼ばれるUrl
var urlOnShow = "https://api.abema.io/v1/tracks/mine";
// コメントURL(中にキーが入っているので切り出し)
var urlComment = "/comments?";

/**
 * コンテンツスクリプトへのメッセージ送信
 * 
 * @param data
 * @returns
 */
function sendMessage(data) {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		if (tabs.length > 0) {
			chrome.tabs.sendMessage(tabs[0].id, data);
		}
	});
}
/*
 * : webRequestコンプリートイベントハンドラ
 * 
 * Ajaxの完了を取得しtabへイベントを発行
 * https://api.abema.io/v1/slots/9JUxY4DtA1im9y/comments?limit=100 
 * https://api.abema.io/v1/tracks/mine
 * 
 */
chrome.webRequest.onCompleted.addListener(function(details) {
	if (details.url.indexOf(urlOnShow) != -1) {
		sendMessage({
			type : "pageShow"
		});
	}
	if (details.url.indexOf(urlComment) != -1) {
		console.log("load comment");
		sendMessage({
			type : "addComment"
		});
	}
}, {
	urls : [ "https://api.abema.io/*" ]
}, [ "responseHeaders" ]);

/*
 * : webRequestビフォアイベントハンドラ
 * 
 * Ajaxの送信前にハンドリングし、ポップアップ停止
 * https://api.abema.io/v1/dailyHighlightPopups?userType=2&withDataSet=true
 */
chrome.webRequest.onBeforeRequest.addListener(function(details) {
	var c = false;
	c = c || details.url.indexOf(urlDailyHighlightPopups) != -1;
	if (!c) {
		console.log(details.url);
	}
	return {
		cancel : c
	};
}, {
	urls : [ "https://api.abema.io/*" ]
}, [ "blocking" ]);
