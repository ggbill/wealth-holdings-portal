import Webhook, { IWebhook } from '../models/webhook.model';

export namespace KissFlowController {

    export async function WriteWebhookToDB(webhookBody: any): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            // console.log(`webhook body: ${JSON.stringify(webhookBody)}`)

            const { _id, ...webhookBodyNoId } = webhookBody
            // resolve("done")

            Webhook.create({
                ...webhookBodyNoId,
                _kissflow_id: webhookBody._id,
                enquiryMethod: webhookBody.Enquiry_Method,
                enquirySource: webhookBody.Enquiry_Source,
                primaryContact: webhookBody.Primary_Contact,
                preferredEmail: webhookBody.Preferred_Email,
                preferredPhone: webhookBody.Preferred_Phone,
                firmName: webhookBody.Firm_Name,
                closeCase: webhookBody.Close_Case,
                reEngage: webhookBody.ReEngage_In_Future,
                initialTransactionReferenceNumber: webhookBody.Transaction_Reference_Number,
                aum: webhookBody.AUM,
                recurringFees: webhookBody.Recurring_Fees,
                turnover: webhookBody.Turnover,
                ebitda: webhookBody.EBITDA,
                planners: webhookBody.Planners,
                clients: webhookBody.Clients,
                customers: webhookBody.Customers,
                purchasingHub: webhookBody.Purchasing_Hub,
                valuation: webhookBody.Valuation,
                wealthHoldingsFee: webhookBody.Wealth_Holdings_Fee,
                completionDate: webhookBody.Completion_Date,
                purchaseType: webhookBody.Purchase_Type,
                paymentSchedule: webhookBody.Payment_Schedule,
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
            // console.log("GetLatestDataForActiveCases()")

            Webhook.aggregate([
                { $sort: { "_progress": -1 } },
                {
                    $group: {
                        _id: '$_kissflow_id',
                        firmName: { $first: "$firmName" },
                        maxProgress: { $max: "$_progress" },
                        assignedBdm: { $first: { $arrayElemAt: ["$_current_assigned_to", 0] } },
                        _current_step: { $first: "$_current_step" },
                        _created_at: { $first: "$_created_at" },
                        aum: { $first: "$aum" },
                        recurringFees: { $first: "$recurringFees" },
                        turnover: { $first: "$turnover" },
                        ebitda: { $first: "$ebitda" },
                        planners: { $first: "$planners" },
                        clients: { $first: "$clients" },
                        customers: { $first: "$customers" },
                        //TODO - Replace this with SLA once Kissflow product team make updates
                        SLA_Initial_Fee_Payment: { $first: "$SLA_Initial_Fee_Payment" },
                        SLA_HLDD: { $first: "$SLA_HLDD" },
                        SLA_Heads_Of_Terms: { $first: "$SLA_Heads_Of_Terms" },
                        SLA_DDD: { $first: "$SLA_DDD" },
                        SLA_Formal_Offer: { $first: "$SLA_Formal_Offer" },
                        SLA_Transaction_Agreement: { $first: "$SLA_Transaction_Agreement" },
                        SLA_Final_Fee_Payment: { $first: "$SLA_Final_Fee_Payment" },
                        SLA_Onboard_Lead: { $first: "$SLA_Onboard_Lead" }
                    }
                }], function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }

                    let filteredResult = result.filter(result => result._current_step !== null)
                    filteredResult.forEach(result => {
                        if (result.aum) { result.aum = Number(result.aum.split(" ")[0]) }
                        if (result.recurringFees) { result.recurringFees = Number(result.recurringFees.split(" ")[0]) }
                        if (result.turnover) { result.turnover = Number(result.turnover.split(" ")[0]) }
                        if (result.ebitda) { result.ebitda = Number(result.ebitda.split(" ")[0]) }
                    });
                    resolve(filteredResult)
                });
        })
    }
}