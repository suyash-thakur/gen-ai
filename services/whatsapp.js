const axios = require('axios')
const { DEV_PHONE_NUMBER } = process.env;
const parsePhoneNumber = require('libphonenumber-js');

// const getWhatsAppMessage = ({ event, trait }) => {
//   let message;
//   switch (event) {
//     case 'COURSE_SESSION_REMINDER': {
//       message = `This is a reminder that ${trait.sessionTitle} is coming up at ${trait.startTime}.\n Please join the session here: ${trait.meetingLink}`;
//       break;
//     }
//     default:
//       break;
//   }
//   return message;
// };

const getParsedNumber = (phoneNumber) => {
    const parsedNumber = parsePhoneNumber(phoneNumber);
    return {
        countryCode: `+${parsedNumber.countryCallingCode}`,
        number: parsedNumber.nationalNumber,
    };
};

const postRequest = async ({ url, data }) => {
    data = JSON.stringify(data);
    const config = {
        method: 'post',
        url,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
        },
        data,
    };
    try {
        await axios(config);
    } catch (err) {
        reportErrorToSentry({ err });
        return { success: false };
    }
    return { success: true };
};

const trackUser = async ({ name, mobileNumber }) => {

    if (DEV_PHONE_NUMBER) {
        mobileNumber = DEV_PHONE_NUMBER;
    }
    const { number, countryCode } = getParsedNumber(mobileNumber);
    const url = 'https://api.interakt.ai/v1/public/track/users/';
    const data = {
        phoneNumber: number,
        countryCode,
        traits: {
            name,
        },
    };
    const response = await postRequest({ url, data });
    return { success: true, response };
};

const trackEvent = async ({ mobileNumber, event, traits }) => {
    if (DEV_PHONE_NUMBER) {
        mobileNumber = DEV_PHONE_NUMBER;
    }
    const { number, countryCode } = getParsedNumber(mobileNumber);
    const url = 'https://api.interakt.ai/v1/public/track/events/';
    const data = {
        phoneNumber: number,
        countryCode,
        event,
        traits,
    };
    const response = await postRequest({ url, data });
    return { success: true, response };
};

module.exports = {
    trackUser,
    trackEvent,
};
