import {
  asyncSetValue,
} from './testHelpers';

export const testSortRequestCase = {
  ПоidНачинаяCНовых: {
    sortRequest: 'По id начиная с новых',
  },
  ПоidНачинаяCПервого: {
    sortRequest: 'По id начиная с первого',
  },
  ПоВремениПодачиПовозрастанию: {
    sortRequest: 'По времени подачи (по возрастанию)',
  },
  ПоВремениПодачиПоУбыванию: {
    sortRequest: 'По времени подачи (по убыванию)',
  },
  ПоФамилииКлиентаОтАдоЯ: {
    sortRequest: 'По фамилии клиента (А-Я)',
  },
  ПоФамилииКлиентаОтЯдоА: {
    sortRequest: 'По фамилии клиента (Я-А)',
  },
};

export const testSortRequest = async () => {
  await asyncSetValue('sortRequest');
};
