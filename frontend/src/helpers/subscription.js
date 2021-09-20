const TIMEPERIOD = 360;

const subscription = (payDate) => {

    if(payDate === null || payDate === undefined) return false;

    const dateArr = payDate.split("-");

    const today = new Date();
    const todayDate = [ today.getFullYear(), today.getMonth() + 1, today.getDate()];

    try {
        const interval = (todayDate[0] - dateArr[0])*365 + (todayDate[1] - dateArr[1])*30 + (todayDate[2] - dateArr[2]);
        console.log("interval : ", interval);
        return (interval <= TIMEPERIOD);
    }
    catch { return false; }
}

export default subscription;