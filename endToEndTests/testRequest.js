import { removePhoneSymbols } from '../helpers';
import {
  testIdSelect,
  asyncSetValue,
  testPromiseRequestLoading,
  testGetMainCaseValue,
  testClickElement,
  getTestDate,
  testMonth,
} from './testHelpers';

export const testRequestCase = {
  Создание: {
    shouldCreateRequest: true,
  },
  СозданиеПоменятьАдрес: {
    reverseAddress: true,
  },
  СозданиеСледМесяц: {
    date: getTestDate({ month: testMonth + 1 }),
  },
  СозданиеНетСопровождающего: {
    convoy: false,
  },
  ПассажирПоискФамилия: {
    last_name: 'Экстра',
  },
  ПассажирПоискИмя: {
    first_name: 'Тест',
  },
  ПассажирПоискОтчество: {
    patronymic: 'Категория',
  },
  ПассажирПоискДеньРождения: {
    date_of_birth: '1995-08-16',
  },
  СозданиеДети1Группы: {
    'phone-input': '9654123985',
  },
  СозданиеДети2и3Группы: {
    'phone-input': '9536478523',
  },
  СозданиеДети3ОСТ: {
    'phone-input': '9101111111',
  },
  СозданиеГемодиализ: {
    'phone-input': '3333333334',
  },
  СозданиеГемодиализВГруппе: {
    'phone-input': '3333333334',
    isGroupRequest: true,
  },
  СозданиеГемодиализВГруппеПоездкаИзОСЗДомой: {
    'phone-input': '3333333334',
    isGroupRequest: true,
    isDirection: true,
  },
  СозданиеГемодиализВГруппеСменаТелефонаПассажира: {
    'phone-input': '3333333334',
    isGroupRequest: true,
    changePhonePassenger: true,
  },
};

const testOpenCreateRequestModal = () => {
  const button = testIdSelect('create-button');

  if (!button) {
    alert('Нужно перейти на страницу заявок');
    return;
  }

  button.click();
};

const testChangePhonePassenger = async () => {
  testClickElement('changePhonePassenger');

  const newPhoneElement = testIdSelect('changePhonePassengerInput');
  await asyncSetValue('changePhonePassengerInput', Number(removePhoneSymbols(newPhoneElement.value)) + 1);

  testClickElement('updatePassenger');
};

const testFindRequestPassenger = async () => {
  testOpenCreateRequestModal();
  await testPromiseRequestLoading();

  await asyncSetValue('phone-input');

  testClickElement('phone-search-button');

  await testPromiseRequestLoading();
};

const testFullFillRequest = async () => {
  await testFindRequestPassenger();

  if (testGetMainCaseValue('isGroupRequest') !== undefined) await asyncSetValue('isGroupRequest');

  await asyncSetValue('isDirection');

  if (testGetMainCaseValue('changePhonePassenger')) await testChangePhonePassenger();

  await asyncSetValue('convoy');
  await asyncSetValue('vehicle_type');

  const date = testGetMainCaseValue('date');
  const time = testGetMainCaseValue('time');

  if (date) await asyncSetValue('date');
  if (time) await asyncSetValue('time');

  await asyncSetValue('endpoint_type');
  await asyncSetValue('endpoint');

  const reverseAddressButton = testIdSelect('reverse-address');

  if (testGetMainCaseValue('reverseAddress')) reverseAddressButton.click();

  await asyncSetValue('comment');

  await asyncSetValue('file');
};

const testCreateRequest = async () => {
  await testFullFillRequest();

  if (testGetMainCaseValue('shouldCreateRequest') === false) return;

  const createCardRequest = testIdSelect('create-card-request');
  createCardRequest.click();
};

const testPassenger = async () => {
  testOpenCreateRequestModal();

  if (testGetMainCaseValue('last_name')) await asyncSetValue('last_name');
  if (testGetMainCaseValue('first_name')) await asyncSetValue('first_name');
  if (testGetMainCaseValue('patronymic')) await asyncSetValue('patronymic');
  if (testGetMainCaseValue('date_of_birth')) await asyncSetValue('date_of_birth');

  testClickElement('search-passenger-button');
};

export const testRequest = async () => {
  const testCaseName = window.startedTestCaseName;

  if (testCaseName.includes('Создание')) return testCreateRequest();
  if (testCaseName.includes('Пассажир')) return testPassenger();

  return testCreateRequest();
};
