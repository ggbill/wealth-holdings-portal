import Webhook, { IWebhook } from '../models/webhook.model';

export namespace KissFlowController {

    export async function WriteWebhookToDB(webhookBody: any): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            console.log(`webhook body: ${JSON.stringify(webhookBody)}`)

            const { _id, ...webhookBodyNoId } = webhookBody
            // resolve("done")

            let aum, recurringFees, turnover, ebitda, valuation, wealthHoldingsFee: number;

            if (webhookBody.AUM) { aum = Number(webhookBody.AUM.split(" ")[0]) }
            if (webhookBody.Recurring_Fees) { recurringFees = Number(webhookBody.Recurring_Fees.split(" ")[0]) }
            if (webhookBody.Turnover) { turnover = Number(webhookBody.Turnover.split(" ")[0]) }
            if (webhookBody.EBITDA) { ebitda = Number(webhookBody.EBITDA.split(" ")[0]) }
            if (webhookBody.Valuation) { valuation = Number(webhookBody.Valuation.split(" ")[0]) }
            if (webhookBody.Wealth_Holdings_Fee) { wealthHoldingsFee = Number(webhookBody.Wealth_Holdings_Fee.split(" ")[0]) }

            Webhook.create({
                ...webhookBodyNoId,
                _kissflow_id: webhookBody._id,
                enquiryMethod: webhookBody.Enquiry_Method,
                enquirySource: webhookBody.Enquiry_Source,
                primaryContact: webhookBody.Primary_Contact,
                preferredEmail: webhookBody.Preferred_Email,
                preferredPhone: webhookBody.Preferred_Phone,
                firmName: webhookBody.Firm_Name,
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
                finalTransactionReferenceNumber: webhookBody.Transaction_Reference_Number_1
            }, function (err, webhook: IWebhook) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // console.log(`created webhook: ${JSON.stringify(webhook)}`)
                resolve(webhook);
            });
        });
    }

    export async function GetLatestDataForActiveCases(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            Webhook.aggregate([
                { $sort: { "_progress": -1 } },
                {
                    $group: {
                        _id: '$_kissflow_id',
                        firmName: { $first: "$firmName" },
                        maxProgress: { $max: "$_progress" },
                        _current_assigned_to: { $first: { $arrayElemAt: ["$_current_assigned_to", 0] } },
                        previousStep: { $first: { $arrayElemAt: ["$_current_context", 0] } },
                        _current_step: { $first: "$_current_step" },
                        _created_at: { $first: "$_created_at" },
                        _last_action_performed_at: { $first: "$_last_action_performed_at" },
                        aum: { $first: "$aum" },
                        recurringFees: { $first: "$recurringFees" },
                        turnover: { $first: "$turnover" },
                        ebitda: { $first: "$ebitda" },
                        planners: { $first: "$planners" },
                        clients: { $first: "$clients" },
                        customers: { $first: "$customers" },
                        representing: { $first: "$representing" },
                        wealthHoldingsFee: { $first: "$wealthHoldingsFee" },
                        valuation: { $first: "$valuation" },
                    }
                }], function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }

                    let filteredResult = result.filter(result => result._current_step !== null)
                    resolve(filteredResult)
                });
        })
    }

    export async function GetClosedCases(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            Webhook
                .find({ _status: "Completed" }, function (err, result) {
                    if (err) {
                        console.error("Error: " + err);
                    }
                    resolve(result);
                });
        });
    }

    export async function GetInstanceDetails(kissflowId: string): Promise<any> {
        console.log(kissflowId)
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            Webhook.find({ _kissflow_id: kissflowId }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
        })
    }

    export async function GetActions(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            Webhook.find({}, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
        })
    }
}