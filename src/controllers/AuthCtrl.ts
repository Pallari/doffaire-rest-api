import axios from 'axios';

import { apiErrorHandler } from '../handlers/errorHandler';
import { Groomer } from '../models/Groomer';
import { Veteran } from '../models/Veteran';
import { authentication, comparePassword, createAuthToken, generatePassword } from '../utils/authentication';
import { TWO_FACTOR_SMS_API, SMS_API_KEY } from '../constants/constants-info';
import EmailTransport from '../utils/email-transport';

export default class Auth {

  private emailTransport = new EmailTransport();

  constructor() {
    this.registration = this.registration.bind(this);
    this.verification = this.verification.bind(this);
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.logout = this.logout.bind(this);
  }

  async registration(req, res) {
    try {
      this.doRegisterUser(req, res);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Registration failed.');
    }
  }

  async verification(req, res) {
    try {
      this.doVerification(req, res);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Verification failed.');
    }
  }

  async resendOtp(req, res) {
    try {
      const data = req.body;
      const business_category = data.business_category;

      const user = business_category === 'groomer' ? await Groomer.findOne({ phone: data?.phone }).exec() : await Veteran.findOne({ phone: data?.phone }).exec();

      if (!user) {
        return res.json({ success: false, message: `${business_category} not found.` });
      }

      const phoneNumber = business_category === 'groomer' ? data.groomer_phone : data.veterinary_phone;

      const otp = Math.floor(Math.random() * ((9999 - 1000 + 1)) + 1000)

      await axios.get(`${TWO_FACTOR_SMS_API}/${SMS_API_KEY}/SMS/${phoneNumber}/${otp}`)
        .then(async (response) => {
          if (response.data.Status === 'Success') {
            if (business_category === 'groomer') {
              await Groomer.updateOne({ _id: user._id }, { $set: { otp } });
            } else if (business_category === 'veteran') {
              await Veteran.updateOne({ _id: user._id }, { $set: { otp } });
            }
            return res.json({ success: true, message: "OTP Update Successfully" });
          }
          return res.json({ success: false, message: `Error while saving ${business_category}"s Data` });
        })
        .catch((error) => {
          apiErrorHandler(error, req, res, 'Sending Sms failed.');
        });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Resend OTP failed.');
    }
  }

  async login(req, res) {
    try {
      this.doLogin(req, res);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Login failed.');
    }
  }

  async forgotPassword(req, res) {
    try {
      this.doForgotPassword(req, res)
    } catch (error) {
      apiErrorHandler(error, req, res, 'Forgot Password failed.');
    }
  }

  async refreshToken(req, res) {
    try {
      let userId = req.user._id;
      const business_category = req.body.business_category;

      const user = business_category === 'groomer' ? await Groomer.findById({ _id: userId }).exec() : await Veteran.findById({ _id: userId }).exec();

      if (!user) {
        return res.json({ success: false, message: `${business_category} user not found.` });
      }

      const sessionToken = await createAuthToken({ _id: (user._id).toString() });

      let userData: any;

      if (business_category === 'groomer') {
        userData = await Groomer.findByIdAndUpdate({ _id: userId }, { $set: { sessionToken } });
      } else if (business_category === 'veteran') {
        userData = await Veteran.findByIdAndUpdate({ _id: userId }, { $set: { sessionToken } });
      }
      return res.json({ success: true, message: 'Token refreshed Successfully', sessionToken: sessionToken });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Token refreshing failed.');
    }
  }

  async logout(req, res) {
    try {
      let userId = req.user._id;

      const business_category = req.body.business_category;

      const user = business_category === 'groomer' ? await Groomer.findById(userId).exec() : await Veteran.findById(userId).exec();

      if (!user) {
        return res.json({ success: false, message: `${business_category} not found.` });
      }

      if (business_category === 'groomer') {
        await Groomer.findByIdAndUpdate({ _id: userId }, { $set: { sessionToken: '' } });
      } else if (business_category === 'veteran') {
        await Veteran.findByIdAndUpdate({ _id: userId }, { $set: { sessionToken: '' } });
      }
      return res.json({ success: true, message: 'Logout Successfully' });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Logout failed.');
    }
  }

  async deleteUser(req,res){
    try {
      let userId = req.user._id;

      const business_category = req.params.businessCategory;

      const user = business_category === 'groomer' ? await Groomer.findById(userId).exec() : await Veteran.findById(userId).exec();

      if (!user) return res.json({ success: false, message: `${business_category} not found.` });
      
      if (business_category === 'groomer') {
        await Groomer.findByIdAndUpdate({ _id: userId }, { $set: { sessionToken: '', isDeleted:true } });
      } else if (business_category === 'veteran') {
        await Veteran.findByIdAndUpdate({ _id: userId }, { $set: { sessionToken: '', isDeleted:true } });
      }
      return res.json({ success: true, message: 'Account deleted Successfully' });
      
    } catch (error) {
      apiErrorHandler(error, req, res, 'Delete User failed.');
    }
  }

