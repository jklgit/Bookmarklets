// Special settings: These settings are in the bookmarklet itself. Uncomment for development.
var watchingSankakuUsers = [];
var discordStandard = false;

(function () {

	(function main() {

		// Sites and their buttons
		var sites = [{
				regexp: /^https:\/\/(chan|idol)\.sankakucomplex\.com\/post\/show\/.+$/,
				object: getSankakucomplexObject,
				buttons: [{
						name: 'Copy link',
						content: '%link%'
					}, {
						name: 'Copy post info + watched users',
						content: '%characterline%%artistline%>%scoretag%%favstag%%commentstag%%favbytag%\n> %user% | %r% | %size%%is_animated%%has_audio% | %date%\n%link%\n',
						condition: function () {
							return (watchingSankakuUsers.length > 0);
						},
					}, {
						name: 'Copy post info',
						content: '%characterline%%artistline%>%scoretag%%favstag%%commentstag%\n> %user% | %r% | %size%%is_animated%%has_audio% | %date%\n%link%\n',
					}
				]
			}, {
				regexp: /^https:\/\/(www\.)?youtube\.com\/watch\?.+$/,
				object: getYoutubeObject,
				settings: {
					'Clean link': true,
					'Include current time': false,
				},
				buttons: [{
						name: 'Copy link',
						content: '%youtubelink%'
					}, {
						name: 'Copy video info',
						content: '> %youtubetitle%\n> %viewsmin% | %likespercent% | %currenttime%%duration%\n%youtubelink%\n'
					}
				]
			}, {
				regexp: /^http:\/\/www\.imdb\.com\/title\/tt\d+\/.*$/,
				object: getImdbObject,
				buttons: [{
						name: 'Copy link',
						content: '%link%'
					}, {
						name: 'Copy movie info',
						content: '> %movietitle%\n> %duration% | %genre%%ratingtag%%myratingtag%\n%summaryline%%link%\n',
						settings: {
							'Include summary': true
						}
					}
				]
			}, {
				regexp: /^https:\/\/myanimelist\.net\/anime\/\d+\/.*$/,
				object: getMyanimelistObject,
				buttons: [{
						name: 'Copy link',
						content: '%link%'
					}, {
						name: 'Copy anime info',
						content: '> %movietitle%\n> %genre%\n> %episodes% Eps. %ratingtag%%myratingtag%\n%summaryline%%link%\n',
						settings: {
							'Include summary': false
						}
					}
				]
			}, {
				regexp: /^https:\/\/(www\.)?amazon\.(de|com|ca)\/.*\/.*\/.*$/,
				object: getAmazonObject,
				settings: {
					'Clean link': true,
				},
				buttons: [{
						name: 'Copy link',
						content: '%amazonlink%'
					}, {
						name: 'Copy product info',
						content: '> %productname%\n> [ %price% ] [ %availability% ]%ratingtag%\n%amazonlink%\n',
					}
				]
			}, {
				regexp: /^https:\/\/.{2,3}\.wikipedia\.org\/wiki\/.+$/,
				object: getWikipediaObject,
				buttons: [{
						name: 'Copy link',
						content: '%link%'
					}, {
						name: 'Copy article + link',
						content: '> %wikititle%\n%firstsentence%%link%\n',
					}
				]
			}
		];

		var defaultSite = {
			buttons: [{
					name: 'Copy link',
					content: '%link%'
				}, {
					name: 'Copy title + link',
					content: '> %title%\n%link%\n'
				}
			]
		};

		// Check for sites
		var link = document.location.href;
		var siteFound = false;
		for (var i = 0; i < sites.length; i++) {
			// If site matches link
			if (sites[i].regexp.exec(link)) {
				createButtons(sites[i]);
				siteFound = true;
			}
		};
		if (!siteFound) {
			createButtons(defaultSite);
		};

	})();

	// Essential function
	function createButtons(site) {

		// Create div with all buttons and checkboxes and return them
		var div;
		var buttons = [];
		var buttonsDiscord = [];
		var buttonCheckboxes = [];
		var checkboxes = {};
		(function () {
			// Top div
			var style = 'all:initial;position:fixed;left:0px;top:0px;right:0px;padding:0px;z-index:9999999999998;background:#FFFFFF;color:#222;font-family:Arial;font-size:14px;border-bottom:1px solid #222';
			div = document.createElement('div');
			div.setAttribute('style', style);
			document.body.appendChild(div);

			// Add buttons
			for (var i = 0; i < site.buttons.length; i++) {

				var b_createButton = true;
				if (site.buttons[i].condition) { // If condition for button is defined
					b_createButton = site.buttons[i].condition();
				};

				if (b_createButton) {

					// Div for every button, where button and local settings with checkboxes are in
					style = 'display:block;width:100%;height:50px;position:relative';
					var divButton = document.createElement('div');
					divButton.setAttribute('style', style);
					div.appendChild(divButton);

					// Append button
					style = 'all:initial;position:relative;width:100%;height:100%;background:#F0F0F0;border:solid 1px #222;color:#222;font-family:Arial;font-size:13px;';
					var button = document.createElement('button');
					if (!site.buttons[i].settings) {
						button.setAttribute('style', style + 'text-align:center;');
						button.innerHTML = site.buttons[i].name;
					} else {
						button.setAttribute('style', style);
						button.innerHTML = '<span style="all:initial;position:absolute;top:5px;color:#222;font-family:Arial;font-size:13px;text-align:center;width:100%;margin:0 auto;">' + site.buttons[i].name + '</span>';
					};
					button.setAttribute('my_id', i);
					divButton.appendChild(button);
					buttons.push(button); // Add button to global array

					// Append discordify button
					style = 'all:initial;position:absolute;width:10%;height:100%;right:5%;background:#F0F0F0;border:solid 1px #222;color:#222;font-family:Arial;font-size:13px;text-align:center;';
					var buttonDiscord = document.createElement('button');
					buttonDiscord.setAttribute('style', style);
					buttonDiscord.setAttribute('my_id', i);
					try { // Compatibility if discordStandard not defined
						if (discordStandard) {
							buttonDiscord.innerHTML = 'As Text';
						} else {
							buttonDiscord.innerHTML = 'For Discord';
						};
					} catch (err) {
						buttonDiscord.innerHTML = 'For Discord';
					};
					divButton.appendChild(buttonDiscord);
					buttonsDiscord.push(buttonDiscord);

					// Append checkboxes if settings are given
					if (site.buttons[i].settings) {

						style = 'position:absolute;bottom:0px;width:100%;pointer-events:none';
						var divCheckboxesWrapper = document.createElement('div');
						divCheckboxesWrapper.setAttribute('style', style);
						divButton.appendChild(divCheckboxesWrapper);

						style = 'text-align:center;margin: 2px;';
						var divCheckboxes = document.createElement('div');
						divCheckboxes.setAttribute('style', style);
						divCheckboxesWrapper.appendChild(divCheckboxes);

						var checkboxArray = {};
						for (var key in site.buttons[i].settings) {
							value = site.buttons[i].settings[key];

							style = 'all:initial;color:#222;font-family:Arial;font-size:13px;margin:0 10px';
							var label = document.createElement('label');
							label.setAttribute('style', style);
							divCheckboxes.appendChild(label);

							style = 'all:initial;-webkit-appearance: checkbox;';
							var input = document.createElement('input');
							input.setAttribute('type', 'checkbox');
							input.setAttribute('style', style);
							if (value === true) {
								input.setAttribute('checked', '');
							};
							label.appendChild(input);
							checkboxArray[key] = input;

							var text = document.createTextNode(key);
							label.appendChild(text);
						};
						buttonCheckboxes.push(checkboxArray);
					} else {
						buttonCheckboxes.push({});
					};

				};
			};

			// Add Checkboxes
			if (site.settings) {
				style = 'display:block;width:100%;';
				var divCheckboxesWrapper = document.createElement('div');
				divCheckboxesWrapper.setAttribute('style', style);
				div.appendChild(divCheckboxesWrapper);

				style = 'text-align:center;margin:5px;';
				var divCheckboxes = document.createElement('div');
				divCheckboxes.setAttribute('style', style);
				divCheckboxes.appendChild(document.createTextNode('Options for all: '));
				divCheckboxesWrapper.appendChild(divCheckboxes);

				var checkboxArray = {};
				for (var key in site.settings) {
					value = site.settings[key];

					style = 'all:initial;color:#222;font-family:Arial;font-size:13px;margin:0 10px;';
					var label = document.createElement('label');
					label.setAttribute('style', style);
					divCheckboxes.appendChild(label);

					style = 'all:initial;-webkit-appearance: checkbox;';
					var input = document.createElement('input');
					input.setAttribute('type', 'checkbox');
					input.setAttribute('style', style);
					if (value === true) {
						input.setAttribute('checked', '');
					};
					label.appendChild(input);
					checkboxArray[key] = input;

					var text = document.createTextNode(key);
					label.appendChild(text);
				};
				checkboxes = checkboxArray;
			};

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
			div.appendChild(divClose);
		})();

		// Add button listener
		(function () {

			for (var i = 0; i < buttons.length; i++) {
				buttons[i].addEventListener("click", function (event) {
					event.preventDefault(); // Do not scroll to top

					// Copy the text for button
					var text = getText(event.target.getAttribute('my_id'));
					try { // Compatibility if discordStandard not defined
						if (discordStandard) {
							text = discordify(text);
						};
					} catch (err) {};
					copy(text);

					// Remove all buttons after click
					div.parentNode.removeChild(div);
				});

				buttonsDiscord[i].addEventListener("click", function (event) {
					event.preventDefault(); // Do not scroll to top

					// Copy the text for button
					var text = getText(event.target.getAttribute('my_id'));
					try { // Compatibility if discordStandard not defined
						if (!discordStandard) {
							text = discordify(text);
						};
					} catch (err) {
						text = discordify(text);
					};
					copy(text);

					// Remove all buttons after click
					div.parentNode.removeChild(div);
				});
			};

			// Return text to copy
			function getText(i) {
				var o = {};
				if (site.object) { // If object is given, evaluate object
					o = site.object(getSettingsObject(buttonCheckboxes[i]), getSettingsObject(checkboxes));
				};
				o = getDefaultObject(o);
				return parseText(site.buttons[i].content, o);
			};

			// Prepare text for discord
			function discordify(text) {
				// Replace all links
				var lines = text.split('\n');
				text = '';
				for (var i = 0; i < lines.length; i++) {
					// Replace all lines with links with <link>
					if (lines[i].startsWith('http')) {
						text += '<' + lines[i] + '>\n';
					} else {
						text += lines[i] + '\n';
					}
				};

				// Replace block quotes
				text = text.split('`\n').join('`');
				text = text.split('`').join('```');

				// Check every line for > quotes
				var dtext = '';
				lines = text.split('\n');
				var b_quote = false;
				for (var i = 0; i < lines.length; i++) {
					if (lines[i].startsWith('>')) { // If line is a quote
						if (b_quote) { // Already quoting?
							// Then add the line with the > removed
							dtext = dtext + '\n' + lines[i].substr(1).trim();
						} else {
							// If not quoting, start the quote
							b_quote = true;
							dtext = dtext + '```\n' + lines[i].substr(1).trim();
						}
					} else {
						if (b_quote) { // Was quoting
							// Then stop the quote
							b_quote = false;
							dtext = dtext + '```' + lines[i];
						} else {
							dtext = dtext + '\n' + lines[i]; // Add next line normally
						}
					}
				}

				if (b_quote) { // Quote didn't end
					// Then stop the quote
					dtext = dtext + '```';
				};

				return dtext.trim() + '\n';
			};

			// Return settings object for checkboxes
			function getSettingsObject(checkboxes) {
				var o = {};
				for (var key in checkboxes) {
					o[key] = checkboxes[key].checked;
				};
				return o;
			};

			// Parse a String s with values in o
			function parseText(s, o) {
				var p = ''; // Parsed String
				var isToken = false;
				var token = '';
				for (var i = 0; i < s.length; i++) {
					if (s[i] === '%') { // If this character is found
						if (isToken) { // If token is active
							isToken = false; // deactivate it
							p = p + o[token]; // add the current token to p
							token = ''; // reset token
						} else {
							isToken = true;
						}
					} else if (isToken) {
						token = token + s[i];
					} else {
						p = p + s[i];
					};
				};
				return p;
			};

			function copy(text) {

				// Input element
				var input = document.createElement('textarea');
				input.setAttribute('style', 'height: 0px; width: 0px;');
				document.body.appendChild(input);

				// Select the input node's contents
				input.value = text;
				input.select();

				// Copy it to the clipboard
				document.execCommand("copy");

				// Remove input element
				document.body.removeChild(input);
			};

			// Add default elements
			function getDefaultObject(o) {
				var title = document.title.trim();
				if (title.length > 200) {
					title = title.substr(0, 197) + '...';
				};
				var defaultObject = {
					'link': document.location.href,
					'title': title
				};
				for (var key in defaultObject) {
					o[key] = defaultObject[key];
				};
				return o;
			};

		})();
	};

	function nodify(nodes) {
		if (Object.prototype.toString.call(nodes) === '[object HTMLCollection]') {
			if (nodes.length === 0) {
				var element = document.createElement('div');
				element.innerHtml = 'nullarray';
				nodes = [];
				nodes.push(element);
			}
		} else if (nodes === null) {
			var element = document.createElement('div');
			element.textContent = 'null';
			nodes = element;
		} else if (nodes === undefined) {
			var element = document.createElement('div');
			element.textContent = 'undefined';
			nodes = element;
		}
		return nodes;
	};

	// Additional functions for sites
	function getSankakucomplexObject(settings, globalSettings) {

		function getArrayFromTags(chars, copyrightArray) {
			var array = [];
			for (var i = 0; i < chars.length; i++) {
				var tag = chars.eq(i).text().split(' ').join('_').replace('_(series)', '');
				if (copyrightArray) {
					for (var k = 0; k < copyrightArray.length; k++) {
						tag = tag.replace('_(' + copyrightArray[k] + ')', '');
					}
				};
				array.push(tag);
			};
			return array;
		};

		function getTextFromArray(chars) {
			var charactertext = '';
			if (chars.length > 3) {
				charactertext = chars[0] + ' ' + chars[1] + ' ' + chars[2] + ' ...';
			} else if (chars.length === 3) {
				charactertext = chars[0] + ' ' + chars[1] + ' ' + chars[2];
			} else if (chars.length === 2) {
				charactertext = chars[0] + ' ' + chars[1];
			} else if (chars.length === 1) {
				charactertext = chars[0];
			} else {
				charactertext = 'Unknown';
			};
			return charactertext;
		};

		// Get copyright and character
		var copyrightarray = getArrayFromTags(jQuery('.tag-type-copyright > a'));
		var copyrighttext = getTextFromArray(copyrightarray);
		var charactertext = getTextFromArray(getArrayFromTags(jQuery('.tag-type-character > a'), copyrightarray));

		var firstline = '';
		if ((charactertext === 'Unknown') && (copyrighttext === 'original')) {
			firstline = 'original';
		} else if ((charactertext === 'Unknown') && (copyrighttext === 'Unknown')) {
			firstline = 'No character/copyright';
		} else if (copyrighttext === 'Unknown') {
			firstline = charactertext;
		} else if (copyrighttext === 'original') {
			firstline = charactertext + ' (original)';
		} else if (charactertext === 'Unknown') {
			firstline = copyrighttext;
		} else {
			firstline = charactertext + ' from ' + copyrighttext;
		};
		var characterline = '> ' + firstline + '\n';

		// Get artist
		var artisttext = getTextFromArray(getArrayFromTags((jQuery('.tag-type-artist > a'))));
		var artistline = '';
		if (artisttext !== 'Unknown') {
			artistline = '> ' + artisttext + '\n';
		};

		// Get favs
		var favs = jQuery('#favorited-by').text();
		var favnr = 0;
		if (favs !== 'no one') {
			favnr = favs.split(', ').length;
		};
		var favbytext = '';
		var users = watchingSankakuUsers;
		for (var i = 0; i < users.length; i++) {
			if (favs.indexOf(users[i]) !== -1) {
				favbytext = favbytext + ' ' + users[i];
			}
		};
		if (favbytext !== '') {
			favbytext = ' [' + favbytext + ' ]';
		};

		// Get comments
		var comments = document.getElementsByClassName('comment').length;
		var commentstag = '';
		if (comments > 0) {
			commentstag = ' [ C ' + comments + ' ]';
		};

		// Get Details
		var user = 'System';
		var rating = '';
		var size = '';
		var date = '';

		var lis = jQuery('#stats > ul > li');
		for (var i = 0; i < lis.length; i++) {
			var litext = lis.eq(i).text().trim();
			if (litext.startsWith('Posted: ')) {
				var as = lis.eq(i).find('a');
				date = as.eq(0).text();
				if (as.length === 3) {
					user = as.eq(1).text();
				}
			} else if (litext.startsWith('Original: ')) {
				size = litext.substr('Original: '.length);
			} else if (litext.startsWith('Rating: ')) {
				rating = litext['Rating: '.length].toLowerCase();
			}
		};

		// Find out if it is animated and has audio
		var is_animated = '';
		if (/animated/.exec(jQuery('.tag-type-medium > a').text())) {
			is_animated = ' ' + decodeURI('%E2%9C%87');
		};
		var has_audio = '';
		if (/has[\s_]audio/.exec(jQuery('.tag-type-medium > a').text())) {
			has_audio = ' ' + decodeURI('%E2%99%AB');
		};

		// Icons
		var star = decodeURI('%E2%98%86');
		var heart = decodeURI('%E2%99%A1');

		return {
			'characterline': characterline,
			'artistline': artistline,
			'scoretag': ' [ ' + star + ' ' + jQuery('[id^=post-score-]').text() + ' ]',
			'favstag': ' [ ' + heart + ' ' + favnr + ' ]',
			'favbytag': favbytext,
			'r': rating,
			'user': user,
			'size': size,
			'date': date,
			'commentstag': commentstag,
			'has_audio': has_audio,
			'is_animated': is_animated,
		};
	};

	function getYoutubeObject(settings, globalSettings) {
		// Parse info
		var title = document.getElementById('eow-title').innerText;
		var uploader = document.getElementsByClassName('yt-user-info')[0].innerText;
		var views = document.getElementsByClassName('watch-view-count')[0].innerText.split(' ')[0];
		var likes = parseInt(document.getElementsByClassName('like-button-renderer-like-button')[0].innerText.replace(/\D/g, ''));
		var dislikes = parseInt(document.getElementsByClassName('like-button-renderer-dislike-button')[0].innerText.replace(/\D/g, ''));
		var duration = document.getElementsByClassName('ytp-time-duration')[0].innerText;

		var viewsmin = parseInt(views.replace(/\D/g, ''));
		if (viewsmin >= 1e3) {
			var p = Math.floor(Math.log10(viewsmin)) - 1;
			viewsmin = Math.round(viewsmin / (Math.pow(10, p))) * Math.pow(10, p);
		};
		if (viewsmin >= 1e9) {
			viewsmin = Math.round(viewsmin / 1e9 * 10) / 10 + 'G';
		} else if (viewsmin >= 1e6) {
			viewsmin = Math.round(viewsmin / 1e6 * 10) / 10 + 'M';
		} else if (viewsmin >= 1e3) {
			viewsmin = Math.round(viewsmin / 1e3 * 10) / 10 + 'k';
		};

		var likespercent = '-';
		if ((likes > 0) || (dislikes > 0)) {
			likespercent = Math.round(likes / (likes + dislikes) * 100) + ' %';
		};

		var link = document.location.href;
		if (globalSettings['Clean link']) {
			link = 'https://youtube.com/watch?v=' + yt.config_.VIDEO_ID;
		};
		var currenttime = '';
		if (globalSettings['Include current time']) {
			currenttime = document.getElementsByClassName('ytp-time-current')[0].innerHTML;
			var time = currenttime.split(':');
			currenttime = currenttime + ' / ';
			var timeparam = '&t=';
			link = link.replace(/&?t=((\d+h)?\d+m)?\d+s/, ''); // Replace old time
			if (time.length === 3) {
				timeparam = timeparam + parseInt(time[0]) + 'h' + parseInt(time[1]) + 'm' + parseInt(time[2]) + 's';
			} else {
				timeparam = timeparam + parseInt(time[0]) + 'm' + parseInt(time[1]) + 's';
			};
			link = link + timeparam;
		};

		// Icons
		var thumbup = decodeURI('%E2%96%B2');
		var thumbdown = decodeURI('%E2%96%BC');
		var play = decodeURI('%E2%96%BA');

		return {
			'youtubetitle': title,
			'youtubelink': link,
			'play': play,
			'views': views,
			'viewsmin': viewsmin,
			'thumbup': thumbup,
			'likes': likes,
			'likespercent': likespercent,
			'currenttime': currenttime,
			'thumbdown': thumbdown,
			'dislikes': dislikes,
			'uploader': uploader,
			'duration': duration,
		};
	};

	function getImdbObject(settings, globalSettings) {
		// Icons
		var star = decodeURI('%E2%98%86');

		var overview = jQuery('#title-overview-widget');

		var genres = overview.find('[itemprop="genre"]');
		var genretext = genres.eq(0).text().trim();
		for (var i = 1; i < genres.length; i++) {
			genretext = genretext + ', ' + genres.eq(i).text().trim();
		};
		var myrating = overview.find('.star-rating-value').eq(0).text().trim();
		var myratingtext = '';
		if (myrating > 0) {
			myratingtext = ' [ my ' + star + ' ' + myrating + ' ]'; ;
		};

		var summaryline = '';
		if (settings['Include summary']) {
			summaryline = '`' + overview.find('.summary_text').text().trim() + '`\n';
		};

		var o = {
			'movietitle': overview.find('[itemprop="name"]').eq(0).text().trim(),
			'duration': overview.find('[itemprop="duration"]').eq(0).text().trim(),
			'ratingtag': ' [ ' + star + ' ' + overview.find('[itemprop="ratingValue"]').eq(0).text().trim() + ' ]',
			'myratingtag': myratingtext,
			'genre': genretext,
			'summaryline': summaryline
		};
		return o
	};

	function getMyanimelistObject(settings, globalSettings) {
		// Icons
		var star = decodeURI('%E2%98%86');

		var overview = jQuery('#title-overview-widget');

		var myrating = parseInt(jQuery('#myinfo_score').find('[selected="selected"]').attr('value'));
		var myratingtext = '';
		if (myrating > 0) {
			myratingtext = ' [ my ' + star + ' ' + myrating + ' ]'; ;
		};

		var summaryline = '';
		if (settings['Include summary']) {
			summaryline = '`' + jQuery('[itemprop="description"]').text().trim() + '`\n';
		};

		var o = {
			'movietitle': jQuery('h1').text().trim(),
			'episodes': jQuery('#curEps').text().trim(),
			'ratingtag': ' [ ' + star + ' ' + jQuery('.fl-l.score').text().trim() + ' ]',
			'myratingtag': myratingtext,
			'genre': jQuery('span:contains("Genres:")').parent().text().trim().split('\n')[1].trim(),
			'summaryline': summaryline
		};
		return o;
	};

	function getAmazonObject(settings, globalSettings) {
		// Icons
		var star = decodeURI('%E2%98%86');

		var price = nodify(document.getElementById('priceblock_ourprice')).innerText.trim();
		if (price === 'null') {
			price = nodify(document.getElementById('priceblock_saleprice')).innerText.trim();
			if (price === 'null') {
				price = 'N/A';
			}
		};

		var rating = nodify(document.getElementById('reviewStarsLinkedCustomerReviews')).innerText
			.trim().split('von')[0].split('out')[0].trim();
		var ratingtag = '';
		if (rating !== 'null') {
			ratingtag = '[ ' + star + ' ' + rating + ' from ' + nodify(document.getElementById('acrCustomerReviewText')).innerText.trim().split(' ')[0] + ' reviews ]';
		};

		var amazonlink = document.location.href;
		if (globalSettings['Clean link']) {
			amazonlink = amazonlink.split('ref=')[0];
		};

		var o = {
			'productname': nodify(document.getElementById('productTitle')).innerText.trim(),
			'price': price,
			'availability': nodify(document.getElementById('availability').querySelector('span')).innerText.trim(),
			'ratingtag': ratingtag,
			'amazonlink': amazonlink,
		};
		return o;
	};
	
	function getWikipediaObject(settings, globalSettings) {
		var el;
		
		var wikititle = '';
		el = document.getElementById('firstHeading');
		if(el !== null){
			wikititle = el.innerText;
		}
		else{
			wikititle = document.title;
		}
		
		var firstsentence = '';
		el = document.querySelector('#mw-content-text > p');
		if(el === null){ // if el not found
			el = document.querySelector('#bodyContent p');
		};
		if(el){
			firstsentence = '> ' + el.innerText.split('. ')[0] + '\n';
		};
				
		return {
			'wikititle' : wikititle,
			'firstsentence': firstsentence,
		};
	};
})();