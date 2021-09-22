const subscription = (payDate) => {

    if(payDate === null || payDate === undefined) return 0;

    const dateArr = payDate.split("-");

    const today = new Date();
    const todayDate = [ today.getFullYear(), today.getMonth() + 1, today.getDate()];

    try {
        const interval = (dateArr[0] - todayDate[0])*365 + (dateArr[1] - todayDate[1])*30 + (dateArr[2] - todayDate[2]);
        console.log("interval : ", interval);
        return ( interval);
    }
    catch { return 0; }
}

export default subscription;