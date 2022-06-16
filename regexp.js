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