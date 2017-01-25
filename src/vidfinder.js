(function () {

	var linklists = [{
			name : 'HTML5 Video Sources',
			links : getSourcesByTagName('video')
		}, {
			name : 'Absolute Links',
			links : getMatches(/((http|https|ftp):)?\/\/[^\s"']+?\.(mp4|flv|webm|avi|mpg|mpeg|wmv)(\?[^\s"']+)?/g)
		}, {
			name : 'Absolute Encoded Links Decoded',
			links : getMatches(/((http|https|ftp)%3A)?%2F%2F[^\s"']+?\.(mp4|flv|webm|avi|mpg|mpeg|wmv)(\?[^\s"']+)?/g),
			decode : true
		}, {
			name : 'Relative Links',
			links : getMatches(/(\/[^\s"]{1,2000}|[^\s"'\/]{1,2000})\.(mp4|flv|webm|avi|mpg|mpeg|wmv)(\?[^\s"']+)?/g)
		}, {
			name : 'IFrame Sources',
			links : getSourcesByTagName('iframe')
		},
	];
	
	linklists = removeDuplicateLinks(linklists);

	var content = '';
	content = appendLinkLists(content, linklists);
	
	// No links found
	if (content === '') {
		content = 'No video links found. There is no video or the site is using a more sophisticated/encapsulated technique.';
	};
	
	// Display Content
	createDiv('Possible Video Files', content);

	// Special Subfunctions
	
	function removeDuplicateLinks(linklists){
		var alllinks = [];
		var links;
		var newlinks;
		var link;
		for(var i = 0; i < linklists.length; i++){
			newlinks = [];
			links = linklists[i].links;
			if(linklists[i].decode){
				links = decodeLinkList(links);
			};			
			for(var j = 0; j < links.length; j++){
				link = getAbsoluteUrl(links[j]);
				if (!alllinks.includes(link)){
					alllinks.push(link);
					newlinks.push(link);
				}
			};
			linklists[i].links = newlinks;
		};
		return linklists;
	};
	
	function appendLinkLists(content, linklists) {
		var links;
		for (var i = 0; i < linklists.length; i++) {
			links = linklists[i].links;
			if (links.length > 0) {
				content = content + linklists[i].name + ':<br><br>';
				content = appendLinks(content, links);
				content = content + '<br>';
			};
		};
		return content;
	};
	
	function decodeLinkList(links) {
		var link;
		var array = [];
		var r = /((http|https|ftp):)?\/\/[^\s"']+?\.(mp4|flv|webm|avi|mpg|mpeg|wmv)(\?[^\s"']+)?/;
		for (var i = 0; i < links.length; i++) {
			link = decodeURIComponent(links[i]);
			if (r.exec(link)) {
				array.push(link);
			}
		};
		return array;
	};

	function getSourcesByTagName(tagName) {
		var elements = document.getElementsByTagName(tagName);
		var array = [];
		var src;
		var cleanSrc;
		for (var i = 0; i < elements.length; i++) {
			src = elements[i].src.trim();
			cleanSrc = src.split(' ').join();
			if ((src !== '') && (cleanSrc !== 'about:blank')) {
				array.push(elements[i].src);
			}
		};
		return array;
	};

	function appendLinks(content, links) {
		var linkstyle = 'all:initial;font-family:Arial;font-size:14px;color:blue;';
		for (var i = 0; i < links.length; i++) {
			content = content + '<div style="display:block;padding-bottom:8px;"><a href="' + links[i] + '" style="' + linkstyle + '">' + links[i] + '</a></div>';
		};
		return content;
	};

	function getMatches(r) {
		var s = document.body.outerHTML;
		var m;
		var array = [];
		do {
			m = r.exec(s);
			if (m) {
				if (!array.includes(m[0])) {
					array.push(m[0]);
				}
			}
		} while (m);

		return array;
	};

	// Common Subfunctions

	function createDiv(title, content, isText) {
		// Top div
		var style = 'all:initial;position:fixed;left:10px;top:10px;bottom:10px;right:10px;padding:0px;z-index:9999999999998;background:#FFFFFF;border:solid 1px #222;color:#222;font-family:Arial;font-size:14px';
		var div = document.createElement('div');
		div.setAttribute('style', style);

		// Title
		style = 'display:block;font-size:16px;max-height:30px;font-weight:bold;padding:5px 10px 5px 10px;border-bottom:solid 1px #222';
		var divTitle = document.createElement('div');
		divTitle.setAttribute('style', style);
		divTitle.innerHTML = title;

		// Content
		style = 'position:absolute;top:31px;left:0px;right:0px;bottom:0px;display:block;padding:5px 10px 5px 10px;overflow:auto;';
		var divContent = document.createElement('div');
		divContent.setAttribute('style', style);
		if (isText) {
			content = content.split('<').join('&lt;');
			content = content.split('>').join('&gt;');
		};
		divContent.innerHTML = content;

		// Close button
		style = 'all:initial;font-family:Arial;font-size:30px;position:absolute;right:10px;top:-5px';
		var divClose = document.createElement('a');
		divClose.setAttribute('style', style);
		divClose.setAttribute('href', '#');
		divClose.onclick = function () {
			div.parentNode.removeChild(div);
			return false
		};
		divClose.innerHTML = '&times;';

		// Append everything to document
		document.body.appendChild(div);
		div.appendChild(divTitle);
		div.appendChild(divClose);
		div.appendChild(divContent);
	};
	
	function getAbsoluteUrl(url) {
		var a = document.createElement('a');
		a.href = url;
		return a.href;
	};

})();
