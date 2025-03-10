import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const presidentSchema = new Schema(
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
          type: String,
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
      required: true,
    },
    period: {
      type: [
        {
          started: String,
          ended: String,
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
    photo: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

presidentSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
  },
});

presidentSchema.plugin(mongoosePaginate);

export const President = mongoose.model('President', presidentSchema);
