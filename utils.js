/**
 * 简单发送ajax请求的方法
 *
 * @export
 * @param {any} url
 * @returns Promise
 */
export function request(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
        else reject(xhr.status);
      }
    };
    xhr.send(null);
  });
}

/**
 * 原样输出函数
 *
 * @export
 * @param {any} value
 * @returns value
 */
export function identity(value) {
  return value;
}

/**
 * 解析组件信息, 默认匹配 index.vue
 *
 * @export
 * @param {any} url
 * @returns url
 */
export function parseName(url) {
  var comp = url.match(/(.*?)([^/]+?)\/?(\.vue)?(\?.*|#.*|$)/);
  return comp[2];
}

/**
 * 解析相对路径
 *
 * @export
 * @param {any} baseURL
 * @param {any} url
 * @returns url
 */
export function resolveURL(baseURL, url) {
  if (url.substr(0, 2) === './' || url.substr(0, 3) === '../') {
    return baseURL + url;
  }
  return url;
}
