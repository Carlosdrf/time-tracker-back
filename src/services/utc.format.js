import moment from "moment-timezone";

export const UTCStart = async (date) => {
  const receivedDate = new Date(date);
  const utc = new Date(
    Date.UTC(
      receivedDate.getUTCFullYear(),
      receivedDate.getUTCMonth(),
      receivedDate.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
  return utc.toISOString();
};
export const UTCend = async (date) => {
  const receivedDate = new Date(date);
  const utc = new Date(
    Date.UTC(
      receivedDate.getUTCFullYear(),
      receivedDate.getUTCMonth(),
      receivedDate.getUTCDate(),
      11,
      59,
      59,
      999
    )
  );
  return utc.toISOString();
};
export const UTCFormat = async (date) => {
  const receivedDate = new Date(moment(date).format("YYYY-MM-DD hh:mm:ss"));
  const utc = new Date(
    receivedDate.getUTCFullYear(),
    receivedDate.getUTCMonth(),
    receivedDate.getUTCDate(),
    receivedDate.getUTCHours(),
    receivedDate.getUTCMinutes(),
    receivedDate.getUTCSeconds()
  );
  return utc.toISOString();
};
