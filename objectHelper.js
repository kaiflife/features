export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return !isArray(value) && value !== null && !(value instanceof Date) && typeof value === 'object';
}

export function getParamsFromObject({ object }) {
  let stringParams = '';
  let count = 0;

  Object.keys(object).forEach((key) => {
    if (count === 0) stringParams = '?';

    count += 1;
    stringParams += `${key}=${object[key]}&`;
  });
  return stringParams.slice(0, stringParams.length - 1);
}

// example 1:
// object { prop1: { prop2: { prop3: 'value' }}}
// field 'prop1.prop2.prop3'
// value 'changedValueString'
// return '{ prop1: { prop2: { prop3: 'changedValueString' }}}
//
// example 2:
// object { a: 10 }
// field: 'prop1.prop2.prop3'
// value 'someValue'
// return '{ a: 10, prop1: { prop2: { prop3: 'someValue' }}
//
// example 3:
// object: object = { prop2: [ { prop3: [ { prop5: '1' } ] }, { prop4: [ { prop6: '2' } ] ] }
// field: 'object.prop2.0.prop3
// value: 'someValue'
// return { prop2: [ { prop3: 'someValue' } ] }
//
// example 4:
// object: array = [ { prop1: [ { prop2: '1' } ] } ]
// field: 'array.0.prop1.0.prop2
// value: 'someValue'
// return [ { prop1: [ { prop2: 'someValue' } ] } ]

export function objectChangeDotProperty({ field, value, object }) {
  const cloneObject = Array.isArray(object) ? [...object] : { ...object };

  const splitProperties = field.includes('.') && field.split('.');

  if (Array.isArray(splitProperties)) {
    let newValue;

    splitProperties.forEach((fieldName, index) => {
      const isFirstIndex = index === 0;
      const middleIndex = !isFirstIndex && index !== splitProperties.length - 1;

      if (isFirstIndex) {
        if (cloneObject[fieldName] === undefined) {
          newValue = {};
          cloneObject[fieldName] = newValue;
        } else if (isArray(cloneObject[fieldName])) {
          newValue = cloneObject[fieldName].slice();
          cloneObject[fieldName] = newValue;
        } else {
          newValue = { ...cloneObject[fieldName] };
          cloneObject[fieldName] = newValue;
        }
      } else if (middleIndex) {
        if (isObject(newValue[fieldName])) {
          newValue = newValue[fieldName];
        } else if (isArray(newValue[fieldName])) {
          newValue = newValue[fieldName];
        } else {
          newValue[fieldName] = {};
          newValue = newValue[fieldName];
        }
      } else newValue[fieldName] = value;
    });
  } else {
    cloneObject[field] = value;
  }

  return cloneObject;
}

export const getObjectValuesByField = (initialObject, object) => {
  const valuesObject = {};

  Object.keys(initialObject).forEach((field) => {
    valuesObject[field] = object[field];
  });

  return valuesObject;
};


export const objectClearEmptyProps = (object, includeNull) => {
  const newObject = {};
  for (const prop in object) {
    const objectProp = object[prop];
    if ((objectProp !== undefined && objectProp !== "") || objectProp === 0 || (includeNull && objectProp === null)) {
      newObject[prop] = objectProp;
    }
  }

  return newObject;
};
