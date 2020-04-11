import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import { Link } from "react-router-dom"
import { Video, Image } from 'cloudinary-react'
import Loading from '../shared/Loading'
import './resource.scss'
import useCloudinaryFunctions from "../../hooks/useCloudinaryFunctions"
import HomeIcon from '@material-ui/icons/Home'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import ResourceCard from '../shared/ResourceCard'



const ResourcePage = ({ match }) => {
    const isCancelled = React.useRef(false)
    const cloudinaryApi = useFetch("cloudinary")
    const cloudinaryFunctions = useCloudinaryFunctions()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [resource, setResource] = useState<any>(null)
    const [siblingResources, setSiblingResources] = useState<any>([])

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "hhgetwduj"

    const getResource = (): void => {
        let publicKey = match.url.replace("resource/", "")
        let encodedPublicKey = publicKey.replace(/\//g, "%2F")
        setLoading(true)
        cloudinaryApi.get(`resource/${encodedPublicKey}`)
            .then((data: any) => {
                if (!isCancelled.current) {
                    if (data) {
                        console.log(data.resources)
                        setResource(data.resources[0])
                        // getSiblingResources(data.resources[0].filename)
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

    const getSiblingResources = (filename: string): void => {
        let encodedMatchUrl = match.url.replace(`/resource/${filename}`, "").replace(/\//g, "%2F")
        setLoading(true)
        cloudinaryApi.get(`resources/${encodedMatchUrl}`)
            .then((data: any) => {
                if (!isCancelled.current) {
                    if (data) {
                        console.log(JSON.stringify(data))
                        setSiblingResources(data.resources)
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

    const generateBreadcrumbs = (): any => {

        let trimmedUrl = match.url.substr(1).replace(`/resource`, "")
        let breadcrumbs: string[] = trimmedUrl.split("/")

        return (
            cloudinaryFunctions.generateBreadcrumbs(breadcrumbs)
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
                                            cloudName={cloudName}
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
                                        <img alt="placeholder audio" src={require("../../images/audio_placeholder.png")} />
                                        <Video
                                            cloudName={cloudName}
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
                                            cloudName={cloudName}
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
                                        <object data={resource.secure_url}></object>
                                    </div>
                                </>
                            }

                            {/* {siblingResources &&
                                <CarouselProvider
                                    naturalSlideWidth={20}
                                    naturalSlideHeight={20}
                                    totalSlides={8}

                                >
                                    <Slider>
                                        {siblingResources.map((siblingResource, index) => {
                                            return (
                                                <Slide className="slide" key={index} index={index}><ResourceCard resource={siblingResource} matchUrl={match.url}/></Slide>
                                            )
                                        })}
                                    </Slider>
                                    <ButtonBack>Back</ButtonBack>
                                    <ButtonNext>Next</ButtonNext>
                                </CarouselProvider>
                            } */}
                        </>
                    }
                </div>
            }
        </>
    )
}

export default ResourcePage