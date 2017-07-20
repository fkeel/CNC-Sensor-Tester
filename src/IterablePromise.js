class IterablePromise {
  constructor(promiseFunction, ...params) {
    this.promiseFunction = function() {
      return promiseFunction(...params);
    };
  }

  getPromise() {
    return this.promiseFunction();
  }

  static iterate(iterablePromises) {
    return new Promise(resolve => {
      let promisesData = [];
      (function iterator(index) {
        const iterablePromise = iterablePromises[index++];
        iterablePromise.getPromise().then((data) => {
          promisesData.push(data);
          if (index < iterablePromises.length) {
            iterator(index);
          } else if (index === iterablePromises.length) {
            resolve(promisesData);
          }
        });
      })(0);
    });
  }

  static createMultiple(promiseFunction, paramsArray, contants) {
    return paramsArray.map(params => {
      return new IterablePromise(promiseFunction, ...params, ...contants);
    });
  }
}

export default IterablePromise;