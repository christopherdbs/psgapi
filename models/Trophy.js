import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const trophySchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    season: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Season',
          required: true,
        },
      ],
      required: true,
    },
    competition: {
      type: String,
      required: true,
    },
    domestic: {
      type: Boolean,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

trophySchema.plugin(mongoosePaginate);

export const Trophy = mongoose.model('Trophy', trophySchema);
