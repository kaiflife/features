import { setNativeValue } from './testHelpers'

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
  const emailInput = document.querySelector('input[name="email"]')

  if (!emailInput) {
    alert('Нужно перейти на страницу логина')
    return
  }

  const passwordInput = document.querySelector('input[name="password"]')
  const submitButton = document.querySelector('button[type="submit"]')

  const { email, password } = window.testLoginCase[testCaseName]

  await setNativeValue({ value: email, element: emailInput })
  await setNativeValue({ value: password, element: passwordInput })

  if (passwordInput.value === password && emailInput.value === email) {
    submitButton.click()
  } else {
    alert('Неверные значения у инпутов')
  }
}