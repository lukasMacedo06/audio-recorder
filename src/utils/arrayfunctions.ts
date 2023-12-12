export const orderArray = (array: [], field: string, bigger = true) => {
  if (!array) {
    return [];
  }

  let arraySorted = [];
  if (!bigger) {
    arraySorted = array.sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
  } else {
    arraySorted = array.sort((a, b) => {
      if (a[field] < b[field]) return 1;
      if (a[field] > b[field]) return -1;
      return 0;
    });
  }
  return arraySorted;
};
