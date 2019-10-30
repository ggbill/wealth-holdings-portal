import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';
import Team, {ITeam} from './team.model';
import Fixture, { IFixture } from './fixture.model';
import Player, { IPlayer } from './player.model'

export interface ISeason extends Document {
    name: string,
    location: string,
    startDate: Date,
    endDate: Date,
    teamList: ITeam[],
    playerList: ITeam[],
    fixtureList: IFixture[]
    isActive: boolean
}

const SeasonSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  teamList: [{ type: Schema.Types.ObjectId, ref: Player }],
  playerList: [{ type: Schema.Types.ObjectId, ref: Team }],
  fixtureList: [{ type: Schema.Types.ObjectId, ref: Fixture }],
  isActive: {type: Boolean, required: true}
});

// Export the model and return your ISeason interface
export default mongoose.model<ISeason>('Season', SeasonSchema);