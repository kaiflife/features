export const getParamsFromObject = (object) => {
  let stringParams = "";
  let count = 0;
  for (const key in object) {
    const isFirstValue = count === 0 ? "?" : "";
    stringParams += `${isFirstValue}${key}=${object[key]}&`;
  }
  return stringParams.slice(0, stringParams.length - 1);
};