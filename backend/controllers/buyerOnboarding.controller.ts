import BuyerOnboardingWebhook, { IBuyerOnboardingWebhook } from '../models/buyerOnboardingWebhook.model';

export namespace BuyerOnboardingController {

    export async function GetLatestDataForActiveCases(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            BuyerOnboardingWebhook.aggregate([
                { $sort: { "_progress": -1 } },
                {
                    $group: {
                        _id: '$_kissflow_id',
                        firmName: { $first: "$firmName" },
                        fcaNumber: { $first: "$fcaNumber" },
                        officeLocation: { $first: "$officeLocation" },
                        isSimplyBizMember: { $first: "$isSimplyBizMember" },
                        maxProgress: { $max: "$_progress" },
                        _current_assigned_to: { $first: { $arrayElemAt: ["$_current_assigned_to", 0] } },
                        previousStep: { $first: { $arrayElemAt: ["$_current_context", 0] } },
                        _current_step: { $first: "$_current_step" },
                        _created_at: { $first: "$_created_at" },
                        _last_action_performed_at: { $first: "$_last_action_performed_at" },
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
            BuyerOnboardingWebhook
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

            BuyerOnboardingWebhook.find({ _kissflow_id: kissflowId }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
        })
    }

    export async function GetActions(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            BuyerOnboardingWebhook.find({}, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
        })
    }

    
}