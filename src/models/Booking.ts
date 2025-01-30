import mongoose from "mongoose";
const User = require('./User');
const Pet = require('./Pet');
const Doctor = require('./Doctor');
const Groomer = require('./Groomer');

const bookingSchema = new mongoose.Schema({
  bookingAmount: { type: String },
  bookingDiscount: { type: String },
  bookingTax: { type: String },
  bookingType: { type: String, enum: ['internal', 'completed', 'cancelled'] },
  calenderEventId: { type: String },
  couponReference: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  startTime: { type: Date },
  endTime: { type: Date },
  instructions: { type: String },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'pet' },
  serviceProviderType: { type: String, enum: ['vet', 'groomer'] },
  serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'groomer' }, // ToDo
  serviceType: { type: String },
  services: { type: Array },
  status: { type: String, enum: ['pendingForProviderConfirmation', 'confirmed','ongoing', 'completed','rejectByProvider',
    'rescheduleByProvider', 'rescheduleByUser', 'cancelByUser', 'cancelByProvider', 'pendingForUserApproval'] },
  title: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  userAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'userAddress' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  version: { type: String },
  _class: { type: String }
},
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model('booking', bookingSchema);