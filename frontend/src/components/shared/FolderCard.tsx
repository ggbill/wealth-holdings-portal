import React, { useState } from 'react'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Link } from "react-router-dom"
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import './folderCard.scss';

interface InputProps {
    folder: any,
    url: string,
    index: number
}


const FolderCard = (props: InputProps) => {

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

    return (
        <>
            {props.url === "/" ?
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} className="folder-card">
                    <CardActionArea component={Link} to={`${props.url}${props.folder.name}`}>
                        <CardContent>
                            {/* <span className="folder-label">{props.folder.name.replace(/_/g, " ")}</span> */}
                            <span className="folder-label">{cleanFolderName(props.folder.name)}</span>
                        </CardContent>
                    </CardActionArea>
                </Card> :
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} className="folder-card">
                    <CardActionArea component={Link} to={`${props.url}/${props.folder.name}`}>
                        <CardContent>
                            <span className="folder-label">{cleanFolderName(props.folder.name)}</span>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }
        </>
    )
}

export default FolderCard