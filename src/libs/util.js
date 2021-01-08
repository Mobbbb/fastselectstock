import { EXPAND_MAX_LINE } from '_c/config';

/**
 * @param {Array} data 对象数组
 * @param {String} id 自身标识
 * @param {String} pid 父级标识
 * @return {Array} res 树形结构
 * @description 将同级结构的数据转化成树形结构
 */
export function treeDataTranslate(data, id = 'value', pid = 'parents') {
    let res = []
    let temp = {}
    for (let i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (let k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) { // 非根节点
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1
            }
            data[k]['_level'] = temp[data[k][pid]]._level + 1
            temp[data[k][pid]]['children'].push(data[k])
        } else { // 根节点
            res.push(data[k])
        }
    }
    return res
}

/**
 * @description 判断字符串是否为中文
 */
export function isChinese(temp) {
    let re = /[^\u4E00-\u9FA5]/;
    return !re.test(temp);
}

/**
 * @description 计算字符串宽度，一个中文占2个单位，一个非中文占1个单位
 */
export function calcStrSpaceWidth(str) {
    let spaceWidth = 0;
    for (let char of str) {
        if (isChinese(char)) {
            spaceWidth += 2;
        } else {
            spaceWidth += 1;
        }
    }

    return spaceWidth;
}

/**
 * @description 根据map获取num所在的区间的key
 * @params num 整数
 * @params map 区间map，[
 *      [positive integer, [1, 9999999999999999]]
 *      [zero, [0, 0]]
 *      [negative integer, [-99999999999999, -1]]
 * ]
 * @return key: Any
 */
export function getMapSection(num, map) {
    for (let [key, value] of map.entries()) {
        if (num >= value[0] && num <= value[1]) {
           return key;
        }
    }

    return 0;
}

/**
 * @description 将一维数组按limitNumEachLine分为二维数组
 * @param lists 一维数组
 * @param limitNumEachLine 二维数组的每个元素的单元格个数
 * @returns {[]}
 */
export function divideListIntoGroups(lists, limitNumEachLine) {
    let rows = []; // 行数组
    let rowNum = 0; // 单行的单元格个数
    let rowIndex = 0; // 行号
    lists.forEach(item => {
        const unitItem = $.extend({}, item);
        rowNum += unitItem.spaceWidth; // 累加当前行的单元格个数
        // 当单元格的个数超过一行的限制时, 换行重新累加
        if (rowNum > limitNumEachLine) {
            rowNum = unitItem.spaceWidth;
            rowIndex ++;
        }
        if (rows[rowIndex]) {
            rows[rowIndex].push(unitItem);
        } else {
            rows[rowIndex] = [];
            rows[rowIndex].push(unitItem);
        }
    });

    return rows;
}

/**
 * @description 截断溢出的行数，并将末尾元素替换成 more
 * @param divideResult
 * @param more
 * @returns {[]}
 */
export function sliceExpandRows(divideResult, more) {
    let sliceResult = divideResult.slice(0, EXPAND_MAX_LINE);
    sliceResult[EXPAND_MAX_LINE - 1].pop();
    sliceResult[EXPAND_MAX_LINE - 1].push(more);
    return  sliceResult;
}

/**
 * @description 对无级树按兄弟节点进行排序
 * @param list
 * @returns {[]}
 */
export function sortTreeListData(list) {
    const tempList = [];
    const brotherlyNodesMap = {};

    // 以父节点为key，将兄弟节点分组
    list.forEach(item => {
        if (!brotherlyNodesMap[item.parents]) {
            brotherlyNodesMap[item.parents] = [];
        }
        brotherlyNodesMap[item.parents].push(item);
    });

    Object.keys(brotherlyNodesMap).forEach(key => {
        // 按sort字段对兄弟节点进行排序
        brotherlyNodesMap[key] = brotherlyNodesMap[key].sort((a, b) => a.sort - b.sort);
        brotherlyNodesMap[key].forEach(item => {
            tempList.push(item);
        });
    });

    return tempList;
}

/**
 * @description 根据上下文向上寻找componentNames
 */
export function findComponentUpward (context, componentName, componentNames) {
    if (typeof componentName === 'string') {
        componentNames = [componentName];
    } else {
        componentNames = componentName;
    }

    let parent = context.$parent;
    let name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
}

/**
 * @description 根据上下文向下寻找componentName
 */
export function findComponentDownward (context, componentName) {
    const childrens = context.$children;
    let children = null;

    if (childrens.length) {
        for (const child of childrens) {
            const name = child.$options.name;
            if (name === componentName) {
                children = child;
                break;
            } else {
                children = findComponentDownward(child, componentName);
                if (children) break;
            }
        }
    }
    return children;
}

/**
 * @description 根据上下文寻找componentName的兄弟节点
 */
export function findBrothersComponents (context, componentName, exceptMe = true) {
    let res = context.$parent.$children.filter(item => {
        return item.$options.name === componentName;
    });
    let index = res.findIndex(item => item._uid === context._uid);
    if (exceptMe) res.splice(index, 1);
    return res;
}

export const setRem = () => {
    const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let htmlDom = document.getElementsByTagName('html')[0];

    htmlDom.style.fontSize = htmlWidth / 15 + 'px';
};
