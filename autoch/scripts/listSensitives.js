const CCDICT = "../data/cc-cedict.json";

let output, fs = require("fs");
let args = process.argv.slice(2);
let entries = JSON.parse(fs.readFileSync(CCDICT, 'utf8'));

var triggers = getTriggers();
for (let i = 0; i < entries.length; i++) {
  let simp = entries[i].simplified;
  let trad = entries[i].traditional;
  var sidx = triggers.indexOf(simp);
  var tidx = triggers.indexOf(simp);
  if (tidx > -1) console.log(trad + ' : '+entries[i].definitions.join(', ') +'  ['+entries[i].pinyinDiacritic+']');
  else if (sidx > -1) console.log(simp + ' -> ' + entries[i].definitions.join(','));

}

function getTriggers() {
  return [
'臉書',
'脸书',
'經濟',
'经济',
'萬歲',
'万岁',
'對抗',
'对抗',
'共产',
'共產',
'本土',
'本地',
'資本',
'资本',
'政治',
'人民',
'微博',
'教会',
'教會',
'天主',
'教徒',
'发展',
'發展',
'信徒',
'宗教',
'文化',
'和諧',
'河蟹',
'和谐',
'專政',
'封閉',
'運動',
'专政',
'封闭',
'运动',
'回教',
'新疆',
'宗教',
'伦理',
'倫理',
'道德',
'公德',
'诚实',
'誠實',
'公平',
'公正',
'持平',
'正義',
'野蛮',
'野蠻',
'粗暴',
'未來',
'好处',
'好處',
'利益',
'接任',
'接替',
'继承',
'繼承',
'皇帝',
'傳教',
'传教',
'传道',
'傳道',
'新闻',
'新聞',
'主席',
'年輕',
'回歸',
'回归',
'放棄',
'触发',
'觸發',
'抵制',
'挑撥',
'挑拨',
'杯葛',
'領土',
'领土',
'过敏',
'過敏',
'敏感',
'市場',
'占领',
'佔領',
'雨傘',
'雨伞',
'利润',
'盈利',
'領域',
'领域',
'边界',
'邊界',
'边境',
'邊境',
'极限',
'極限',
'穩定',
'稳定',
'繁榮',
'繁荣',
'文明',
'发达',
'發達',
'干預',
'干预',
'內政',
'罢工',
'罷工',
'無產',
'階級',
'無產',
'階級',
'暴君',
'统治',
'統治',
'歷史',
'历史',
'自由',
'自主',
'言論',
'言论',
'示威',
'隱私',
'私隱',
'隐私',
'私隐',
'取締',
'取缔',
'管制',
'操纵',
'操縱',
'制度',
'系统',
'體系',
'体系',
'体制',
'操控',
'體制',
'問題',
'问题',
'不安',
'害怕',
'畏惧',
'畏懼',
'欺負',
'欺凌',
'欺负',
'領導',
'领导',
'主導',
'主导',
'领袖',
'領袖',
'抑制',
'馴化',
'驯化',
'族裔',
'血统',
'血統',
'關係',
'关系',
'懷疑',
'怀疑',
'疑心',
'疑虑',
'疑慮',
'身分',
'身份',
'釘子',
'危害',
'憤慨',
'憤慨',
'忠诚',
'忠誠',
'忠贞',
'忠貞',
'贡献',
'貢獻',
'效忠',
'諾言',
'諾言',
'承诺',
'承諾',
'收縮',
'收缩',
'選舉',
'选举',
'推选',
'推選',
'提名',
'投票',
'表决',
'票选',
'票選',
'公投',
'參選',
'参选',
'立誓',
'宣誓',
'應諾',
'应诺',
'屈服',
'降服',
'归顺',
'歸順',
'服從',
'服从',
'請願',
'请愿',
'腐敗',
'腐败',
'钳制',
'箝制',
'崩潰',
'崩溃',
'瓦解',
'倒塌',
'崩塌',
'打倒',
'革命',
'文革',
'高鐵',
'高铁',
'治安',
'公安',
'尊重',
'禮儀',
'礼仪',
'否決',
'否决',
];
}