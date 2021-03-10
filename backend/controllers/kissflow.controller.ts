import MarriageBureauWebhook, { IMarriageBureauWebhook } from '../models/marriageBureauWebhook.model';
import BuyerOnboardingWebhook, { IBuyerOnboardingWebhook } from '../models/buyerOnboardingWebhook.model';
import SellerOnboardingWebhook, { ISellerOnboardingWebhook } from '../models/sellerOnboardingWebhook.model';

export namespace KissFlowController {

    function determineConfidence(webhookConfidenceValue): string {
        if (webhookConfidenceValue){
            if (webhookConfidenceValue === "High Confidence"){
                return "HIGH"
            }else if (webhookConfidenceValue === "Medium Confidence"){
                return "MEDIUM"
            }else if (webhookConfidenceValue === "Low Confidence"){
                return "LOW"
            }else{
                return "HOLD"
            }
        }
    }

    export async function WriteMarriageBureauWebhookToDB(webhookBody: any): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            // console.log(`webhook body: ${JSON.stringify(webhookBody)}`)

            const { _id, ...webhookBodyNoId } = webhookBody
            // resolve("done")

            let aum, recurringFees, turnover, ebitda, valuation, wealthHoldingsFee, introducerFee, simplyBizFee: number;

            if (webhookBody.AUM) { aum = Number(webhookBody.AUM.split(" ")[0]) }
            if (webhookBody.Recurring_Fees) { recurringFees = Number(webhookBody.Recurring_Fees.split(" ")[0]) }
            if (webhookBody.Turnover) { turnover = Number(webhookBody.Turnover.split(" ")[0]) }
            if (webhookBody.EBITDA) { ebitda = Number(webhookBody.EBITDA.split(" ")[0]) }
            if (webhookBody.Valuation) { valuation = Number(webhookBody.Valuation.split(" ")[0]) }
            if (webhookBody.Wealth_Holdings_Fee) { wealthHoldingsFee = Number(webhookBody.Wealth_Holdings_Fee.split(" ")[0]) }
            if (webhookBody.Introducer_Fee) { introducerFee = Number(webhookBody.Introducer_Fee.split(" ")[0]) }
            if (webhookBody.SimplyBiz_Fee) { simplyBizFee = Number(webhookBody.SimplyBiz_Fee.split(" ")[0]) }

            MarriageBureauWebhook.create({
                ...webhookBodyNoId,
                _kissflow_id: webhookBody._id,              
                buyer: webhookBody.Buyer,
                seller: webhookBody.Seller,
                isSimplyBizDeal: webhookBody.Is_Simply_Biz_Deal,
                isCloseCase: webhookBody.Close_Case,
                closeCaseReason: webhookBody.Close_Case_Reason,
                closeCaseDescription: webhookBody.Close_Case_Description,
                isReEngage: webhookBody.ReEngage_In_Future,
                reEngageDate: webhookBody.ReEngage_Date,
                aum: aum,
                recurringFees: recurringFees,
                turnover: turnover,
                ebitda: ebitda,
                planners: webhookBody.Planners,
                clients: webhookBody.Clients,
                customers: webhookBody.Customers,
                valuation: valuation,
                wealthHoldingsFee: wealthHoldingsFee,
                introducerFee: introducerFee,
                simplyBizFee: simplyBizFee,
                completionDate: webhookBody.Completion_Date,
                purchaseType: webhookBody.Purchase_Type,
                finalTransactionReferenceNumber: webhookBody.Transaction_Reference_Number_1,
                currentStatus: webhookBody.Current_Status,
                confidence: determineConfidence(webhookBody.Confidence),
                activityAction: webhookBody.Activity_Action
            }, function (err, webhook: IMarriageBureauWebhook) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // console.log(`created webhook: ${JSON.stringify(webhook)}`)
                resolve(webhook);
            });
        });
    }

    export async function WriteBuyerOnboardingWebhookToDB(webhookBody: any): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            // console.log(`webhook body: ${JSON.stringify(webhookBody)}`)

            const { _id, ...webhookBodyNoId } = webhookBody
            // resolve("done")

            let fundsAvailable: number;

            if (webhookBody.Funds_Available) { fundsAvailable = Number(webhookBody.Funds_Available.split(" ")[0]) }
            
            BuyerOnboardingWebhook.create({
                ...webhookBodyNoId,
                _kissflow_id: webhookBody._id,
                enquiryMethod: webhookBody.Enquiry_Method,
                enquirySource: webhookBody.Enquiry_Source,
                primaryContact: webhookBody.Primary_Contact,
                preferredEmail: webhookBody.Preferred_Email,
                preferredPhone: webhookBody.Preferred_Phone,
                firmName: webhookBody.Firm_Name,
                fcaNumber: webhookBody.FCA_Number,
                companyType: webhookBody.Company_Type,
                isSimplyBizMember: webhookBody.SimplyBiz_Member,
                isCloseCase: webhookBody.Close_Case,
                closeCaseReason: webhookBody.Close_Case_Reason,
                closeCaseDescription: webhookBody.Close_Case_Description,
                isReEngage: webhookBody.Engage_in_Future,
                reEngageDate: webhookBody.Reengage_Date,
                officeAddress: webhookBody.Office_Address,
                operatingRegionList: webhookBody.Operating_Region,
                officeLocation: webhookBody.Office_Location, 
                currentStatus: webhookBody.Current_Status,
                confidence: determineConfidence(webhookBody.Confidence),
                activityAction: webhookBody.Activity_Action,
                completeActivityAction: webhookBody.Complete_Activity_Action,
                fundsAvailable: fundsAvailable
            }, function (err, webhook: IBuyerOnboardingWebhook) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // console.log(`created webhook: ${JSON.stringify(webhook)}`)
                resolve(webhook);
            });
        });
    }

    export async function WriteSellerOnboardingWebhookToDB(webhookBody: any): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            // console.log(`webhook body: ${JSON.stringify(webhookBody)}`)

            const { _id, ...webhookBodyNoId } = webhookBody
            // resolve("done")
            
            SellerOnboardingWebhook.create({
                ...webhookBodyNoId,
                _kissflow_id: webhookBody._id,
                enquiryMethod: webhookBody.Enquiry_Method,
                enquirySource: webhookBody.Enquiry_Source,
                primaryContact: webhookBody.Primary_Contact,
                preferredEmail: webhookBody.Preferred_Email,
                preferredPhone: webhookBody.Preferred_Phone,
                firmName: webhookBody.Firm_Name,
                fcaNumber: webhookBody.FCA_Number,
                companyType: webhookBody.Company_Type,
                isSimplyBizMember: webhookBody.SimplyBiz_Member,
                isCloseCase: webhookBody.Close_Case,
                closeCaseReason: webhookBody.Close_Case_Reason,
                closeCaseDescription: webhookBody.Close_Case_Description,
                isReEngage: webhookBody.Engage_in_Future,
                reEngageDate: webhookBody.Reengage_Date,
                officeAddress: webhookBody.Office_Address,
                operatingRegionList: webhookBody.Operating_Region,
                officeLocation: webhookBody.Office_Location, 
                currentStatus: webhookBody.Current_Status,
                confidence: determineConfidence(webhookBody.Confidence),
                activityAction: webhookBody.Activity_Action,
                completeActivityAction: webhookBody.Complete_Activity_Action,
            }, function (err, webhook: ISellerOnboardingWebhook) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // console.log(`created webhook: ${JSON.stringify(webhook)}`)
                resolve(webhook);
            });
        });
    }
}