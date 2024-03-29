import MarriageBureauWebhook, { IMarriageBureauWebhook } from '../models/marriageBureauWebhook.model';

export namespace MarriageBureauController {

    export async function GetLatestDataForActiveCases(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            MarriageBureauWebhook.aggregate([


                    { $sort: { _last_action_performed_at: 1 } },
                {
                    $group: {
                        _id: {
                            _kissflow_id: "$_kissflow_id",
                            _current_step: "$_current_step"
                        },
                        buyer: { $last: "$buyer" },
                        seller: { $last: "$seller" },
                        isSimplyBizDeal: { $last: "$isSimplyBizDeal" },
                        maxProgress: { $max: "$_progress" },
                        _current_assigned_to: { $last: { $arrayElemAt: ["$_current_assigned_to", 0] } },
                        previousStep: { $last: { $arrayElemAt: ["$_current_context", 0] } },
                        _current_step: { $last: "$_current_step" },
                        _created_at: { $last: "$_created_at" },
                        _last_action_performed_at: { $first: "$_last_action_performed_at" },
                        aum: { $last: "$aum" },
                        recurringFees: { $last: "$recurringFees" },
                        turnover: { $last: "$turnover" },
                        ebitda: { $last: "$ebitda" },
                        planners: { $last: "$planners" },
                        clients: { $last: "$clients" },
                        customers: { $last: "$customers" },
                        wealthHoldingsFee: { $last: "$wealthHoldingsFee" },
                        introducerFee: { $last: "$introducerFee" },
                        simplyBizFee: { $last: "$simplyBizFee" },
                        valuation: { $last: "$valuation" },
                        currentStatus: { $last: "$currentStatus" },
                        confidence: { $last: "$confidence" },
                        completionDate: { $last: "$completionDate" }
                    },
                },
                { $sort: { _last_action_performed_at: -1 } },
                {
                    $group: {
                        _id: '$_id._kissflow_id',
                        buyer: { $first: "$buyer" },
                        seller: { $first: "$seller" },
                        isSimplyBizDeal: { $first: "$isSimplyBizDeal" },
                        maxProgress: { $first: "$_progress" },
                        _current_assigned_to: { $first: "$_current_assigned_to" },
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
                        wealthHoldingsFee: { $first: "$wealthHoldingsFee" },
                        introducerFee: { $first: "$introducerFee" },
                        simplyBizFee: { $first: "$simplyBizFee" },
                        valuation: { $first: "$valuation" },
                        currentStatus: { $first: "$currentStatus" },
                        confidence: { $first: "$confidence" },
                        completionDate: { $last: "$completionDate" }
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
            MarriageBureauWebhook
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

            MarriageBureauWebhook.find({ _kissflow_id: kissflowId }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
        })
    }

    export async function GetActions(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            MarriageBureauWebhook.find({}, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
        })
    }
}