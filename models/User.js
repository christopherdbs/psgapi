import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      exclude: true,
      allowOnUpdate: false,
    },
    pseudo: {
      type: String,
      unique: true,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    nano_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('user', userSchema);
