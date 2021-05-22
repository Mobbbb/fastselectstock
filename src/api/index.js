import httpRequest from '../libs/request';

/**
 *  展开，获取子选项
 */
export const fetchExpandApi = (url) => {
    const config = { dataType: 'json', type: 'get' };
    return httpRequest(url, {}, config);
};

/**
 *  获取列表接口
 */
export const fetchConfigListsApi = (type) => {
    const config = { dataType: 'json', type: 'get' };
    const data = {
        type,
    };
    return httpRequest('/list', data, config);
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
    return httpRequest('/components/', data, config);
};
