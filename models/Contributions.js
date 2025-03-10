import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    _id,
  },
  {
    timestamps: true,
  }
);

export const Contribution = mongoose.model('contribution', contributionSchema);
