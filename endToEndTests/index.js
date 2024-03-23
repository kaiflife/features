/* eslint-disable prefer-destructuring */
import {
  changeTestGeneralData,
  getEnumsFromArray, isGlobalTest, setGlobalTest, testDataBaseName,
} from './testHelpers';
import { testLogin, testLoginCase } from './testLogin';
import { testReport, testReportCase } from './testReport';
import { testRequest, testRequestCase } from './testRequest';
import { testSortRequest, testSortRequestCase } from './testSortRequest';

const testFile1Pdf = require('./testFile1.pdf');

if (isGlobalTest) {
  window[testDataBaseName].phones = getEnumsFromArray(['6633214011', '9536478523', '9654123985', '9101111111', '3333333334']);
  window[testDataBaseName].comments = getEnumsFromArray(['test123']);

  changeTestGeneralData({
    'phone-input': window[testDataBaseName].phones['6633214011'],
    comment: window[testDataBaseName].comments.test123,
    shouldCreateRequest: false,
    reverseAddress: false,
    time: '10:50',
    file: testFile1Pdf,
    vehicleTypeId: { index: 1 },
    format: { index: 1 },
    reportStartDate: {
      min: true,
    },
    reportEndDate: {
      max: true,
    },
    convoy: true,
    isGroupRequest: false,
    isDirection: false,
    changePhonePassenger: false,
    endpoint_type: { index: 2 },
    vehicle_type: 'Специальное ТС',
    endpoint: { index: 3 },
  });
}

setGlobalTest('тестЛогина', testLogin, testLoginCase);
setGlobalTest('тестЗаявки', testRequest, testRequestCase);
setGlobalTest('тестОтчёта', testReport, testReportCase);
setGlobalTest('тестСортировкаЗаявки', testSortRequest, testSortRequestCase);
