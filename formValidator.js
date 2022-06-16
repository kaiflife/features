// form example
// { firstName: 'Test', secondName: 'Second Test' }

// use case: create you own rule, with custom name, error text and validFunction
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
// inputRules example
// { firstName: ['empty', 'null', 'newRule'] }

const requiredField = "Обязательное поле";

export const formValidator = ({
  form = {},
  ignoreInputs = [],
  customRules = [],
  generalRules = ["empty"],
  inputRules = {},
}) => {
  const validFields = {};
  let hasErrors = false;
  for (const name in form) {
    if (!ignoreInputs.includes(name)) {
      validFields[name] = "";
      if (generalRules?.includes("empty") || inputRules[name]?.includes("empty")) {
        if (form[name] === undefined || form[name] === "") {
          validFields[name] = requiredField;
          hasErrors = true;
        }
      }
      if (generalRules?.includes("null") || inputRules[name]?.includes("null")) {
        if (form[name] === null) {
          validFields[name] = requiredField;
          hasErrors = true;
        }
      }

      customRules.forEach((rule) => {
        if (inputRules[name]?.includes(rule.name)) {
          const additionalRuleValid = rule.valid(form[name]);
          if (!additionalRuleValid) {
            validFields[name] = rule.text || requiredField;
            hasErrors = true;
          }
        }
      });
    }
  }
  return { validFields, hasErrors };
};
