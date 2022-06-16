export const changeArrayById = ({ array, id, changeObjectFieldsFunc }) => {
  const cloneArray = array.slice();
  const index = cloneArray.findIndex(item => item.id === id);
  const newData = { ...cloneArray[index] };
  changeObjectFieldsFunc(newData);
  cloneArray.splice(index, 1, newData);
  return cloneArray;
};