import './home.scss';
import React, { useState, useRef } from 'react'
import useFetch from "../../hooks/useFetch"
import { Link } from "react-router-dom"
import { Box, Card, CardContent, CardActionArea } from '@material-ui/core'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import Loading from '../shared/Loading';
import FolderCard from '../shared/FolderCard'

const Home = ({ match }) => {
    const isCancelled = useRef(false);
    const cloudinaryApi = useFetch("cloudinary");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [rootFolders, setRootFolders] = useState<any>(null)

    const getFolders = (): void => {
        setLoading(true)
        cloudinaryApi.get("root-folders")
            .then((data: any) => {
                if (data) {
                    if (!isCancelled.current) {
                        setRootFolders(data)
                    }
                }
                setLoading(false)
            })
            .catch((err: Error) => {
                console.log(err)
                setError(err.message)
                setLoading(false)
            })
    }

    React.useEffect(() => {
        getFolders();

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
        <div className="content home-page">
            <div className="intro-section">
                <img className="minion-gif-desktop" alt="minion" src={require("../../images/FoodMinion.gif")} />
                <img className="minion-gif-mobile" alt="minion" src={require("../../images/Maths-food-Minion-mobile.gif")} />
                <div className="text-section">
                    <p>
                        Click on the folders below if you’re hungry to learn mathematics the Mr G way
                    </p>
                </div>
            </div>

            {loading &&
                <Loading />
            }

            {!loading &&
                <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                    {rootFolders && rootFolders.folders.map((rootFolder: any) => {
                        return (
                            <FolderCard key={rootFolder.name} folder={rootFolder} url={match.url} />
                        )
                    })}
                </Box>
            }


        </div>
    )
}

export default Home