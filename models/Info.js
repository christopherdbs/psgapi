import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const infoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    shortname: {
      type: Array,
      required: true,
    },
    nicknames: {
      type: Array,
      required: true,
    },
    founded: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    league: {
      type: String,
      required: true,
    },
    stadium: {
      type: Object,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    logo: {
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

infoSchema.plugin(mongoosePaginate);

export const Info = mongoose.model('Info', infoSchema);
