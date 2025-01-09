import axios from 'axios';

import { apiErrorHandler } from '../handlers/errorHandler';
import { Groomer } from '../models/Groomers';
import { Veteran } from '../models/Veteran';
import { authentication, comparePassword, createAuthToken, generatePassword } from '../utils/authentication';
import { PY_SMS_VALIDATE, PY_GENERATE_OTP } from '../constants/constants-info';

export default class Auth {

  constructor() {
    this.registration = this.registration.bind(this);
    this.verification = this.verification.bind(this);
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
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

  async login(req, res) {
    try {
      this.doLogin(req, res);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Login failed.');
    }
  }

  async forgotPassword(req, res) {
    try {
      this.doForgotPassword(req,res)
    } catch (error) {
      apiErrorHandler(error, req, res, 'Forgot Password failed.');
    }
  }

  async doRegisterUser(req, res) {
    const data = req.body;
    const business_category = data.business_category;

    const user = business_category === 'groomer' ? await Groomer.findOne({ email: data?.groomer_email }).exec() : await Veteran.findOne({ email: data?.veterinary_email }).exec();

    if (user) {
      return res.json({ success: false, message: `${business_category} already registered.` });
    }

   
    let password =  await generatePassword()
    password = await authentication(password);
    console.log(`---password------`,password)
    const phoneNumber = business_category === 'groomer' ? data.groomer_phone : data.veterinary_phone;

    await axios.get(`${PY_GENERATE_OTP}?mobile_number=${phoneNumber}`)
      .then(async (response) => {
        data.smsSecretKey = response.data.secret_key;
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

    
    console.log(`---data--`,data)

    await axios.get(`${PY_SMS_VALIDATE}${data.otp}?mobile_number=${data.phone}&secret_key=${user.smsSecretKey}`)
      .then(async (response) => {
        console.log(`---response----`,response)

        if (response.data.is_valid) {
          if (business_category === 'groomer') {
            await Groomer.updateOne({ _id: user._id }, { $set: { isVerification: true } });
          } else if (business_category === 'veteran') {
            await Veteran.updateOne({ _id: user._id }, { $set: { isVerification: true } });
          }
          return res.json({ success: true, message: 'Verification Success' });
        }
        console.log(`-------`)
        return res.json({ success: false, message: 'Verification Failed' });
      })
      .catch((error) => {
        console.log(`----error---`,error);
        return res.json({ success: false, message: 'Verification Failed' });
      });
  }

  async doLogin(req, res) {
    const data = req.body;
    const business_category = data.business_category;

    const user = business_category === 'groomer' ? await Groomer.findOne({ email: data?.groomer_email }).exec() : await Veteran.findOne({ email: data?.veterinary_email }).exec();

    if (!user) {
      return res.json({ success: false, message: `${business_category} not found.` });
    }

    const isPasswordMatch = await comparePassword(data.password, user.password);

    if (!isPasswordMatch) {
      return res.json({ success: false, message: 'Incorrect Password' });
    }

    const sessionToken = await createAuthToken(user._id.toString());
    let updatedUser;

    if (business_category === 'groomer') {
      updatedUser = await Groomer.findByIdAndUpdate({ _id: user._id }, { $set: { sessionToken } });
    } else if (data.business_category === 'veteran') {
      updatedUser = await Veteran.findByIdAndUpdate({ _id: user._id }, { $set: { sessionToken } });
    }

    return res.json({ success: true, message: 'Login Successfully', data: updatedUser });
  }

  async doForgotPassword(req,res) {
    const data = req.body;
    const business_category = data.business_category;

    const user = business_category === 'groomer' ? await Groomer.findOne({ email: data.email }).exec() : await Veteran.findOne({ email: data.email }).exec();

    if (!user) {
      return res.json({ success: false, message: `${business_category} not found.` });
    }

    let password = await generatePassword()
    console.log(`---password------`,password)
    password = await authentication(password);
    
    // TODO: code for sending password through email

    if (business_category === 'groomer') {
      await Groomer.findByIdAndUpdate({ _id: user._id }, { $set: { password } });
    } else if (data.business_category === 'veteran') {
      await Veteran.findByIdAndUpdate({ _id: user._id }, { $set: { password } });
    }

    return res.json({ success: true, message: 'Password Update Successfully' });

  }

}
