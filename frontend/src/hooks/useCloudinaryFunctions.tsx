import React from 'react'
import { Link } from "react-router-dom"
import HomeIcon from '@material-ui/icons/Home'

const useCloudinaryFuctions = () => {

    const generateThumbnailUrl = (videoUrl: string): string => {
        return `${videoUrl.substring(0, videoUrl.lastIndexOf(".") + 1)}jpg`
    }

    const isAudioFormat = (format: string): boolean => {
        if (format === "aac" ||
            format === "aiff" ||
            format === "amr" ||
            format === "flac" ||
            format === "m4a" ||
            format === "mp3" ||
            format === "ogg" ||
            format === "opus" ||
            format === "wav") {
            return true
        } else {
            return false
        }
    }

    const isPDFFormat = (format: string): boolean => {
        if (format === "pdf") {
            return true
        } else {
            return false
        }
    }

    const cleanFolderName = (folderName: string): string => {
        let folderNameSplit = folderName.split("_");
        folderNameSplit.splice(0, 1) //remove the first part

        let cleanFolderName: string = ""
        folderNameSplit.map((folderNameSplitInstance, index) => {
            if (index === folderNameSplit.length - 1){
                cleanFolderName += `${folderNameSplitInstance}`
            }else{
                cleanFolderName += `${folderNameSplitInstance} `
            }
        })

        return cleanFolderName
    }

    const generateBreadcrumbs = (breadcrumbs: string[]): any => {

        // let trimmedUrl = match.url.substr(1)
        // let breadcrumbs: string[] = trimmedUrl.split("/")

        return (
            <div className="breadcrumb-wrapper">
                <span className="home-icon-wrapper"><Link to="/"><HomeIcon /></Link> / </span>

                {breadcrumbs.map((breadcrumb, index) => {
                    if (index === breadcrumbs.length - 1) {
                        return (
                            <span key={index}>{cleanFolderName(breadcrumb)}</span>
                        )
                    } else {
                        let breadcrumbLink = "/"
                        breadcrumbs.forEach((sub_breadcrumb, sub_index) => {
                            if (sub_index < index) {
                                breadcrumbLink += `${sub_breadcrumb}/`
                            } else if (sub_index === index) {
                                breadcrumbLink += `${sub_breadcrumb}`
                            }

                        });

                        return (
                            <span key={index}><Link to={breadcrumbLink}>{<span key={index}>{cleanFolderName(breadcrumb)}</span>}</Link> / </span>
                        )
                    }
                })}
            </div>
        )
    }

    const sortByPrefix = (resourceList: any[]): any[] => {

        resourceList.sort((a, b) => {
            return (a.filename.split("_")[0] < b.filename.split("_")[0] ? -1 : 1)
        })

        return resourceList
    }

    return {
        generateThumbnailUrl,
        isAudioFormat,
        isPDFFormat,
        generateBreadcrumbs,
        sortByPrefix
    };
};
export default useCloudinaryFuctions;