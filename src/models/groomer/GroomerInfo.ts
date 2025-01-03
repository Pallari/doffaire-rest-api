const mongoose = require("mongoose");

const GroomerInfoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
});
export const GroomerInfomodel = mongoose.model(
  "groomerInfo",
  GroomerInfoSchema
); //Interaction with DB
