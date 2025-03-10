import { Timestamp, Int32 } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const playerSchema = new Schema(
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
      required: false,
    },
    birth: {
      type: {
        date: {
          type: Date,
          required: false,
        },
        place: {
          type: String,
          required: false,
        },
        country: {
          type: String,
          required: false,
        },
      },
      _id: false,
      required: true,
    },
    nationalities: {
      type: [String],
      required: true,
    },
    national_team: {
      type: String,
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    position: {
      type: [String],
      required: true,
    },
    strong_foot: {
      type: String,
      required: false,
    },
    fee: {
      type: [
        {
          arrival: Number,
          departure: Number,
        },
      ],
      _id: false,
      required: false,
    },
    period: {
      type: [
        {
          started: {
            type: Date,
            required: true,
          },
          ended: {
            type: Date,
            required: false,
          },
        },
      ],
      _id: false,
      required: true,
    },
    number: {
      type: [Number],
      required: false,
    },
    matches: {
      type: Number,
      required: true,
    },
    goals: {
      type: Number,
      required: false,
    },
    assists: {
      type: Number,
      required: false,
    },
    previous_club: {
      type: [String],
      required: true,
    },
    next_club: {
      type: [String],
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
    photo: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, minimize: false }
);

playerSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
  },
});

playerSchema.plugin(mongoosePaginate);

export const Player = mongoose.model('Player', playerSchema);
