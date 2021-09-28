export const findRevisionInterval = (solvedDate) => {

    const today = new Date();
    const todayDate = [ today.getFullYear(), today.getMonth() + 1, today.getDate()];
    if(solvedDate === null) solvedDate = [...todayDate];

    const revisionInterval = (todayDate[0] - solvedDate[0]) * 365 + (todayDate[1] - solvedDate[1]) * 30 + (todayDate[2] - solvedDate[2]);

    return revisionInterval;
}

export const hasRevisedChecker = (solvedDate, revisionCount) => {

    const revisionInterval = findRevisionInterval(solvedDate);

    if (revisionInterval > 2 && revisionCount < 1) return false;
    else if (revisionInterval > 7 && revisionCount < 2)
      return false;
    else if (revisionInterval > 15 && revisionCount < 3)
      return false;
    else if (revisionInterval > 35 && revisionCount < 4)
      return false;

    return true;

}