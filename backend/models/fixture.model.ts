import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';
import Team, { ITeam } from './team.model';
import Season, { ISeason } from './season.model';
import Player, { IPlayer } from './player.model';

export interface IFixture extends Document {
    fixtureType: String,
    kickoffDateTime: Date,
    isWin: Boolean,
    goalsAgainst: Number,
    isPenalties: Boolean,
    penaltiesAgainst: Number,
    season: ISeason,
    opposition: ITeam,
    players: IPlayer,
    motm: IPlayer,
    scorers: IPlayer,
    pentaltyScorers: IPlayer
}

const FixtureSchema: Schema = new Schema({
    fixtureType: { type: String, required: true },
    kickoffDateTime: { type: Date, required: true },
    isWin: { type: Boolean },
    goalsAgainst: { type: Number },
    isPenalties: { type: Boolean },
    penaltiesAgainst: { type: Number },
    season: { type: Schema.Types.ObjectId, ref: Season },
    opposition: { type: Schema.Types.ObjectId, ref: Team, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: Player }],
    motm: { type: Schema.Types.ObjectId, ref: Player },
    scorers: [{ type: Schema.Types.ObjectId, ref: Player }],
    pentaltyScorers: [{ type: Schema.Types.ObjectId, ref: Player }]
});

export default mongoose.model<IFixture>('Fixture', FixtureSchema);