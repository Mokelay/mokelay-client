export default function remoteLoad(url) {

  if (!url || !url.length) {
    return;
  }

  return createScript(url.shift()).then(() => {
    return createScript(url.shift()).then(() => {
      return createScript(url.shift());
    });
  });

  
  /**
   * 创建script
   * @param url
   * @returns {Promise}
   */
  function createScript(urlV) {
    let promise;
    try {
      var scriptElement = document.createElement('script');
      document.body.appendChild(scriptElement);

      promise = new Promise((resolve, reject) => {
        scriptElement.addEventListener('load', e => {
            resolve(e);
        }, false);

        scriptElement.addEventListener('error', e => {
          reject(e);
        }, false);

      });
      
      scriptElement.src = urlV;
      scriptElement.src = 'text/javascript';

    } catch(e) {}

    return promise;
  }


}

