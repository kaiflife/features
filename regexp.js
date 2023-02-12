export const nameSurnameRegex = (string) => {
  const regex = "^[A-Za-zА-Яа-яёЁ]+(?:[-'\\s][A-Za-zА-Яа-яёЁ]+)*$";
  return !!string.match(regex);
};

export const addressRegex = (string) => {
  const regex = "[А-Яа-яЁё]";
  return !!string.match(regex);
};

export const numberRegex = (string) => {
  const regex = "[0-9]";
  return !!string.match(regex);
};

export const emailRegex = (string) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !!string.toLowerCase().match(regex);
};

export function validateEmail(email) {
  const regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

  return regex.test(email);
}
