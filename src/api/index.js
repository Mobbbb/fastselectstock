import httpRequest from '../libs/request';

const { host } = window.location;

let baseUrl = '';
if (host.indexOf('ceshiai.iwencai.com') > -1 || host.indexOf('testm.10jqka.com.cn') > -1) {
    baseUrl = '/unifiedwap';
}

let proUrl = '//ai.iwencai.com';
if (process.env.NODE_ENV !== 'production') { // 开发环境走本地
    proUrl = '';
}

/**
 *  展开概念、行业，获取子选项
 */
export const fetchExpandApi = (url) => {
    const config = { dataType: 'json', type: 'get' };
    return httpRequest(url, {}, config);
};

/**
 *  获取平台配置信息接口
 */
export const fetchConfigListsApi = (type) => {
    const config = { dataType: 'json', type: 'get' };
    const data = {
        type,
        source: 'ths_mobile_iwencai',
    };
    return httpRequest(baseUrl + '/unified-wap/conf/list', data, config);
};

/**
 *  获取结果页组件接口
 */
export const fetchRobotIndexApi = ({ query, simulateId }) => {
    const config = { dataType: 'json', type: 'get' };
    const data = {
        tag: '股价较低优质公司',
        query,
        simu_id: simulateId,
    };
    return httpRequest(proUrl + '/index/robotindex/', data, config);
};
