import authy0 from 'authy';
import {PhoneNumberUtil} from 'google-libphonenumber';
import {promisify} from 'es6-promisify';

const authy = authy0(process.env.AUTHY_API_KEY);

const phoneUtil = PhoneNumberUtil.getInstance();
const verificationStart = promisify(authy.phones().verification_start);

export default async function(event) {
  console.log(JSON.stringify(event, null, 2));

  // skip challenge if user has active session
  if (event.request.session && event.request.session.length > 0) return event;

  const phoneNumber = phoneUtil.parse(event.request.userAttributes.phone_number);
  const nationalNumber = phoneNumber.getNationalNumber();
  const countryCode = phoneNumber.getCountryCode();

  // pass formatted phone to the verifyAuthChallenge hook
  event.response.privateChallengeParameters = {
    nationalNumber,
    countryCode
  };

  event.response.challengeMetadata = 'PHONE_VERIFICATION_CHALLENGE';

  try {
    const res = await verificationStart(nationalNumber, countryCode, 'sms');
    console.log(JSON.stringify(res, null, 2));
    if (res.success) return event;
    return res.message;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return error.message || 'Something went wrong';
  }
}
