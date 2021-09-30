const MAX_TRIAL_SEARCH = 100;

export const updateSearchCount = () => {

    if (performance.now() - parseFloat(localStorage.getItem("timeNow")) > 5000) {
        localStorage.setItem("searchCount", parseInt(localStorage.getItem("searchCount")) + 1);
      }
  
    localStorage.setItem("timeNow", performance.now());

}

export const updateSearchCountDashboard = () => {

    localStorage.setItem("searchCount", parseInt(localStorage.getItem("searchCount")) + 1);

}

export const checkMaxSearchLimit = () => {

    if (localStorage.getItem("searchCount") >= MAX_TRIAL_SEARCH || !checkTrialStatus()) {
        localStorage.setItem("trial", "expired")
        return false;
    }
    return true;

}

export const checkTrialStatus = () => {
    if(localStorage.getItem("trial") === "expired") return false;
    return true;
}

export const trialSearchLeft = () => {

    const count =  Number(localStorage.getItem("searchCount"));
    if(count === null || count === undefined) return MAX_TRIAL_SEARCH;
    else return MAX_TRIAL_SEARCH - count;
}