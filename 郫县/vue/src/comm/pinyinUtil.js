/**
 * 汉字与拼音互转工具，根据导入的字典文件的不同支持不同
 * 对于多音字目前只是将所有可能的组合输出，准确识别多音字需要完善的词库，而词库文件往往比字库还要大，所以不太适合web环境。
 * @start 2016-09-26
 * @last 2016-09-29
 */
/* eslint-disable */
import pinyin_dict_firstletter from './pinyin_dict_firstletter';
var dict = {}; // 存储所有字典数据
var pinyinUtil =
	{
		/**
		 * 解析各种字典文件，所需的字典文件必须在本JS之前导入
		 */
		parseDict: function () {
			// 如果导入了 pinyin_dict_firstletter.js
			if (pinyin_dict_firstletter) {
				dict.firstletter = pinyin_dict_firstletter;
			}
			// 如果导入了 pinyin_dict_notone.js
			if (window.pinyin_dict_notone) {
				dict.notone = {};
				dict.py2hz = pinyin_dict_notone; // 拼音转汉字
				for (var i in pinyin_dict_notone) {
					var temp = pinyin_dict_notone[i];
					for (var j = 0, len = temp.length; j < len; j++) {
						dict.notone[temp[j]] = i; // 不考虑多音字
					}
				}
			}
		},
		/**
		 * 根据汉字获取拼音，如果不是汉字直接返回原字符
		 * @param chinese 要转换的汉字
		 * @param splitter 分隔字符，默认用空格分隔
		 * @param withtone 返回结果是否包含声调，默认是
		 * @param polyphone 是否支持多音字，默认否
		 */
		getPinyin: function (chinese, splitter, withtone, polyphone) {
			if (!chinese || /^ +$/g.test(chinese)) return '';
			splitter = splitter == undefined ? ' ' : splitter;
			withtone = withtone == undefined ? true : withtone;
			polyphone = polyphone == undefined ? false : polyphone;
			var result = [];
			if (dict.withtone) // 优先使用带声调的字典文件
			{
				for (var i = 0, len = chinese.length; i < len; i++) {
					var pinyin = dict.withtone[chinese[i]];
					if (pinyin) {
						if (!polyphone) pinyin = pinyin.replace(/ .*$/g, ''); // 如果不需要多音字
						if (!withtone) pinyin = this.removeTone(pinyin); // 如果不需要声调
					}
					result.push(pinyin || chinese[i]);
				}
			}
			else if (dict.notone) // 使用没有声调的字典文件
			{
				if (withtone) console.warn('pinyin_dict_notone 字典文件不支持声调！');
				if (polyphone) console.warn('pinyin_dict_notone 字典文件不支持多音字！');
				for (var i = 0, len = chinese.length; i < len; i++) {
					var temp = chinese.charAt(i);
					result.push(dict.notone[temp] || temp);
				}
			}
			else {
				throw '抱歉，未找到合适的拼音字典文件！';
			}
			if (!polyphone) return result.join(splitter);
			else {
				if (window.pinyin_dict_polyphone) return parsePolyphone(chinese, result, splitter, withtone);
				else return handlePolyphone(result, ' ', splitter);
			}
		},
		/**
		 * 获取汉字的拼音首字母
		 * @param str 汉字字符串，如果遇到非汉字则原样返回
		 * @param polyphone 是否支持多音字，默认false，如果为true，会返回所有可能的组合数组
		 */
		getFirstLetter: function (str, polyphone) {
			polyphone = polyphone == undefined ? false : polyphone;
			if (!str || /^ +$/g.test(str)) return '';
			if (dict.firstletter) // 使用首字母字典文件
			{
				var result = [];
				for (var i = 0; i < str.length; i++) {
					var unicode = str.charCodeAt(i);
					var ch = str.charAt(i);
					if (unicode >= 19968 && unicode <= 40869) {
						ch = dict.firstletter.all.charAt(unicode - 19968);
						if (polyphone) ch = dict.firstletter.polyphone[unicode] || ch;
					}
					result.push(ch);
				}
				if (!polyphone) return result.join(''); // 如果不用管多音字，直接将数组拼接成字符串
				else return handlePolyphone(result, '', ''); // 处理多音字，此时的result类似于：['D', 'ZC', 'F']
			}
			else {
				var py = this.getPinyin(str, ' ', false, polyphone);
				py = py instanceof Array ? py : [py];
				var result = [];
				for (var i = 0; i < py.length; i++) {
					result.push(py[i].replace(/(^| )(\w)\w*/g, function (m, $1, $2) { return $2.toUpperCase(); }));
				}
				if (!polyphone) return result[0];
				else return simpleUnique(result);
			}
		},
	};
// 简单数组去重
function simpleUnique(array) {
	var result = [];
	var hash = {};
	for (var i = 0; i < array.length; i++) {
		var key = (typeof array[i]) + array[i];
		if (!hash[key]) {
			result.push(array[i]);
			hash[key] = true;
		}
	}
	return result;
}

pinyinUtil.parseDict();
pinyinUtil.dict = dict;
export default pinyinUtil;
