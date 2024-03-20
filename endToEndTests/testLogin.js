import { bodyQuerySelector, setNativeValue } from './testHelpers'

export const testLoginCase = {
  failure: {
    email: 'defusen2@gmail.com',
    password: 'qwe'
  },
  success: {
    email: 'defusen2@gmail.com',
    password: 'qwe2'
  }
}

export const testLogin = async (testCaseName = 'failure') => {
  console.log('testCaseName', testCaseName);
  const emailInput = bodyQuerySelector('input[name="email"]')

  if (!emailInput) {
    alert('Нужно перейти на страницу логина')
    return
  }

  const passwordInput = bodyQuerySelector('input[name="password"]')
  const submitButton = bodyQuerySelector('button[type="submit"]')

  const { email, password } = window.testLoginCase[testCaseName]

  await setNativeValue({ value: email, element: emailInput })
  await setNativeValue({ value: password, element: passwordInput })

  if (passwordInput.value === password && emailInput.value === email) {
    submitButton.click()
  } else {
    alert('Неверные значения у инпутов')
  }
}