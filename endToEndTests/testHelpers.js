const globalTestName = 'endToEndTests';
const testListName = 'тестЛист';
const testCaseFieldName = 'Сценарий';
export const testDataBaseName = 'тестБазаДанных';
export const testGeneralDataName = 'тестИспользуемыеДанные';

export const isGlobalTest = !!localStorage.getItem(globalTestName);

window.enableGlobalTest = () => {
  localStorage.setItem(globalTestName, true);
  window.location.reload();
};
window.disableGlobalTest = () => {
  localStorage.removeItem(globalTestName);
  window.location.reload();
};

// for React library we need to add SyntheticEvent
let event;
if (isGlobalTest) {
  event = document.createEvent('HTMLEvents');
  event.initEvent('change', true, false);

  // possible values for generalData
  window[testDataBaseName] = {};
  window[testListName] = [];

  // this values will take as default when case running for undefined value
  window[testGeneralDataName] = {
    testKeyboardTapTime: 300,
  };

  window.startedTestName = '';
  window.startedTestCaseName = '';
}
const testDate = new Date();
const addZeroToDate = (date) => (`00${String(date)}`).slice(-2);

export const testYear = testDate.getFullYear();
export const testMonth = testDate.getMonth() + 1;
export const testDay = testDate.getDate();
export const getTestDate = ({
  year = testYear,
  month = testMonth,
  day = testDay,
}) => `${year}-${addZeroToDate(month)}-${addZeroToDate(day)}`;

export const getEnumsFromArray = (array) => {
  const object = {};

  array.forEach((itemName) => {
    object[itemName] = itemName;
  });

  return object;
};

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

export const testIdSelect = (testId = '', elementName = '') => document.body
  .querySelector(`${elementName}${testId ? `[testId="${testId}"]` : ''}`);

export const scrollToElement = (element) => element?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
export const testIsRequestLoading = testIdSelect('backdrop-loader')?.ariaHidden === false;
export const testGetMainCaseValue = (field) => {
  const startedCaseName = `${window.startedTestName}${testCaseFieldName}`;
  const testCaseName = window.startedTestCaseName;

  if (window[startedCaseName][testCaseName][field] === undefined) {
    return window[testGeneralDataName][field];
  }

  return window[startedCaseName][testCaseName][field];
};

export const testClickElement = (testId, elementName) => {
  const element = testIdSelect(testId, elementName);

  element.click();
};

export const testFindChildNode = (element, searchItem) => {
  const arrayFromChildNodes = Array.from(element.childNodes);
  let foundChild;

  if (searchItem?.index !== undefined) {
    foundChild = arrayFromChildNodes.find((_, index) => (index + 1) === searchItem.index);
  } else {
    foundChild = arrayFromChildNodes.find((item) => {
      const lowerCaseItem = item?.outerText?.toLowerCase?.();

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
    }, window[testGeneralDataName].testKeyboardTapTime);
  });

  await promise;

  clearInterval(intervalTimer);

  return promise;
};

// work only with MUI selector and TextField select
export const testChangeSelectorValue = async (selectorName) => {
  const element = testIdSelect(selectorName, 'button');
  scrollToElement(element.parentElement);
  element.click();

  const list = document.querySelector(`ul[aria-labelledby="${selectorName}-label"]`);

  const foundChild = testFindChildNode(
    list,
    testGetMainCaseValue(selectorName),
  );

  foundChild.click();
  await testPromiseRequestLoading(() => !document.querySelector(`ul[aria-labelledby="${selectorName}-label"]`));
};

export const testAddFiles = async (fileLink, inputElement) => {
  const file = await fetch(fileLink);

  const blobFile = await file.blob();

  const dt = new DataTransfer();
  dt.items.add(new File([blobFile], `testFile.${getFileType(blobFile.type)}`, { type: blobFile.type }));
  const file_list = dt.files;

  inputElement.files = file_list;

  inputElement.dispatchEvent(event);
};

export const asyncSetValue = async (testId, newValue) => {
  const typeValue = 'value';

  const element = testIdSelect(testId);

  if (!element) return;

  let value = newValue || testGetMainCaseValue(testId);

  if (value?.min) value = element.min || getTestDate({});
  else if (value?.max) {
    value = element.max || getTestDate({ day: testDay + 1 });
  }

  if (element?.className?.toLocaleLowerCase?.()?.includes?.('selector')) {
    testChangeSelectorValue(testId);
  } else if (element.type === 'file') {
    testAddFiles(value, element);
  } else if (element.type === 'checkbox') {
    if (element.checked !== value) element.click();
  } else {
    const valueSetter = Object.getOwnPropertyDescriptor(element, typeValue).set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, typeValue).set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }

    // native event
    // element.dispatchEvent(new Event('input', { bubbles: true }));

    // React event
    element.dispatchEvent(event);
  }

  const delayPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, window[testGeneralDataName].testKeyboardTapTime);
  });

  await delayPromise;
};

export const setGlobalTest = (testName, testCallback, testCase) => {
  if (isGlobalTest) {
    Object.keys(testCase).forEach((caseName) => {
      window[`${testName}${caseName}`] = () => {
        window.startedTestName = testName;
        window.startedTestCaseName = caseName;
        testCallback();
      };
    });
    window[testListName].push(testName);
    window[`${testName}${testCaseFieldName}`] = testCase;
  }
};
