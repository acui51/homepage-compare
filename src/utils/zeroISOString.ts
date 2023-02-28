export const zeroISOString = (isoString: string): string => {
  const formattedDate = new Date(isoString);
  formattedDate.setMinutes(0);
  formattedDate.setSeconds(0);
  formattedDate.setMilliseconds(0);
  return formattedDate.toISOString();
};
