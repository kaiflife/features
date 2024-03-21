export const isGlobalTest = !!localStorage.getItem('endToEndTests');
// for React library we need to add SyntethicEvent
const event = document.createEvent('HTMLEvents');

const testList = [];
const testKeyboardTapTime = 300;
const getFileType = (type) => {
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('doc')) return 'doc';
  if (type.includes('docx')) return 'docx';
  if (type.includes('txt')) return 'txt';
  if (type.includes('png')) return 'png';
  if (type.includes('jpg')) return 'jpg';
  if (type.includes('jpeg')) return 'jpeg';
  if (type.includes('xlsx')) return 'xlsx';

  return 'txt';
};

export const testIdSelect = (elementName = '', testId = '') => document.body
  .querySelector(`${elementName}${testId ? `[testId="${testId}"]` : ''}`);

export const scrollToElement = (element) => element?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
export const testIsRequestLoading = testIdSelect('div', 'backdrop-loader')?.ariaHidden === false;

export const testFindChildNode = (element, searchItem) => {
  const arrayFromChildNodes = Array.from(element.childNodes);
  let foundChild;

  if (searchItem?.index !== undefined) {
    foundChild = arrayFromChildNodes.find((_, index) => (index + 1) === searchItem.index);
  } else {
    foundChild = arrayFromChildNodes.find((item) => {
      const lowerCaseItem = item?.dataset?.value?.toLowerCase?.();

      return lowerCaseItem?.includes?.(searchItem.toLowerCase());
    });
  }

  if (!foundChild) foundChild = element.firstChild;

  return foundChild;
};

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

export const asyncSetValue = async (element, value) => {
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

export const testAddFiles = async (fileLink, inputElement) => {
  const file = await fetch(fileLink);

  const blobFile = await file.blob();

  const dt = new DataTransfer();
  dt.items.add(new File([blobFile], `testFile.${getFileType(blobFile.type)}`, { type: blobFile.type }));
  const file_list = dt.files;

  inputElement.files = file_list;

  event.initEvent('change', true, false);

  inputElement.dispatchEvent(event);
};

export const setGlobalTest = (testName, testCallback, testCase) => {
  if (isGlobalTest) {
    window[testName] = testCallback;
    testList.push(testName);
    window.testList = testList;
    window[`${testName}Case`] = testCase;
  }
};
