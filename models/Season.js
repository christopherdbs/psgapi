import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const seasonSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    results: {
      type: {
        league: {
          type: {
            name: String,
            tier: Number,
            position: String,
            stats: {
              points: Number,
              played: Number,
              won: Number,
              lost: Number,
              drawn: Number,
              goals_for: Number,
              goals_against: Number,
              goal_difference: Number,
            },
          },
          _id: false,
          required: true,
        },
        coupe_de_france: {
          type: {
            round: String,
            stats: {
              played: Number,
              won: Number,
              lost: Number,
              drawn: Number,
              goals_for: Number,
              goals_against: Number,
              goal_difference: Number,
            },
          },
          _id: false,
          required: true,
        },
        coupe_de_la_ligue: {
          type: {
            round: String,
            stats: {
              points: Number,
              played: Number,
              won: Number,
              lost: Number,
              drawn: Number,
              goals_for: Number,
              goals_against: Number,
              goal_difference: Number,
            },
          },
          _id: false,
          required: false,
        },
        trophée_des_champions: {
          type: {
            round: String,
          },
          _id: false,
          required: false,
        },
        uefa_league: {
          type: {
            name: String,
            tier_name: String,
            tier: Number,
            round: String,
            stats: {
              points: Number,
              played: Number,
              won: Number,
              lost: Number,
              drawn: Number,
              goals_for: Number,
              goals_against: Number,
              goal_difference: Number,
            },
          },
          _id: false,
          required: false,
        },
        uefa_intertoto_cup: {
          type: {
            round: String,
            stats: {
              points: Number,
              played: Number,
              won: Number,
              lost: Number,
              drawn: Number,
              goals_for: Number,
              goals_against: Number,
              goal_difference: Number,
            },
          },
          _id: false,
          required: false,
        },
        uefa_super_cup: {
          type: {
            round: String,
            stats: {
              points: Number,
              played: Number,
              won: Number,
              lost: Number,
              drawn: Number,
              goals_for: Number,
              goals_against: Number,
              goal_difference: Number,
            },
          },
          _id: false,
          required: false,
        },
      },
      _id: false,
      required: true,
    },
    transfers: {
      type: {
        arrivals: {
          type: {},
          required: false,
        },
        departures: {},
      },
      _id: false,
      required: false,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

seasonSchema.plugin(mongoosePaginate);

export const Season = mongoose.model('Season', seasonSchema);
