import moment from "moment-timezone";

export const UTCformat = async(date) => {
    const receivedDate = new Date(moment(date).format('YYYY-MM-DD'))
    const utc = new Date(
        receivedDate.getUTCFullYear(),
        receivedDate.getUTCMonth(),
        receivedDate.getDate(),
        4,0,0
    )
    return utc.toISOString();
}
export const UTCend = async(date) => {
    const receivedDate = new Date(date)
    const utc = new Date(
        receivedDate.getUTCFullYear(),
        receivedDate.getUTCMonth(),
        receivedDate.getDate() +1,
        3,59,0
    )
    return utc.toISOString();
}
