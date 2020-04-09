import React, { useState } from 'react'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Link } from "react-router-dom"
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import './folderCard.scss';

interface InputProps {
    folder: any,
    url: string
}

const FolderCard = (props: InputProps) => {
    return (
        <Card className="folder-card">
            <CardActionArea component={Link} to={`${props.url}${props.folder.name}`}>
                <CardContent>
                    <FolderOpenIcon />
                    <span className="folder-label">{props.folder.name}</span>
                    <ArrowForwardIosIcon />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default FolderCard