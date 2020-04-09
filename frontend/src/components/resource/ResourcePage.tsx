import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import { Link } from "react-router-dom"
import { Video, Image } from 'cloudinary-react'
import Loading from '../shared/Loading'
import './resource.scss'
import useCloudinaryFunctions from "../../hooks/useCloudinaryFunctions"
import HomeIcon from '@material-ui/icons/Home'


const ResourcePage = ({ match }) => {
    const isCancelled = React.useRef(false);
    const cloudinaryApi = useFetch("cloudinary");
    const cloudinaryFunctions = useCloudinaryFunctions();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [resource, setResource] = useState<any>(null)

    const getResource = (): void => {
        let publicKey = match.url.replace("resource/", "")
        let encodedPublicKey = publicKey.replace(/\//g, "%2F")
        setLoading(true)
        cloudinaryApi.get(`resource/${encodedPublicKey}`)
            .then((data: any) => {
                if (!isCancelled.current) {
                    if (data) {
                        console.log(JSON.stringify(data))
                        setResource(data.resources[0])
                    }
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                console.log(err)
                setError(err.message)
                setLoading(false)
            })
    }

    const generateBackLink = (filename: string): any => {
        let backLink = match.url.replace(`/resource/${filename}`, "")
        return backLink
    }

    const generateBreadcrumbs = (): any => {

        let trimmedUrl = match.url.substr(1).replace(`/resource`, "")
        let breadcrumbs: string[] = trimmedUrl.split("/")

        console.log(breadcrumbs)

        return (
            <div className="breadcrumb-wrapper">
            <span className="home-icon-wrapper"><Link to="/"><HomeIcon /></Link> / </span>
                
                {
                breadcrumbs.map((breadcrumb, index) => {
                    if (index === breadcrumbs.length - 1) {
                        return (
                            <span key={index}></span>
                        )
                    } else {
                        let breadcrumbLink = "/"
                        breadcrumbs.forEach((sub_breadcrumb, sub_index) => {
                            if (sub_index < index) {
                                console.log(`add to breadcrumb link : ${sub_breadcrumb}`)
                                breadcrumbLink += `${sub_breadcrumb}/`
                            } else if (sub_index === index) {
                                breadcrumbLink += `${sub_breadcrumb}`
                            }
                        });

                        return (
                            <span key={index}><Link to={breadcrumbLink}>{breadcrumb}</Link> / </span>
                        )
                    }
                })}
            </div>
        )
    }

    React.useEffect(() => {
        getResource()

        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <>
            {match.isExact &&
                <div className="content">

                    {loading &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>
                            <Loading />
                        </>
                    }
                    {!loading && resource &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>

                            {resource.resource_type === "video" && !cloudinaryFunctions.isAudioFormat(resource.format) &&
                                <>
                                    <h1>{resource.filename}</h1>
                                    <div className="resource-wrapper">
                                        <Video
                                            cloudName="hr5mbzyww"
                                            publicId={resource.public_id}
                                            fallbackContent="Your browser does not support HTML5 video tags."
                                            controls={true}
                                            autoPlay={true}
                                        >
                                        </Video>
                                    </div>

                                </>
                            }

                            {resource.resource_type === "video" && cloudinaryFunctions.isAudioFormat(resource.format) &&
                                <>
                                    <h1>{resource.filename}</h1>
                                    <div className="resource-wrapper audio">
                                    <img alt="placeholder audio"src={require("../../images/audio_placeholder.png")} />
                                        <Video
                                            cloudName="hr5mbzyww"
                                            publicId={resource.public_id}
                                            fallbackContent="Your browser does not support HTML5 video tags."
                                            controls={true}
                                            autoPlay={true}
                                        >
                                        </Video>
                                    </div>

                                </>
                            }

                            {resource.resource_type === "image" && !cloudinaryFunctions.isPDFFormat(resource.format) &&
                                <>
                                    <h1>{resource.filename}</h1>
                                    <div className="resource-wrapper">
                                        <Image
                                            cloudName="hr5mbzyww"
                                            publicId={resource.public_id}
                                        >
                                        </Image>
                                    </div>
                                </>
                            }

                            {resource.resource_type === "image" && cloudinaryFunctions.isPDFFormat(resource.format) &&
                                <>
                                    <h1>{resource.filename}</h1>
                                    <div className="resource-wrapper">
                                        {/* <Image
                                            cloudName="hr5mbzyww"
                                            publicId={resource.public_id}
                                        >
                                        </Image> */}
                                        <object data={resource.secure_url}></object>
                                    </div>
                                </>
                            } 
                        </>
                    }
                </div>
            }
        </>
    )
}

export default ResourcePage