import Setting, { ISetting } from '../models/setting.model';

export namespace SettingsController {

    export async function GetSettings(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            Setting.find({}, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        })
    }

    export async function UpdateSettings(settings: ISetting[]): Promise<ISetting> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            const bulkOps = settings.map(setting => ({
                updateOne: {
                    filter: {_id: setting._id},
                    update: setting,
                    upsert: true
                }
            }))
            
            Setting.bulkWrite(bulkOps)
                    .then(result => resolve(result))
                    .catch(err => console.error('BULK update error:', err))
        })
    }    
}