var cloudinary = require('cloudinary').v2;

export namespace CloudinaryController {

    export async function GetFolders(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            cloudinary.api.root_folders(function (error, result) {
                if (error) {
                    console.log(error)
                    reject(error)
                }
                resolve(result)
            })
        });
    }

    export async function GetSubFolders(rootFolder: string): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            cloudinary.api.sub_folders(rootFolder, function (error, result) {
                if (error) {
                    console.log(error)
                    reject(error)
                }
                resolve(result)
            })
        });
    }

    export async function GetResourcesInFolder(prefix: string): Promise<any> {
        console.log(`GetResourcesInFolder prefix: ${prefix.replace(/%2F/g, "/")}`)
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            cloudinary.search
                .expression(`folder=${prefix.substring(1)}`)
                .execute()
                .then(result => {
                    // console.log(JSON.stringify(result))
                    resolve(result)
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
        });
    }

    export async function GetResourceByPublicId(publicId: string): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
            cloudinary.search
                .expression(`public_id:${publicId.substr(1)}`)
                .with_field('tags')
                .with_field('context')
                .execute()
                .then(result => {
                    resolve(result)
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
        });
    }
}