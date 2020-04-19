import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import { Video, Image } from 'cloudinary-react'
import Loading from '../shared/Loading'
import './resourcePage.scss'
import useCloudinaryFunctions from "../../hooks/useCloudinaryFunctions"
import ResourceBadge from './ResourceBadge'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import useMediaQuery from '@material-ui/core/useMediaQuery';



const ResourcePage = ({ match }) => {
    const isCancelled = React.useRef(false)
    const cloudinaryApi = useFetch("cloudinary")
    const cloudinaryFunctions = useCloudinaryFunctions()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [resource, setResource] = useState<any>(null)
    const [siblingResources, setSiblingResources] = useState<any>([])
    const [resourceIndex, setResourceIndex] = useState<number>(0)
    const [isResourceBadgeClicked, setIsResourceBadgeClicked] = useState<boolean>(false)

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "hhgetwduj"
    const isMobile = useMediaQuery('(max-width:400px)');
    const isTablet = useMediaQuery('(max-width:600px) and (min-width: 401px)');

    const calculateCenterSlidePercentage = (): number => {

        if (isMobile) {
            //mobile
            return 60
        } else if (isTablet) {
            //tablet
            return 42
        } else {
            //pc
            return 32
        }
    }

    const getResource = (): void => {
        let publicKey = match.url.replace("resource/", "")
        let encodedPublicKey = publicKey.replace(/\//g, "%2F")
        setLoading(true)
        cloudinaryApi.get(`resource/${encodedPublicKey}`)
            .then((data: any) => {
                if (!isCancelled.current) {
                    if (data) {
                        // console.log(data.resources)
                        setResource(data.resources[0])
                        getSiblingResources(data.resources[0].filename)
                    }
                    setLoading(false)
                    setIsResourceBadgeClicked(false)
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
        // console.log(`encodedMatchUrl: ${encodedMatchUrl}`)
        setLoading(true)
        cloudinaryApi.get(`resources/${encodedMatchUrl}`)
            .then((data: any) => {
                if (!isCancelled.current) {
                    if (data) {
                        if (data.resources) {
                            data.resources = cloudinaryFunctions.sortByPrefix(data.resources)

                            //filter the current video from the siblings list
                            let filteredArray = data.resources.filter(resource => resource.filename !== filename)
                            setSiblingResources(filteredArray)

                            //find the index number of the current video
                            data.resources.map((resource, index) => {
                                if (resource.filename === filename) {
                                    setResourceIndex(index)
                                }
                            })
                        }
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
            cloudinaryFunctions.generateBreadcrumbs(breadcrumbs, true)
        )
    }

    const handleIsResourceBadgeClicked = () => {
        setIsResourceBadgeClicked(true)
    };

    //only do this when resource badge is clicked (to reload page)
    React.useEffect(() => {
        if (isResourceBadgeClicked){
            getResource()
        }
    }, [isResourceBadgeClicked]);


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
                                    {resource.context &&
                                        <>
                                            {resource.context.caption &&
                                                <h1>{resource.context.caption}</h1>
                                            }

                                            {resource.context.alt &&
                                                <span className="intro-text">{resource.context.alt}</span>
                                            }
                                        </>
                                    }


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
                                    {resource.context &&
                                        <>
                                            {resource.context.caption &&
                                                <h1>{resource.context.caption}</h1>
                                            }

                                            {resource.context.alt &&
                                                <span className="intro-text">{resource.context.alt}</span>
                                            }
                                        </>
                                    }
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
                                    {resource.context &&
                                        <>
                                            {resource.context.caption &&
                                                <h1>{resource.context.caption}</h1>
                                            }

                                            {resource.context.alt &&
                                                <span className="intro-text">{resource.context.alt}</span>
                                            }
                                        </>
                                    }
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
                                    {resource.context &&
                                        <>
                                            {resource.context.caption &&
                                                <h1>{resource.context.caption}</h1>
                                            }

                                            {resource.context.alt &&
                                                <span className="intro-text">{resource.context.alt}</span>
                                            }
                                        </>
                                    }
                                    <div className="resource-wrapper">
                                        <object data={resource.secure_url}></object>
                                    </div>
                                </>
                            }

                            {siblingResources &&
                                <Carousel
                                    showThumbs={false}
                                    selectedItem={resourceIndex}
                                    centerMode={true}
                                    centerSlidePercentage={calculateCenterSlidePercentage()}
                                    infiniteLoop={true}
                                    showStatus={false}
                                    showIndicators={false}
                                    showArrows={isMobile || isTablet ? false : true}
                                    swipeScrollTolerance={8}

                                >
                                    {siblingResources.map((siblingResource, index) => {
                                        return (
                                            <ResourceBadge resource={siblingResource} matchUrl={match.url} index={index} key={index} setIsResourceBadgeClicked={handleIsResourceBadgeClicked} />
                                        )
                                    })}
                                </Carousel>
                            }
                        </>
                    }
                </div>
            }
        </>
    )
}

export default ResourcePage