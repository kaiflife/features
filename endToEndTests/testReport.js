import {
  asyncSetValue,
  testClickElement,
  testIdSelect,
} from './testHelpers';

export const testReportCase = {
  СправкаРасчёт2602: {
    reportType: '26.02.2024',
  },
  СправкаРасчёт0104: {
    reportType: '01.04.2022',
  },
  Реестр: {
    reportType: 'Реестр',
  },
  ЛьготныеКатегории: {
    reportType: 'По льготным',
  },
  СоцОбьект: {
    reportType: 'По соц.',
  },
};

const testOpenCreateReportModal = () => {
  const button = testIdSelect('createReportButton');

  if (!button) {
    alert('Нужно перейти на страницу заявок');
    return;
  }

  button.click();
};

export const testReport = async () => {
  testOpenCreateReportModal();

  await asyncSetValue('reportType');
  await asyncSetValue('vehicleTypeId');
  await asyncSetValue('format');
  await asyncSetValue('reportStartDate');
  await asyncSetValue('reportEndDate');

  testClickElement('createReportRequest');
};
