type Datum = {
  [k: string]: any;
};

/**
 * @param arr Array of objects
 * @param key key to group by
 */
export function groupBy(arr: Datum[], key: string) {
  const groupedObject: Datum = {};
  for (let obj of arr) {
    const value = obj[key];
    if (!groupedObject[value]) {
      groupedObject[value] = [];
    }
    groupedObject[value].push(obj);
  }
  return groupedObject;
}
