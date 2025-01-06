import mongoose from 'mongoose';

const VeteranSchema = new mongoose.Schema(
    {
        storeName: { type: String, required: true },
        email: { type: String, required: true },
        logo: { type: String },
        phone: { type: String, required: true },
        alternativePhone: { type: String },
        bussinessRegistrationId: { type: String },
        gstNumber: { type: String },
        workExperience: { type: String },
        provideService: [
            { is_home_service: { type: Boolean, default: false } },
            { is_center_service: { type: Boolean, default: false } }
        ]
    },
    {
        timestamps: true
    }
);

export const Veteran = mongoose.model('veteran', VeteranSchema); //Interaction with DB
