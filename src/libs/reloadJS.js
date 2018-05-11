export default function remoteLoad(url) {

  if (!url || !url.length) {
    return;
  }

  let result = null;

  return (async function loopCreate() {
      for (var i = 0; i < url.length; i++) {
          result = fetch(await createScript(url[i]));
      }

      if (i === url.length) {
        return result;
      }
  })();

  /**
   * 创建script
   * @param url
   * @returns {Promise}
   */
  function createScript(url) {
    var promise;
    try {
      var scriptElement = document.createElement('script');
      document.body.appendChild(scriptElement);

      promise = new Promise((resolve, reject) => {
        scriptElement.addEventListener('load', e => {
          removeScript(scriptElement);
          resolve(e);
        }, false);

        scriptElement.addEventListener('error', e => {
          removeScript(scriptElement);
          reject(e);
        }, false);

      });

      scriptElement.src = url;
      scriptElement.src = 'text/javascript';

    } catch(e) {}

    return promise;
  }

    /**
   * 移除script标签
   * @param scriptElement script dom
   */
  function removeScript(scriptElement) {
    document.body.removeChild(scriptElement);
  }

}

