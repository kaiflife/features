import { testIdSelect, asyncSetValue } from './testHelpers';

export const testLoginCase = {
  Ошибка: {
    username: 'qwe',
    password: 'qwe',
  },
  Успех: {
    username: 'email@mail.com',
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
