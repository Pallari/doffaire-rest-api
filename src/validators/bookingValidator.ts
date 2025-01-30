import Joi from "joi";

export const listing  = {
  body: Joi.object().keys({
    business_category: Joi.string().required().valid('groomer', 'veteran'),
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
    pageName: Joi.string().required().valid("ongoing" ,"upcoming", "past"),
    searchString: Joi.string(),
    sortBy: Joi.string()
  })
};

export const rescheduleBooking = {
  body: Joi.object().keys({
    bookingId: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    updatedDate: Joi.date().required()
  })
}

export const rescheduleListing  = {
  body: Joi.object().keys({
    business_category: Joi.string().required().valid('groomer', 'veteran'),
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
    searchString: Joi.string(),
    sortBy: Joi.string()
  })
};

export const sendVerificationCode = {
  body: Joi.object().keys({
    bookingId: Joi.string().required()
  })
}

export const serviceVerification = {
  body: Joi.object().keys({
    bookingId: Joi.string().required(),
    otp: Joi.number().required(),
    status:  Joi.string().required().valid('ongoing', 'completed'),
  })
}

export const updateBookingStatus = {
  body: Joi.object().keys({
    bookingId: Joi.string().required(),
    status: Joi.string().required().valid('pendingForProviderConfirmation', 'confirmed','ongoing', 'completed','rejectByProvider',
    'rescheduleByProvider', 'rescheduleByUser', 'cancelByUser', 'cancelByProvider', 'pendingForUserApproval')
  })
}