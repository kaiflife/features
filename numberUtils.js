export const decimalToFloat = (string) => string && parseFloat(string.replace(",", "."));

export const isDecimalString = (string) => {
  if (!string) return;

  if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(string[string.length - 1])) {
    return;
  }
  return string;
};

export const fixedWithComma = (value, number) => value?.toFixed(number)?.replace(".", ",");

export const floatNumberToString = (number) => {
  let newNumberString = String(number);

  if (newNumberString.includes(".")) {
    newNumberString = newNumberString.replace(".", ",");
  } else {
    newNumberString += ",0";
  }

  return newNumberString;
};