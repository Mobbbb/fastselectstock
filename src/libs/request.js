let $ = window.$
const httpRequest = (url, data = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            data,
            type: config.type || 'get',
            dataType: config.dataType || 'jsonp',
            xhrFields: { withCredentials: true },
            success: (result) => {
                if (typeof result === 'object' && !$.isEmptyObject(result)) {
                    if (config.wholeResult) {
                        resolve(result);
                    }
                    if (result.success || result.status_code == 0 || result.status_code == '0' || result.flag) {
                        let answer = null;
                        if (typeof result.answer !== 'undefined') {
                            answer = result.answer || null;
                        }
                        if (typeof result.data !== 'undefined') {
                            answer = result.data || null;
                        }
                        if (typeof result.result !== 'undefined') {
                            answer = result.result || null;
                        }
                        resolve(answer);
                    } else {
                        reject('服务器请求失败');
                    }
                } else {
                    reject('服务器无结果响应');
                }
            },
            error: (error) => {
                reject(error);
            },
        });
    }).catch(
        error => {
            console.log(error)
            return null;
        }
    )
};

export default httpRequest;
