export function isObject(value) {
  return !Array.isArray(value) && value !== null && typeof value === "object";
}

// example 1:
// field 'prop1.prop2.prop3'
// object { prop1: { prop2: { prop3: 'value' }}}
// value 'changedValueString'
// return '{ prop1: { prop2: { prop3: 'changedValueString' }}}
//
// example 2:
// field: 'prop1.prop2.prop3'
// object { a: 10 }
// value 'someValue'
// return '{ a: 10, prop1: { prop2: { prop3: 'someValue' }}

export function objectChangeDotProperty({ field, value, object }) {
  const cloneObject = { ...object };

  const splitProperties = field.includes(".") && field.split(".");

  if (Array.isArray(splitProperties)) {
    let newValue;

    splitProperties.forEach((fieldName, index) => {
      const middleIndex = index !== splitProperties.length - 1;
      const firstIndex = index === 0;

      if (firstIndex) {
        if (cloneObject[fieldName] === undefined) {
          newValue = {};
          cloneObject[fieldName] = newValue;
        } else {
          newValue = { ...cloneObject[fieldName] };
          cloneObject[fieldName] = newValue;
        }
      } else if (middleIndex) {
        if (isObject(newValue[fieldName])) {
          newValue = newValue[fieldName];
        } else {
          newValue[fieldName] = {};
          newValue = newValue[fieldName];
        }
      } else {
        newValue[fieldName] = value;
      }
    });
  } else {
    cloneObject[field] = value;
  }

  return cloneObject;
}

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