import httpRequest from '../libs/request';

/**
 *  获取首页tab,请求结果页
 */
export const fetchExpandApi = (url) => {
    const config = { dataType: 'json', type: 'get' };
    return httpRequest(url, {}, config);
};
