require('dotenv').config();

const config = {
  verifyTokenUrl: process.env.PUBLIC_API_VERIFYTOKEN,
  referralDataUrl: process.env.PUBLIC_API_REFERRAL,
  permaCodesCreateUrl: process.env.PUBLIC_API_PERMACODE_CREATE,
};

// console.log(config);

module.exports = config;
