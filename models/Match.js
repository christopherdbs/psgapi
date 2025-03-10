import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const matchSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    season: {
      type: mongoose.Types.ObjectId,
      ref: 'Season',
      required: false,
    },
    competition: {
      type: String,
      required: true,
    },
    round: {
      type: String,
      required: false,
    },
    venue: {
      type: String,
      required: false,
    },
    opponent: {
      type: String,
      required: false,
    },
    is_home: {
      type: Boolean,
      required: false,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: false,
      },
    ],
    score: {
      type: String,
      required: false,
    },
    position: {
      type: Number,
      required: false,
    },
    goals: [
      {
        minute: Number,
        scorer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
        },
        passer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
        },
      },
    ],
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

matchSchema.plugin(mongoosePaginate);

export const Match = mongoose.model('Match', matchSchema);
