import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import { Switch, Route } from "react-router-dom"
import { Box } from '@material-ui/core'
import './dynamicContent.scss';
import Loading from '../shared/Loading'
import ResourceCard from '../resource/ResourceCard'
import ResourcePage from '../resource/ResourcePage'
import FolderCard from '../shared/FolderCard'
import useCloudinaryFunctions from "../../hooks/useCloudinaryFunctions"

const DynamicComponent = ({ match }) => {
    const isCancelled = React.useRef(false)
    const cloudinaryApi = useFetch("cloudinary")
    const cloudinaryFunctions = useCloudinaryFunctions()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
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
                        if (data.resources){
                            data.resources = cloudinaryFunctions.sortByPrefix(data.resources)
                        }
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
                        if (data.resources){
                            data.resources = cloudinaryFunctions.sortByPrefix(data.resources)
                        }
                        setFolderContent(data)
                    }
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    const generateBreadcrumbs = (): any => {

        let trimmedUrl = match.url.substr(1)
        let breadcrumbs: string[] = trimmedUrl.split("/")

        return (
            cloudinaryFunctions.generateBreadcrumbs(breadcrumbs, false)
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
                                     <FolderCard key={subFolder.name} folder={subFolder} url={match.url} index={index} /> 
                                )
                            })}
                    </Box>
                </div>}

                {folderContent && <div className="folder-content">
                    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                        {folderContent.resources.map((resource: any, index: number) => {
                            return (
                                <ResourceCard key={index} resource={resource} matchUrl={match.url} index={index} />
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