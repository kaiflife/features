/* eslint-disable prefer-destructuring */
import {
  getEnumsFromArray, isGlobalTest, setGlobalTest,
} from './testHelpers';
import { testLogin, testLoginCase } from './testLogin';
import { testReport, testReportCase } from './testReport';
import { testRequest, testRequestCase } from './testRequest';

const testFile1Pdf = require('./testFile1.pdf');

if (isGlobalTest) {
  window.testDataBase.phones = getEnumsFromArray(['6633214011', '9536478523', '9654123985', '9101111111', '3333333334']);
  window.testDataBase.comments = getEnumsFromArray(['test123']);

  window.testGeneralData = {
    'phone-input': window.testDataBase.phones['6633214011'],
    comment: window.testDataBase.comments.test123,
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
    ...window.testGeneralData,
  };
}

setGlobalTest('testLogin', testLogin, testLoginCase);
setGlobalTest('testRequest', testRequest, testRequestCase);
setGlobalTest('testReport', testReport, testReportCase);
