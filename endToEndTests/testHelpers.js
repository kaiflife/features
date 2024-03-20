export const isGlobalTest = !!localStorage.getItem('endToEndTests')
const testList = []
const testKeyboardTapTime = 300

export const bodyQuerySelector = (query) => document.body.querySelector(query)
export const scrollToElement = (element) => element?.scrolIntoView({ behavior: "smooth", block: "end", inline: "nearest" })

if (isGlobalTest) {
  window.activeTestButton = (testName) => bodyQuerySelector('#test-button').onclick = window[testName]
}

export const setNativeValue = async ({ element, value }) => {
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
      resolve()
    }, testKeyboardTapTime)
  })

  await delayPromise

}

export const testGetKeyboardKeys = async ({ keys, element }) => {
  const splitKeys = keys.split('')

  for await (const key of splitKeys) {
    const keyboardTapPromise = new Promise((resolve) => {
      setTimeout(() => {
        element.focus()
        element.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }))
        resolve()
      }, testKeyboardTapTime)
    })

    await keyboardTapPromise
  }
}

export const setGlobalTest = (testName, testCallback, testCase) => {
  if (isGlobalTest) {
    window[testName] = testCallback
    testList.push(testName)
    window.testList = testList
    window[`${testName}Case`] = testCase
  }
}