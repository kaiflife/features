import { testIdSelect, asyncSetValue } from './testHelpers';

export const testLoginCase = {
  failure: {
    email: 'qwe',
    password: 'qwe',
  },
  success: {
    email: 'email@mail.com',
    password: 'qwe2',
  },
};

export const testLogin = async () => {
  const emailInput = testIdSelect('username');

  if (!emailInput) {
    alert('Нужно перейти на страницу логина');
    return;
  }

  const submitButton = testIdSelect('login-submit');

  await asyncSetValue('username');
  await asyncSetValue('password');

  submitButton.click();
};
