import httpRequest from '../libs/request';

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
    };
    return httpRequest('/unified-wap/conf/list', data, config);
};

/**
 *  获取组件接口
 */
export const fetchRobotIndexApi = ({ query, simulateId }) => {
    const config = { dataType: 'json', type: 'get' };
    const data = {
        tag: '',
        query,
        simu_id: simulateId,
        appName: '',
        logid: `jgy_${String(Math.random()).slice(2)}`,
    };
    return httpRequest('/index/robotindex/', data, config);
};
