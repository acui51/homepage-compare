type Datum = {
  [k: string]: any;
};

/**
 * @param arr Array of objects
 * @param key key to group by
 */
export function groupByKey(arr: Datum[], key: string) {
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

export function groupByDate(obj: Datum) {
  const groupedObject: Datum = {};
  for (let key of Object.keys(obj)) {
    const arr = obj[key];
    const group: Datum = {};
    for (let a of arr) {
      const formattedDate = new Date(a.created_at);
      formattedDate.setMinutes(0);
      formattedDate.setSeconds(0);
      formattedDate.setMilliseconds(0);
      const formattedDateISO = formattedDate.toISOString();
      if (!group[formattedDateISO]) {
        group[formattedDateISO] = [];
      }
      group[formattedDateISO].push(a);
    }
    groupedObject[key] = group;
  }
  return groupedObject;
}
