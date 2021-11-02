const fs = require("fs");

const validateCoupon = (code) => {

    const couponsJsonString = fs.readFileSync(__dirname + "/../cached_data/sub_coupons.json");
    const couponsJson = JSON.parse(couponsJsonString);
    for(var i = 0; i < couponsJson.length; i++) {
        if(couponsJson[i].code === code) {
            return couponsJson[i];
        }
    }
    return null;
}

module.exports = validateCoupon;