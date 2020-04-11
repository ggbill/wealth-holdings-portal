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

    const generateBreadcrumbs = (breadcrumbs: string[]): any => {

        // let trimmedUrl = match.url.substr(1)
        // let breadcrumbs: string[] = trimmedUrl.split("/")

        return (
            <div className="breadcrumb-wrapper">
                <span className="home-icon-wrapper"><Link to="/"><HomeIcon /></Link> / </span>

                {breadcrumbs.map((breadcrumb, index) => {
                    if (index === breadcrumbs.length - 1) {
                        return (
                            <span key={index}>{breadcrumb.replace(/_/g, " ")}</span>
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
                            <span key={index}><Link to={breadcrumbLink}>{breadcrumb.replace(/_/g, " ")}</Link> / </span>
                        )
                    }
                })}
            </div>
        )
    }

    return {
        generateThumbnailUrl,
        isAudioFormat,
        isPDFFormat,
        generateBreadcrumbs
    };
};
export default useCloudinaryFuctions;