  async doRegisterUser(req, res) {
    const data = req.body;
    const business_category = data.business_category;

    const user = business_category === 'groomer' ? await Groomer.findOne({ email: data?.groomer_email }).exec() : await Veteran.findOne({ email: data?.veterinary_email }).exec();

    if (user) {
      return res.json({ success: false, message: `This ${business_category} is already registered.` });
    }

    let password = await generatePassword();

    const emailData = {
      to: business_category === 'groomer' ? data.groomer_email : data.veterinary_email,
      subject: `Doaffair ${business_category} Password`,
      text: `Your Password for Doaffaire is ${password}`
    };

    this.emailTransport.sentVerificationEmail(emailData);

    password = await authentication(password);

    const phoneNumber = business_category === 'groomer' ? data.groomer_phone : data.veterinary_phone;

    const otp = Math.floor(Math.random() * ((9999 - 1000 + 1)) + 1000);
    
    await axios.get(`${TWO_FACTOR_SMS_API}/${SMS_API_KEY}/SMS/${phoneNumber}/${otp}`)
      .then(async () => {
        data.otp = otp;
        data.password = password;
        const userData = await this.saveUserData(data);

        if (userData) {
          return res.json({ success: true, data: userData });
        }

        return res.json({ success: false, message: `Error while saving ${business_category}"s Data` });
      })
      .catch((error) => {
        apiErrorHandler(error, req, res, 'Sending Sms failed.');
      });
  }

  async saveUserData(data) {
    if (data.business_category === 'groomer') {
      const groomerData = new Groomer({
        storeName: data.groomer_store_name,
        email: data.groomer_email,
        logo: data.groomer_logo,
        phone: data.groomer_phone,
        password: data.password,
        alternativePhone: data.groomer_alernative_phone,
        bussinessRegistrationId: data.groomer_bussiness_registration_id,
        gstNumber: data.groomer_gst_number,
        workExperience: data.groomer_work_experience,
        provideService: data.groomer_provider_service,
        smsSecretKey: data.smsSecretKey,
      });
      return await groomerData.save();

    } else if (data.business_category === 'veteran') {
      const veteranData = new Veteran({
        clinicName: data.veterinary_clinic_name,
        email: data.veterinary_email,
        password: data.password,
        logo: data.veterinary_logo,
        phone: data.veterinary_phone,
        alternativePhone: data.veterinary_alternative_phone,
        bussinessRegistrationId: data.veterinary_bussiness_registration_id,
        gstNumber: data.veterinary_gst_number,
        emergencyPhoneNumber: data.veterinary_emergency_phone_number,
        smsSecretKey: data.smsSecretKey,
      });
      return await veteranData.save();
    }
  }

  async doVerification(req, res) {
    const data = req.body;

    const business_category = data.business_category;

    const user = business_category === 'groomer' ? await Groomer.findOne({ phone: data?.phone }).exec() : await Veteran.findOne({ phone: data?.phone }).exec();

    if (!user) {
      return res.json({ success: false, message: `${business_category} not found.` });
    }

    await axios.get(`${TWO_FACTOR_SMS_API}/${SMS_API_KEY}/SMS/VERIFY3/${data.phone}/${data.otp}`)
      .then(async (response) => {
        if (response.data.Status === 'Success') {
          if (business_category === 'groomer') {
            await Groomer.updateOne({ _id: user._id }, { $set: { isVerification: true } });
          } else if (business_category === 'veteran') {
            await Veteran.updateOne({ _id: user._id }, { $set: { isVerification: true } });
          }
          return res.json({ success: true, message: 'Verification Success' });
        }
        return res.json({ success: false, message: 'Verification Failed' });
      })
      .catch(() => {
        return res.json({ success: false, message: 'Verification Failed' });
      });
  }

  async doLogin(req, res) {
    const data = req.body;

    const business_category = data.business_category;

    const user = business_category === 'groomer' ? await Groomer.findOne({ email: data?.email }).exec() : await Veteran.findOne({ email: data?.email }).exec();

    if (!user) {
      return res.json({ success: false, message: `${data?.email} for ${business_category} not found.` });
    }

    const isPasswordMatch = await comparePassword(data.password, user.password);

    if (!isPasswordMatch) {
      return res.json({ success: false, message: 'Incorrect Password' });
    }

    const sessionToken = await createAuthToken({ _id: (user._id).toString() });

    let updatedUser: any;
    
    if (business_category === 'groomer') {
      updatedUser = await Groomer.findByIdAndUpdate({ _id: user._id }, { $set: { sessionToken } }, { new: true });
    } else if (business_category === 'veteran') {
      updatedUser = await Veteran.findByIdAndUpdate({ _id: user._id }, { $set: { sessionToken } }, { new: true });
    }

    return res.json({ success: true, message: 'Login Successfully', data: updatedUser });
  }

  async doForgotPassword(req, res) {
    const data = req.body;
    const business_category = data.business_category;

    const user = business_category === 'groomer' ? await Groomer.findOne({ email: data.email }).exec() : await Veteran.findOne({ email: data.email }).exec();

    if (!user) {
      return res.json({ success: false, message: `${business_category} not found.` });
    }

    let password = await generatePassword();
    const emailData = {
      to: data.email,
      subject: `Doaffair ${business_category} Password`,
      text: `Your Password for Doaffaire is ${password}.`
    };

    await this.emailTransport.sentVerificationEmail(emailData)
    
    password = await authentication(password);

    if (business_category === 'groomer') {
      await Groomer.findByIdAndUpdate({ _id: user._id }, { $set: { password } });
    } else if (data.business_category === 'veteran') {
      await Veteran.findByIdAndUpdate({ _id: user._id }, { $set: { password } });
    }

    return res.json({ success: true, message: 'Updated password sent to your email successfully.' });
  }

}
