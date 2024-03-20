export const isGlobalTest = !!localStorage.getItem('endToEndTests');
const testList = [];
const testKeyboardTapTime = 300;

export const testIdSelector = (elementName = '', testId = '') => document.body
  .querySelector(`${elementName}${testId ? `[testId="${testId}"]` : ''}`);

export const scrollToElement = (element) => element?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
export const testIsRequestLoading = testIdSelector('div', 'backdrop-loader')?.ariaHidden === false;

export const testPromiseRequestLoading = async (condition = testIsRequestLoading) => {
  let intervalTimer;

  const promise = new Promise((resolve) => {
    intervalTimer = setInterval(() => {
      if (typeof condition === 'function') {
        if (condition()) resolve();
      } else if (!condition) resolve();
    }, 1000);
  });

  await promise;

  clearInterval(intervalTimer);

  console.log('loaded');

  return promise;
};

export const asyncSetValue = async ({ element, value }) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));

  const delayPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, testKeyboardTapTime);
  });

  await delayPromise;
};

export const setGlobalTest = (testName, testCallback, testCase) => {
  if (isGlobalTest) {
    window[testName] = testCallback;
    testList.push(testName);
    window.testList = testList;
    window[`${testName}Case`] = testCase;
  }
};
