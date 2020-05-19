import Webhook, { IWebhook } from '../models/webhook.model';

export namespace KissFlowController {

    export async function WriteWebhookToDB(webhookBody: any): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            console.log(`webhook body: ${JSON.stringify(webhookBody)}`)

            const { _id, ...webhookBodyNoId } = webhookBody
            // resolve("done")

            let aum, recurringFees, turnover, ebitda, valuation, wealthHoldingsFee: number;

            if (webhookBody.AUM){ aum = Number(webhookBody.AUM.split(" ")[0])}
            if (webhookBody.Recurring_Fees){ recurringFees = Number(webhookBody.Recurring_Fees.split(" ")[0])}
            if (webhookBody.Turnover){ turnover = Number(webhookBody.Turnover.split(" ")[0])}
            if (webhookBody.EBITDA){ ebitda = Number(webhookBody.EBITDA.split(" ")[0])}
            if (webhookBody.Valuation){ valuation = Number(webhookBody.Valuation.split(" ")[0])}
            if (webhookBody.Wealth_Holdings_Fee){ wealthHoldingsFee = Number(webhookBody.Wealth_Holdings_Fee.split(" ")[0])}

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
                closeCase: webhookBody.Close_Case,
                reEngage: webhookBody.ReEngage_In_Future,
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
                paymentSchedule: webhookBody['Table::Model_sWhDBR6MiD'],
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
                    }
                }], function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }

                    let filteredResult = result.filter(result => result._current_step !== null)
                    // filteredResult.forEach(result => {
                    //     if (result.aum) { result.aum = Number(result.aum.split(" ")[0]) }
                    //     if (result.recurringFees) { result.recurringFees = Number(result.recurringFees.split(" ")[0]) }
                    //     if (result.turnover) { result.turnover = Number(result.turnover.split(" ")[0]) }
                    //     if (result.ebitda) { result.ebitda = Number(result.ebitda.split(" ")[0]) }
                    // });
                    resolve(filteredResult)
                });
        })
    }

    export async function GetInstanceDetails(kissflowId: string): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            Webhook.find({ _kissflow_id: kissflowId }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
        })
    }
}