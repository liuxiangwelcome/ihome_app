const PARAM_LINK = '?'
const PARAM_SPLIT = '&'
const PARAM_EQUAL = '='

const METHOD_GET = 'GET'
const METHOD_POST = 'POST'
const METHOD_POSTJSON = 'POSTJSON'
const REQUEST_TYPE_JSON = 'json'
const REQUEST_HEADER_CONTENT_TYPE_COMMON = 'application/x-www-form-urlencoded'
const REQUEST_HEADER_CONTENT_TYPE_JSON = 'application/json'

const RESPONSE_SUCCESS_CODE = '000000'

// 自定义判断元素类型JS
function toType (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull (o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

// 工具方法
function toParams (obj) {
    var param = ''
    for (const name in obj) {
        if (typeof obj[name] !== 'function') {
            param += PARAM_SPLIT + name + PARAM_EQUAL + encodeURI(obj[name])
        }
    }
    return param.substring(1)
}

/**
 * 封装网络请求
 * 1.规定消息头
 * 2.规定响应格式为JSON
 * 3.规定成功，失败统一处理
 * 4.请求超时处理
 * 5.
 */
function apiStream (method, url, params, success, failure) {
    // 过滤参数
    if (params && (method === METHOD_GET || method === METHOD_POST)) {
        params = filterNull(params)
    }
    var modal = weex.requireModule('modal')
    const stream = weex.requireModule('stream')

    var requestHeadersContentType = REQUEST_HEADER_CONTENT_TYPE_COMMON
    var requestURL = url
    var requestBody = ''

    if (method === METHOD_GET) {
        var up = toParams(params)
        requestURL = url + (up ? PARAM_LINK + up : '')
    } else if (method === METHOD_POST) {
        requestBody = toParams(params)
    } else if (method === METHOD_POSTJSON) {
        requestHeadersContentType = REQUEST_HEADER_CONTENT_TYPE_JSON
        requestBody = encodeURI(JSON.stringify(params))
    }

    stream.fetch({
        method: method,
        type: REQUEST_TYPE_JSON,
        headers: {'Content-Type': requestHeadersContentType},
        url: requestURL,
        body: requestBody
    }, function (resp) {
        if (resp.ok) {
            if (resp.data.code === RESPONSE_SUCCESS_CODE) {
                if (success) {
                    success(resp.data)
                }
            } else {
                // 业务请求异常
                console.log('request err %s , body %s', requestURL, requestBody)
                console.log('response body %s', JSON.stringify(resp))
                if (failure) {
                    failure(resp.data)
                }
            }
        } else {
            // 网络请求异常
            console.log('network connect err %s , body %s', requestURL, requestBody)
            console.log('response body %s', JSON.stringify(resp))
            modal.toast({
                message: '请求失败,请检查网络!',
                duration: 2
            })
        }
    }, function (progress) {
            if (progress.readyState === 1) {
                modal.toast({
                    message: 'readyState==1',
                    duration: 2
                })
            }
    })
}

// 返回在vue模板中的调用接口
export default {
    /**
     * 参数拼接到URL后，URL中不能含有?问号，拼接由系统完成，格式为：?key=value&key=value
     * 服务端使用@Param读取参数
     * get方式不支持body
     * 请求的消息头格式为：Content-Type : application/x-www-form-urlencoded
     * @param url
     * @param params    key:value
     * @param success
     * @param failure
     * @return 返回JSON格式数据
     */
    get: function (url, params, success, failure) {
        return apiStream(METHOD_GET, url, params, success, failure)
    },
    /**
     * 格式为：?key=value&key=value，请求数据写入body中
     * 服务端使用@Param读取参数
     * 请求的消息头格式为：Content-Type : application/x-www-form-urlencoded
     * @param url
     * @param params    key:value
     * @param success
     * @param failure
     * @return 返回JSON格式数据
     */
    post: function (url, params, success, failure) {
        return apiStream(METHOD_POST, url, params, success, failure)
    },
    /**
     * 将params格式化为json字符串，请求数据写入body中
     * 服务端使用@RequestBody读取和转换
     * 请求的消息头格式为：Content-Type : application/json
     * @param url
     * @param params    JSON对象
     * @param success
     * @param failure
     * @return 返回JSON格式数据
     */
    postJSON: function (url, params, success, failure) {
        return apiStream(METHOD_POSTJSON, url, params, success, failure)
    }
}
