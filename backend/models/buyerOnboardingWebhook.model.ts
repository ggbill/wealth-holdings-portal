import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';

export interface IBuyerOnboardingWebhook extends Document {
    _last_action: string,
    _last_action_performed_by: Object,
    _last_action_performed_at: Date,
    _flow_id: string,
    _current_context: Object[],
    _id: string,
    _created_by: Object,
    _modified_by: Object,
    _created_at: Date,
    _modified_at: Date,
    _flow_name: string,
    _current_step: string,
    _current_assigned_to: Object[],
    _status: string,
    _stage: number,
    _root_process_instance: string,
    _submitted_at: Date,
    _request_number: number,
    _counter: number,
    _last_completed_step: string,
    _progress: number,
    enquiryMethod: string,
    enquirySource: string,
    primaryContact: string,
    preferredEmail: string,
    preferredPhone: string,
    firmName: string,
    companyType: string, 
    isSimplyBizMember: boolean,
    isCloseCase: boolean,
    closeCaseReason: string,
    closeCaseDescription: string,
    isReEngage: boolean,
    reEngageDate: Date,
    officeAddress: string,
    operatingRegionList: string[],
    officeLocation: string,
    currentStatus: string,
    confidence: string,
    activityAction: string,
    completeActivityAction: string,
    fundsAvailable: number
}

const BuyerOnboardingWebhookSchema: Schema = new Schema({
    _last_action: { type: String, required: true },
    _last_action_performed_by: { type: Object, required: true },
    _last_action_performed_at: { type: Date, required: true },
    _flow_id: { type: String, required: true },
    _current_context: [{ type: Object, required: true }],
    _kissflow_id: { type: String, required: true },
    _created_by: { type: Object, required: true },
    _modified_by: { type: Object, required: true },
    _created_at: { type: Date, required: true },
    _modified_at: { type: Date, required: true },
    _flow_name: { type: String, required: true },
    _current_step: { type: String },
    _current_assigned_to: [{ type: Object, required: true }],
    _status: { type: String, required: true },
    _stage: { type: Number, required: true },
    _root_process_instance: { type: String, required: true },
    _submitted_at: { type: Date, required: true },
    _request_number: { type: Number, required: true },
    _counter: { type: Number, required: true },
    _last_completed_step: { type: String, required: true },
    _progress: { type: Number, required: true },
    enquiryMethod: { type: String },
    enquirySource: { type: String },
    primaryContact: { type: String },
    preferredEmail: { type: String },
    preferredPhone: { type: String },
    firmName: { type: String },
    fcaNumber: { type: String },
    companyType:{ type: String },
    isSimplyBizMember:{ type: Boolean },
    isCloseCase: { type: Boolean },
    closeCaseReason: { type: String },
    closeCaseDescription: { type: String },
    isReEngage: { type: Boolean },
    reEngageDate: { type: Date },
    officeAddress: { type: String },
    operatingRegionList: [{ type: String }],
    officeLocation: { type: String },
    currentStatus: {type: String},
    confidence: {type: String},
    activityAction: {type: String},
    completeActivityAction: {type: String},
    fundsAvailable: {type: Number},
});

export default mongoose.model<IBuyerOnboardingWebhook>('Buyer-Onboarding-Webhook', BuyerOnboardingWebhookSchema);