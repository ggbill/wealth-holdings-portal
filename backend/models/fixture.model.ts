import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';
import Team, { ITeam } from './team.model';
import FixturePlayer, { IFixturePlayer } from './fixturePlayer.model';

export interface IFixture extends Document {
    fixtureType: String,
    kickoffDateTime: Date,
    result: String
    goalsAgainst: Number,
    oppositionOwnGoals: Number,
    isPenalties: Boolean,
    penaltiesAgainst: Number,
    opposition: ITeam,
    players: IFixturePlayer[],
    isActive: Boolean
}

const FixtureSchema: Schema = new Schema({
    fixtureType: { type: String, required: true },
    kickoffDateTime: { type: Date, required: true },
    result: { type: String },
    goalsAgainst: { type: Number },
    oppositionOwnGoals: { type: Number },
    isPenalties: { type: Boolean },
    penaltiesAgainst: { type: Number },
    opposition: { type: Schema.Types.ObjectId, ref: Team },
    players: [{ type: FixturePlayer.schema }],
    isActive: {type: Boolean, required: true}
});

export default mongoose.model<IFixture>('Fixture', FixtureSchema);