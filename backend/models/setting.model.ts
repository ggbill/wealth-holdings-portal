import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
    orderNumber: number,
    activityName: string,
    process: string,
    amberSla: number,
    redSla: number
}

const SettingSchema: Schema = new Schema({
    orderNumber: { type: Number, required: true },
    activityName: { type: String, required: true },
    process: { type: String, required: true },
    amberSla: { type: Number, required: true },
    redSla: { type: Number, required: true }   
});

export default mongoose.model<ISetting>('Setting', SettingSchema);