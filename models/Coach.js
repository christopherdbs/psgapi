import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const Schema = mongoose.Schema;

const coachSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    birth: {
      type: {
        date: {
          type: Date,
          required: true,
        },
        place: {
          type: String,
          required: false,
        },
        country: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    nationalities: {
      type: [String],
      required: true,
    },
    period: {
      type: [
        {
          started: Date,
          ended: {
            type: Date,
            required: false,
          },
        },
      ],
      _id: false,
      required: true,
    },
    trophies: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Trophy',
          required: false,
          default: undefined,
        },
      ],
      _id: false,
      required: true,
      default: [],
    },
    stats: {
      type: {
        played: Number,
        won: Number,
        lost: Number,
        drawn: Number,
      },
      _id: false,
      required: false,
    },
    photo: {
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

coachSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret._id;
  },
});

coachSchema.plugin(mongoosePaginate);

export const Coach = mongoose.model('Coach', coachSchema);
