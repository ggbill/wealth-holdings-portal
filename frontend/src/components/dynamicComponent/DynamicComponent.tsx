import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import { Switch, Route, Link } from "react-router-dom"
import { Box, Card, CardContent, CardActionArea } from '@material-ui/core'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import './dynamicContent.scss';
import Loading from '../shared/Loading'
// import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react'
import ResourceCard from '../shared/ResourceCard'
import ResourcePage from '../resource/ResourcePage'
import HomeIcon from '@material-ui/icons/Home'

const DynamicComponent = ({ match }) => {
    const isCancelled = React.useRef(false);
    const cloudinaryApi = useFetch("cloudinary");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [subFolders, setSubFolders] = useState<any>(null)
    const [folderContent, setFolderContent] = useState<any>(null)

    // API call to Cloudinary based on foldername taken from the match param (match.params.dynamicPath)

    const getSubFolders = (): void => {
        let encodedMatchUrl = match.url.replace(/\//g, "%2F")
        setLoading(true)
        cloudinaryApi.get(`sub-folders/${encodedMatchUrl}`)
            .then((data: any) => {
                if (!isCancelled.current) {
                    if (data) {
                        setSubFolders(data)
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

    const getResources = (): void => {
        let encodedMatchUrl = match.url.replace(/\//g, "%2F")
        setLoading(true)
        cloudinaryApi.get(`resources/${encodedMatchUrl}`)
            .then((data: any) => {
                if (!isCancelled.current) {
                    if (data) {
                        // console.log(JSON.stringify(data))
                        setFolderContent(data)
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

        let trimmedUrl = match.url.substr(1)
        let breadcrumbs: string[] = trimmedUrl.split("/")

        return (
            <div className="breadcrumb-wrapper">
            <span className="home-icon-wrapper"><Link to="/"><HomeIcon /></Link> / </span>
                
                {breadcrumbs.map((breadcrumb, index) => {
                    if (index === breadcrumbs.length - 1) {
                        return (
                            <span key={index}>{breadcrumb}</span>
                        )
                    } else {
                        let breadcrumbLink = "/"
                        breadcrumbs.forEach((sub_breadcrumb, sub_index) => {
                            if (sub_index === index) {
                                breadcrumbLink += `${sub_breadcrumb}`
                            } else if (sub_index === index - 1) {
                                breadcrumbLink += `${sub_breadcrumb}/`
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
        getSubFolders()
        getResources()

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
            {match.isExact && <div className="content">
                <h2>{generateBreadcrumbs()}</h2>
                {loading &&
                    <Loading />
                }
                {!loading && subFolders && <div className="sub-folders">
                    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                        {subFolders.folders.map((subFolder: any, index: number) => {
                            return (
                                <Card key={index} className="folder-card">
                                    <CardActionArea component={Link} to={`${match.url}/${subFolder.name}`}>
                                        <CardContent>
                                            <FolderOpenIcon />
                                            <span className="folder-label">{subFolder.name}</span>
                                            <ArrowForwardIosIcon />
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            )
                        })}
                    </Box>
                </div>}

                {folderContent && <div className="folder-content">
                    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                        {folderContent.resources.map((resource: any, index: number) => {
                            return (
                                <ResourceCard key={index} resource={resource} matchUrl={match.url} />
                            )
                        })}
                    </Box>
                </div>}
            </div>}

            <Switch>
                <Route path={`${match.path}/resource/:filename`} component={ResourcePage} />
                <Route path={`${match.path}/:dynamicPath`} component={DynamicComponent} />
            </Switch>
        </>
    )
}

export default DynamicComponent