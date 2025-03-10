import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const ownerSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    period: {
      type: [
        {
          started: String,
          ended: String,
          ownership: String,
        },
      ],
      _id: false,
      required: true,
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

ownerSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

ownerSchema.plugin(mongoosePaginate);

export const Owner = mongoose.model('Owner', ownerSchema);
