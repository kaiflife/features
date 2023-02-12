// form example
// { firstName: 'Test', secondName: 'Second Test' }

// use case: create you own rule, with custom name, error text and validFunction
// valid function should return true if no error
// customRules EXAMPLE
// [
//  {name: 'firstName', text: 'First name too low', valid: (item) => item.firstName.length > 3},
//  {name: 'password', text: 'Password too low', valid: (item) => item.password.length > 10}
// ]

// use case: apply to every form field
// generalRules example
// ['empty', 'null', 'customRule'],

// use case: array of input fields, that will not be checked
// ignoreInputs example
// ['secondName']

// use case: rules only for one field
// inputRule example
// { firstName: ['empty', 'null', 'newRule'] }

// use case: use only custom rules
// onlyCustomRules example
// ['firstName']

// localRuleTemplate object
// you can use these templates to validate your value
// inputRule: { phoneNumber: ['phone'] }
// customRule: { name: 'phone', text: 'Phone is wrong' },

// checkOnlyFields array
// check only fields in array
// checkOnlyFields: ['phone']

import { validateEmail } from './validateEmail';
import { removeMaskSymbols } from './stringHelper';
import { PHONE_LENGTH } from '../constants';
import { validationPassword } from './validationPassword';
import { EGRZ_MASK_LENGTH } from '../components/Inputs/EgrzInput';
import { isObject } from './objectHelper';

export const ERROR_REQUIRED_FIELD = 'Обязательное поле';

export const HAS_REQUIRED_FIELDS_TEXT = 'Есть не заполненные поля';

export const VALIDATION_TEMPLATE = {
  email: 'email',
  phone: 'phone',
  egrzMask: 'egrzMask',
  password: 'password',
  password_confirmation: 'password_confirmation',
  old_password: 'old_password',
  inn: 'inn',
  selector: 'selector',
};

const VALIDATION_ERROR = {
  password: 'Пароль должен состоять из 6 символов',
  array: 'Нужно выбрать хотя бы одно значение',
  email: 'Неверно введена электронная почта',
  phone: 'Номер телефона набран неверно',
  egrzMask: 'ЕГРЗ ТС (Номер ТС) набран неверно',
  inn: 'ИНН набран неверно',
  password_confirmation: 'Пароли не совпадают',
};

export const INN_LENGTH = 12;
export const INN_LEGAL_LENGTH = 10;

const localRuleTemplate = {
  email: {
    valid: validateEmail,
    text: VALIDATION_ERROR.email,
  },
  array: {
    valid: (item) => Array.isArray(item) && Boolean(item.length),
    text: VALIDATION_ERROR.array,
  },
  phone: {
    valid: (item) => removeMaskSymbols(item)?.length === PHONE_LENGTH,
    text: VALIDATION_ERROR.phone,
  },
  egrzMask: {
    valid: (item) => removeMaskSymbols(item)?.length === EGRZ_MASK_LENGTH,
    text: VALIDATION_ERROR.egrzMask,
  },
  inn: {
    valid: (item, { subject_type }) => {
      const innLength = removeMaskSymbols(String(item))?.length;
      if ((typeof subject_type === 'string' ? subject_type : subject_type?.code) === 'legal_entity' && innLength === INN_LEGAL_LENGTH) {
        return true;
      }

      if (innLength === INN_LENGTH) return true;
    },
    text: VALIDATION_ERROR.inn,
  },
  password: {
    valid: validationPassword,
    text: VALIDATION_ERROR.password,
  },
  password_confirmation: {
    valid: (password_confirmation, { password }) => password_confirmation === password,
    text: VALIDATION_ERROR.password_confirmation,
  },
  selector: {
    text: ERROR_REQUIRED_FIELD,
    valid: (item) => item.value !== undefined && item.value !== '',
  },
};

export const formValidator = ({
  form = {},
  ignoreInputs = [],
  checkOnlyFields = [],
  customRules = [],
  onlyCustomRules = [],
  generalRules = ['empty'],
  inputRule = {},
}) => {
  const mainValidField = {};
  let hasErrors = false;
  Object.keys(form).forEach((fieldName) => {
    if (!ignoreInputs?.includes?.(fieldName)) {
      const addErrors = (checkedForm, validField, name) => {
        if (!checkOnlyFields.length || checkOnlyFields.includes(name)) {
          validField[name] = '';
          const formValue = checkedForm[name];
          const notOnlyCustom = !onlyCustomRules.includes(name);
          if (notOnlyCustom && (generalRules?.includes('empty') || inputRule[name]?.includes('empty'))) {
            if (formValue === undefined || formValue === '' || formValue === false) {
              validField[name] = ERROR_REQUIRED_FIELD;
              hasErrors = true;
            }
          }
          if (notOnlyCustom && (generalRules?.includes('null') || inputRule[name]?.includes('null'))) {
            if (formValue === null) {
              validField[name] = ERROR_REQUIRED_FIELD;
              hasErrors = true;
            }
          }

          customRules.forEach(({ text, name: ruleName, valid }) => {
            if (inputRule[name]?.includes(ruleName)) {
              let additionalRuleValid;

              if (localRuleTemplate[ruleName] !== undefined) {
                additionalRuleValid = localRuleTemplate[ruleName].valid(formValue, checkedForm);
              } else {
                additionalRuleValid = valid(formValue, checkedForm);
              }

              if (!additionalRuleValid) {
                validField[name] = text
                  || localRuleTemplate[ruleName]?.text
                  || ERROR_REQUIRED_FIELD;

                hasErrors = true;
              }
            }
          });
        }
      };

      if (isObject(form[fieldName])) {
        const hasDeepObject = Object.values(form[fieldName]).some((item) => isObject(item));
        if (!hasDeepObject) {
          mainValidField[fieldName] = {};
          Object.keys(form[fieldName]).forEach((innerFieldName) => {
            addErrors(form[fieldName], mainValidField[fieldName], innerFieldName);
          });
        }
      } else {
        addErrors(form, mainValidField, fieldName);
      }
    }
  });
  return { validField: mainValidField, hasErrors };
};
