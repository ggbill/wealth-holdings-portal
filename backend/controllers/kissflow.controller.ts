import MarriageBureauWebhook, { IMarriageBureauWebhook } from '../models/marriageBureauWebhook.model';
import BuyerOnboardingWebhook, { IBuyerOnboardingWebhook } from '../models/buyerOnboardingWebhook.model';

export namespace KissFlowController {

    export async function WriteMarriageBureauWebhookToDB(webhookBody: any): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            // console.log(`webhook body: ${JSON.stringify(webhookBody)}`)

            const { _id, ...webhookBodyNoId } = webhookBody
            // resolve("done")

            let aum, recurringFees, turnover, ebitda, valuation, wealthHoldingsFee: number;

            if (webhookBody.AUM) { aum = Number(webhookBody.AUM.split(" ")[0]) }
            if (webhookBody.Recurring_Fees) { recurringFees = Number(webhookBody.Recurring_Fees.split(" ")[0]) }
            if (webhookBody.Turnover) { turnover = Number(webhookBody.Turnover.split(" ")[0]) }
            if (webhookBody.EBITDA) { ebitda = Number(webhookBody.EBITDA.split(" ")[0]) }
            if (webhookBody.Valuation) { valuation = Number(webhookBody.Valuation.split(" ")[0]) }
            if (webhookBody.Wealth_Holdings_Fee) { wealthHoldingsFee = Number(webhookBody.Wealth_Holdings_Fee.split(" ")[0]) }

            MarriageBureauWebhook.create({
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
                isSimplyBizMember: webhookBody.Is_SimplyBiz_Member,
                representing: webhookBody.Representing,
                isCloseCase: webhookBody.Close_Case,
                closeCaseReason: webhookBody.Close_Case_Reason,
                closeCaseDescription: webhookBody.Close_Case_Description,
                isReEngage: webhookBody.ReEngage_In_Future,
                reEngageDate: webhookBody.ReEngage_Date,
                initialTransactionReferenceNumber: webhookBody.Transaction_Reference_Number,
                aum: aum,
                recurringFees: recurringFees,
                turnover: turnover,
                ebitda: ebitda,
                planners: webhookBody.Planners,
                clients: webhookBody.Clients,
                customers: webhookBody.Customers,
                purchasingHub: webhookBody.Purchasing_Hub,
                valuation: valuation,
                wealthHoldingsFee: wealthHoldingsFee,
                completionDate: webhookBody.Completion_Date,
                purchaseType: webhookBody.Purchase_Type,
                paymentSchedule: webhookBody['Table::Model_GbfCGNWSwGm'],
                prospectiveOffers: webhookBody['Table::Model_97Pp9ozIxK'],
                finalTransactionReferenceNumber: webhookBody.Transaction_Reference_Number_1,
                officeAddress: webhookBody.Office_Address,
                officeLocation: webhookBody.Office_Location, 
                currentStatus: webhookBody.Current_Status,
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
                activityAction: webhookBody.Activity_Action,
                completeActivityAction: webhookBody.Complete_Activity_Action,
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

    
}