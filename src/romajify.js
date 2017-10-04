// Fullwidth converter
String.prototype.toFullWidth = function () {
	return this.replace(/[A-Za-z0-9]/g, function (s) {
		return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
	});
};

// https://github.com/markni/romaji.js
"use strict";

(function () {
	var root = this;

	var previousRomaji = root.romaji;

	var romaji;

	if (typeof exports !== 'undefined') {
		romaji = exports;
	} else {
		romaji = root.romaji = {};
	};

	romaji.version = '0.2.1';
	romaji.mode = 'hepburn';

	//helper functions

	var swapJsonKeyValues = function (input) {
		var one,
		output = {};
		for (one in input) {
			if (input.hasOwnProperty(one)) {
				output[input[one]] = one;
			}
		};
		return output;
	};

	var replaceAll = function (find, replace, str) {
		return str.replace(new RegExp(find, 'g'), replace);
	};

	//maps
	var toKanaMap = {};

	toKanaMap.hiragana = {
		//Digraphs

		"きゃ": "kya".toFullWidth(),
		"しゃ": "sha".toFullWidth(),
		"ちゃ": "cha".toFullWidth(),
		"にゃ": "nya".toFullWidth(),
		"ひゃ": "hya".toFullWidth(),
		"みゃ": "mya".toFullWidth(),
		"りゃ": "rya".toFullWidth(),
		"ぎゃ": "gya".toFullWidth(),
		"ふゅ": "fyu".toFullWidth(),

		"びゃ": "bya".toFullWidth(),
		"ぴゃ": "pya".toFullWidth(),

		"きゅ": "kyu".toFullWidth(),
		"しゅ": "shu".toFullWidth(),
		"ちゅ": "chu".toFullWidth(),
		"にゅ": "nyu".toFullWidth(),
		"ひゅ": "hyu".toFullWidth(),
		"みゅ": "myu".toFullWidth(),
		"りゅ": "ryu".toFullWidth(),
		"ぎゅ": "gyu".toFullWidth(),

		"びゅ": "byu".toFullWidth(),
		"ぴゅ": "pyu".toFullWidth(),

		"きょ": "kyo".toFullWidth(),
		"しょ": "sho".toFullWidth(),
		"ちょ": "cho".toFullWidth(),
		"にょ": "nyo".toFullWidth(),
		"ひょ": "hyo".toFullWidth(),
		"みょ": "myo".toFullWidth(),
		"りょ": "ryo".toFullWidth(),
		"ぎょ": "gyo".toFullWidth(),

		"びょ": "byo".toFullWidth(),
		"ぴょ": "pyo".toFullWidth(),

		"つぁ": "tsa".toFullWidth(),
		"つぃ": "tsi".toFullWidth(),
		"つぇ": "tse".toFullWidth(),
		"つぉ": "tso".toFullWidth(),

		"ちぇ": "che".toFullWidth(),
		"しぇ": "she".toFullWidth(),

		"じゃ": "ja".toFullWidth(),
		"じゅ": "ju".toFullWidth(),
		"じょ": "jo".toFullWidth(),

		"ふぁ": "fa".toFullWidth(),
		"ふぃ": "fi".toFullWidth(),
		"ふぇ": "fe".toFullWidth(),
		"ふぉ": "fo".toFullWidth(),

		"うぃ": "wi".toFullWidth(),

		// obsoleted kana
		"ゑ": "we".toFullWidth(),

		"うぇ": "we".toFullWidth(),

		"うぉ": "wo".toFullWidth(),

		"ゔぁ": "va".toFullWidth(),
		"ゔぃ": "vi".toFullWidth(),
		"ゔぇ": "ve".toFullWidth(),
		"ゔぉ": "vo".toFullWidth(),

		"じぇ": "je".toFullWidth(),
		"てぃ": "ti".toFullWidth(),
		"でぃ": "di".toFullWidth(),
		"でゅ": "du".toFullWidth(),
		"とぅ": "tu".toFullWidth(),

		//Monographs

		"し": "shi".toFullWidth(),
		"ち": "chi".toFullWidth(),
		"つ": "tsu".toFullWidth(),

		"か": "ka".toFullWidth(),
		"さ": "sa".toFullWidth(),
		"た": "ta".toFullWidth(),
		"な": "na".toFullWidth(),
		"は": "ha".toFullWidth(),
		"ま": "ma".toFullWidth(),
		"ら": "ra".toFullWidth(),

		"き": "ki".toFullWidth(),

		"に": "ni".toFullWidth(),
		"ひ": "hi".toFullWidth(),
		"み": "mi".toFullWidth(),
		"り": "ri".toFullWidth(),

		"く": "ku".toFullWidth(),

		"す": "su".toFullWidth(),

		"ぬ": "nu".toFullWidth(),
		"ふ": "fu".toFullWidth(),
		"む": "mu".toFullWidth(),
		"る": "ru".toFullWidth(),

		"け": "ke".toFullWidth(),
		"せ": "se".toFullWidth(),
		"て": "te".toFullWidth(),
		"ね": "ne".toFullWidth(),
		"へ": "he".toFullWidth(),
		"め": "me".toFullWidth(),
		"れ": "re".toFullWidth(),

		"こ": "ko".toFullWidth(),
		"そ": "so".toFullWidth(),
		"と": "to".toFullWidth(),
		"の": "no".toFullWidth(),
		"ほ": "ho".toFullWidth(),
		"も": "mo".toFullWidth(),
		"ろ": "ro".toFullWidth(),

		"わ": "wa".toFullWidth(),
		"を": "wo".toFullWidth(),

		"が": "ga".toFullWidth(),
		"ざ": "za".toFullWidth(),
		"だ": "da".toFullWidth(),
		"ば": "ba".toFullWidth(),
		"ぱ": "pa".toFullWidth(),

		"ぎ": "gi".toFullWidth(),

		"ぢ": "ji".toFullWidth(),
		//じ is more common to use, so it goes secondly
		// when we build toHiraganaMap, this will get overwriiten by second one

		"じ": "ji".toFullWidth(),

		"び": "bi".toFullWidth(),
		"ぴ": "pi".toFullWidth(),

		"ぐ": "gu".toFullWidth(),
		"ず": "zu".toFullWidth(),
		"づ": "zu".toFullWidth(),
		"ぶ": "bu".toFullWidth(),
		"ぷ": "pu".toFullWidth(),

		"げ": "ge".toFullWidth(),
		"ぜ": "ze".toFullWidth(),
		"で": "de".toFullWidth(),
		"べ": "be".toFullWidth(),
		"ぺ": "pe".toFullWidth(),

		"ご": "go".toFullWidth(),
		"ぞ": "zo".toFullWidth(),
		"ど": "do".toFullWidth(),
		"ぼ": "bo".toFullWidth(),
		"ぽ": "po".toFullWidth(),

		"や": "ya".toFullWidth(),
		"ゆ": "yu".toFullWidth(),
		"よ": "yo".toFullWidth(),

		"あ": "a".toFullWidth(),
		"い": "i".toFullWidth(),
		"う": "u".toFullWidth(),
		"え": "e".toFullWidth(),
		"お": "o".toFullWidth(),
		"ん": "n".toFullWidth()

	};

	toKanaMap.katakana = {
		"キャ": "kya".toFullWidth(),
		"シャ": "sha".toFullWidth(),
		"チャ": "cha".toFullWidth(),
		"ニャ": "nya".toFullWidth(),
		"ヒャ": "hya".toFullWidth(),
		"ミャ": "mya".toFullWidth(),
		"リャ": "rya".toFullWidth(),
		"ギャ": "gya".toFullWidth(),

		"ビャ": "bya".toFullWidth(),
		"ピャ": "pya".toFullWidth(),

		"キュ": "kyu".toFullWidth(),
		"シュ": "shu".toFullWidth(),
		"チュ": "chu".toFullWidth(),
		"ニュ": "nyu".toFullWidth(),
		"ヒュ": "hyu".toFullWidth(),
		"ミュ": "myu".toFullWidth(),
		"リュ": "ryu".toFullWidth(),
		"ギュ": "gyu".toFullWidth(),

		"ビュ": "byu".toFullWidth(),
		"ピュ": "pyu".toFullWidth(),

		"キョ": "kyo".toFullWidth(),
		"ショ": "sho".toFullWidth(),
		"チョ": "cho".toFullWidth(),
		"ニョ": "nyo".toFullWidth(),
		"ヒョ": "hyo".toFullWidth(),
		"ミョ": "myo".toFullWidth(),
		"リョ": "ryo".toFullWidth(),
		"ギョ": "gyo".toFullWidth(),

		"ビョ": "byo".toFullWidth(),
		"ピョ": "pyo".toFullWidth(),

		"フュ": "fyu".toFullWidth(),

		"ツァ": "tsa".toFullWidth(),
		"ツィ": "tsi".toFullWidth(),
		"ツェ": "tse".toFullWidth(),
		"ツォ": "tso".toFullWidth(),

		"チェ": "che".toFullWidth(),
		"シェ": "she".toFullWidth(),

		"シ": "shi".toFullWidth(),
		"チ": "chi".toFullWidth(),
		"ツ": "tsu".toFullWidth(),

		"ジョ": "jo".toFullWidth(),
		"ジャ": "ja".toFullWidth(),
		"ジュ": "ju".toFullWidth(),

		"ファ": "fa".toFullWidth(),
		"フィ": "fi".toFullWidth(),
		"フェ": "fe".toFullWidth(),
		"フォ": "fo".toFullWidth(),

		"ウィ": "wi".toFullWidth(),
		"ウェ": "we".toFullWidth(),
		"ウォ": "wo".toFullWidth(),

		"ヴァ": "va".toFullWidth(),
		"ヴィ": "vi".toFullWidth(),
		"ヴェ": "ve".toFullWidth(),
		"ヴォ": "vo".toFullWidth(),

		"ジェ": "je".toFullWidth(),
		"ティ": "ti".toFullWidth(),
		"ディ": "di".toFullWidth(),
		"デュ": "du".toFullWidth(),
		"トゥ": "tu".toFullWidth(),

		//basic


		"カ": "ka".toFullWidth(),
		"サ": "sa".toFullWidth(),
		"タ": "ta".toFullWidth(),
		"ナ": "na".toFullWidth(),
		"ハ": "ha".toFullWidth(),
		"マ": "ma".toFullWidth(),
		"ラ": "ra".toFullWidth(),

		"キ": "ki".toFullWidth(),

		"ニ": "ni".toFullWidth(),
		"ヒ": "hi".toFullWidth(),
		"ミ": "mi".toFullWidth(),
		"リ": "ri".toFullWidth(),

		"ク": "ku".toFullWidth(),
		"ス": "su".toFullWidth(),

		"ヌ": "nu".toFullWidth(),
		"フ": "fu".toFullWidth(),
		"ム": "mu".toFullWidth(),
		"ル": "ru".toFullWidth(),

		"ケ": "ke".toFullWidth(),
		"セ": "se".toFullWidth(),
		"テ": "te".toFullWidth(),
		"ネ": "ne".toFullWidth(),
		"ヘ": "he".toFullWidth(),
		"メ": "me".toFullWidth(),
		"レ": "re".toFullWidth(),

		"コ": "ko".toFullWidth(),
		"ソ": "so".toFullWidth(),
		"ト": "to".toFullWidth(),
		"ノ": "no".toFullWidth(),
		"ホ": "ho".toFullWidth(),
		"モ": "mo".toFullWidth(),
		"ロ": "ro".toFullWidth(),

		"ワ": "wa".toFullWidth(),
		"ヲ": "wo".toFullWidth(),

		"ガ": "ga".toFullWidth(),
		"ザ": "za".toFullWidth(),
		"ダ": "da".toFullWidth(),
		"バ": "ba".toFullWidth(),
		"パ": "pa".toFullWidth(),

		"ギ": "gi".toFullWidth(),
		"ジ": "ji".toFullWidth(),
		"ヂ": "ji".toFullWidth(),
		"ビ": "bi".toFullWidth(),
		"ピ": "pi".toFullWidth(),

		"グ": "gu".toFullWidth(),
		"ズ": "zu".toFullWidth(),
		"ヅ": "zu".toFullWidth(),
		"ブ": "bu".toFullWidth(),
		"プ": "pu".toFullWidth(),

		"ゲ": "ge".toFullWidth(),
		"ぜ": "ze".toFullWidth(),
		"デ": "de".toFullWidth(),
		"ベ": "be".toFullWidth(),
		"ペ": "pe".toFullWidth(),

		"ゴ": "go".toFullWidth(),
		"ゾ": "zo".toFullWidth(),
		"ド": "do".toFullWidth(),
		"ボ": "bo".toFullWidth(),
		"ポ": "po".toFullWidth(),

		"ャ": "ya".toFullWidth(),
		"ヤ": "ya".toFullWidth(),
		"ュ": "yu".toFullWidth(),
		"ユ": "yu".toFullWidth(),
		"ョ": "yo".toFullWidth(),
		"ヨ": "yo".toFullWidth(),

		"ン": "n".toFullWidth(),
		"ア": "a".toFullWidth(),
		"イ": "i".toFullWidth(),
		"ウ": "u".toFullWidth(),
		"エ": "e".toFullWidth(),
		"オ": "o".toFullWidth(),

		// obsoleted kana


		"ヱ": "we".toFullWidth(),
		"ヹ": "ve".toFullWidth()

	};

	romaji.noConflict = function () {
		root.romaji = previousRomaji;
		return this;
	};

	//main functions

	romaji.fromKana = function (kana) {

		var result = kana;

		//basic dictionary matching
		for (var index in toKanaMap) {
			for (var s in toKanaMap[index]) {
				result = replaceAll(s, toKanaMap[index][s], result);
			}
		};

		//replace long vowels
		result = result.replace(/([﻿ａｅｉｏｕ])ー/gu, "$1");

		//replace the sokuon (doubling)
		result = result.replace(/(ッ|っ)([﻿ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ])/gu, "$2$2");

		return result;

	};

}).call(this);

function applyWalker(node) {
	if (!node) {
		node = document.body;
	};

	// Create Treewalker to walk through every text node
	var walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

	// Change every hiragana and katakana to romaji
	var n;
	while (n = walk.nextNode()) {
		if(n.parentNode.tagName !== 'SCRIPT'){
			n.nodeValue = romaji.fromKana(n.nodeValue);
		}
	}
};

// Apply on head and body
applyWalker(document.head);
applyWalker(document.body);
