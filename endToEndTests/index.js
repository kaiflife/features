import { setGlobalTest } from './testHelpers';
import { testLogin, testLoginCase } from './testLogin';

setGlobalTest('testLogin', testLogin, testLoginCase)