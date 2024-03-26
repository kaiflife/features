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
  МодалкаПассажирПоискФамилия: {
    last_name: 'Экстра',
  },
  МодалкаПассажирПоискИмя: {
    first_name: 'Тест',
  },
  МодалкаПассажирПоискОтчество: {
    patronymic: 'Категория',
  },
  МодалкаПассажирПоискДеньРождения: {
    date_of_birth: '1995-08-16',
  },
  МодалкаПассажирИзменениеДанных: {
    last_name: 'Экстра',
    openEditPassenger: true,
    changePassengerAddress: true,
    confirmAddress: false,
    street: {
      search: 'Московская Большая ул.',
      index: 1,
    },
    building: {
      search: '3',
      index: 1,
    },
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

const testChangePassengerModal = async (openModalName = 'changePhonePassenger') => {
  testClickElement(openModalName);

  await testPromiseRequestLoading(() => !!testIdSelect('editPassengerModal'));

  const newPhoneElement = testIdSelect('changePhonePassengerInput');
  await asyncSetValue('changePhonePassengerInput', Number(removePhoneSymbols(newPhoneElement.value)) + 1);

  if (testGetMainCaseValue('changePassengerAddress')) {
    testClickElement('changeAddress');
    await asyncSetValue('street');
    await asyncSetValue('building');

    const confirmAddressButton = testClickElement('confirmAddress');

    if (testGetMainCaseValue('confirmAddress')) await testPromiseRequestLoading(() => !confirmAddressButton?.testid);
  }

  if (testGetMainCaseValue('shouldCreateRequest')) testClickElement('updatePassenger');
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

  if (testGetMainCaseValue('changePhonePassenger')) await testChangePassengerModal();

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

  await testPromiseRequestLoading();

  if (testGetMainCaseValue('openEditPassenger')) {
    await testChangePassengerModal('openEditPassenger');
  }
};

export const testRequest = async () => {
  const testCaseName = window.startedTestCaseName;

  if (testCaseName.includes('Создание')) return testCreateRequest();
  if (testCaseName.includes('Пассажир')) return testPassenger();

  return testCreateRequest();
};
