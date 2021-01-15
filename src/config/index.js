
export const SPACE_MAP = new Map([
  	[1, [0, 11]],
  	[2, [12, 28]],
  	[3, [29, 100000]],
]);

export const MORE_AREA = {
	"label": "更多地区",
	"spaceWidth": 1,
	"value": "-1",
	"type": "more-area",
};

export const MORE_INDUSTRY = {
	"label": "更多行业",
	"spaceWidth": 1,
	"value": "-2",
	"type": "more-industry",
};

export const MORE_NOVEL = {
	"label": "更多概念",
	"spaceWidth": 1,
	"value": "-3",
	"type": "more-novel",
};

export const CELL_GAP = 8; // 单元格间隔

export const EXPAND_MAX_LINE = 6; // 展开的最大行数

export const LIMIT_NUM_EACH_LINE = 3; // 一行的单元格个数

export const STRATEGY_NUM_EACH_PAGE = 2; // 一页的策略页卡个数

// 特殊获取数据的类型集合
export const NOT_LEAF_MAP = ['expand-api', 'expand-static'];

// 点击后勾选的类型集合
export const SELECT_MAP = ['select', 'select-default'];

// 点击后查看更多的选项集合
export const MORE_TYPE = [MORE_AREA.type, MORE_INDUSTRY.type, MORE_NOVEL.type];

export const SELECTION_TYPE_MAP = {
	// 非叶子节点的类型，除了expand-api、expand-static外，默认为空，从树形数据中正常获取
	"EXPAND_API": "expand-api", // 点击后将从接口获取展开数据
	"EXPAND_STATIC": "expand-static", // 点击后将从本地获取展开数据

	// 叶子节点的类型
	"INPUT": "input", // 点击后弹出输入框弹窗
	"SELECT": "select", // 点击后即选中，在最终问句中，此条件将带父标题
	"SELECT_DEFAULT": "select-default", // 点击后即选中，在最终问句中，此条件将不带父标题
	"MORE_AREA": MORE_AREA.type, // 更多地区的点击类型
	"MORE_INDUSTRY": MORE_INDUSTRY.type, // 更多行业的点击类型
	"MORE_NOVEL": MORE_NOVEL.type, // 更多概念的点击类型
};

export const AREA_DATA = [
	{
		"label": "北京市",
		"spaceWidth": 1,
		"value": "0",
		"type": "select-default"
	},
	{
		"label": "天津市",
		"spaceWidth": 1,
		"value": "1",
		"type": "select-default"
	},
	{
		"label": "上海市",
		"spaceWidth": 1,
		"value": "2",
		"type": "select-default"
	},
	{
		"label": "重庆市",
		"spaceWidth": 1,
		"value": "3",
		"type": "select-default"
	},
	{
		"label": "河北省",
		"spaceWidth": 1,
		"value": "4",
		"type": "select-default"
	},
	{
		"label": "山西省",
		"spaceWidth": 1,
		"value": "5",
		"type": "select-default"
	},
	{
		"label": "内蒙古",
		"spaceWidth": 1,
		"value": "6",
		"type": "select-default"
	},
	{
		"label": "辽宁省",
		"spaceWidth": 1,
		"value": "7",
		"type": "select-default"
	},
	{
		"label": "吉林省",
		"spaceWidth": 1,
		"value": "8",
		"type": "select-default"
	},
	{
		"label": "黑龙江省",
		"spaceWidth": 1,
		"value": "9",
		"type": "select-default"
	},
	{
		"label": "江苏省",
		"spaceWidth": 1,
		"value": "10",
		"type": "select-default"
	},
	{
		"label": "浙江省",
		"spaceWidth": 1,
		"value": "11",
		"type": "select-default"
	},
	{
		"label": "安徽省",
		"spaceWidth": 1,
		"value": "12",
		"type": "select-default"
	},
	{
		"label": "福建省",
		"spaceWidth": 1,
		"value": "13",
		"type": "select-default"
	},
	{
		"label": "江西省",
		"spaceWidth": 1,
		"value": "14",
		"type": "select-default"
	},
	{
		"label": "山东省",
		"spaceWidth": 1,
		"value": "15",
		"type": "select-default"
	},
	{
		"label": "河南省",
		"spaceWidth": 1,
		"value": "16",
		"type": "select-default"
	},
	{
		"label": "湖北省",
		"spaceWidth": 1,
		"value": "17",
		"type": "select-default"
	},
	{
		"label": "湖南省",
		"spaceWidth": 1,
		"value": "18",
		"type": "select-default"
	},
	{
		"label": "广东省",
		"spaceWidth": 1,
		"value": "19",
		"type": "select-default"
	},
	{
		"label": "广西",
		"spaceWidth": 1,
		"value": "20",
		"type": "select-default"
	},
	{
		"label": "海南省",
		"spaceWidth": 1,
		"value": "21",
		"type": "select-default"
	},
	{
		"label": "四川省",
		"spaceWidth": 1,
		"value": "22",
		"type": "select-default"
	},
	{
		"label": "贵州省",
		"spaceWidth": 1,
		"value": "23",
		"type": "select-default"
	},
	{
		"label": "云南省",
		"spaceWidth": 1,
		"value": "24",
		"type": "select-default"
	},
	{
		"label": "西藏",
		"spaceWidth": 1,
		"value": "25",
		"type": "select-default"
	},
	{
		"label": "陕西省",
		"spaceWidth": 1,
		"value": "26",
		"type": "select-default"
	},
	{
		"label": "甘肃省",
		"spaceWidth": 1,
		"value": "27",
		"type": "select-default"
	},
	{
		"label": "青海省",
		"spaceWidth": 1,
		"value": "28",
		"type": "select-default"
	},
	{
		"label": "宁夏",
		"spaceWidth": 1,
		"value": "29",
		"type": "select-default"
	},
	{
		"label": "新疆",
		"spaceWidth": 1,
		"value": "30",
		"type": "select-default"
	},
	{
		"label": "香港",
		"spaceWidth": 1,
		"value": "31",
		"type": "select-default"
	},
	{
		"label": "澳门",
		"spaceWidth": 1,
		"value": "32",
		"type": "select-default"
	},
	{
		"label": "台湾省",
		"spaceWidth": 1,
		"value": "33",
		"type": "select-default"
	}
];

export const EXPAND_API_TYPE = ['field', 'novel'];

export const EXPAND_SPECIAL_MAP = new Map([
	['行业', {
		data: [],
		api: '/mobile/NewHotSpotStocks/allConceptData?source=sjksxg',
		type: EXPAND_API_TYPE[0],
		more: MORE_INDUSTRY,
	}],
	['概念', {
		data: [],
		api: '/mobile/NewHotSpotStocks/allConceptData?source=sjksxg',
		type: EXPAND_API_TYPE[1],
		more: MORE_NOVEL,
	}],
	['地区', {
		data: AREA_DATA,
		more: MORE_AREA,
	}],
]);

export const WAP_WEB_URL = {
	prod: '//www.iwencai.com/unifiedmobile/',
	test: '//ceshiai.iwencai.com/unifiedmobile/',
};

export const WAP_THS_URL = {
	prod: '//search.10jqka.com.cn/unifiedmobile/',
	test: '//testm.10jqka.com.cn/unifiedmobile/',
};
