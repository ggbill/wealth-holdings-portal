import React from "react"
import './accolade.scss'
import { Card, CardContent, CardMedia } from '@material-ui/core'
import { Link } from 'react-router-dom'

interface InputProps {
    playerAccolade: App.PlayerAccolade,
}

const AccoladeSticker = (props: InputProps) => {

    return (
        <>
            <Link to={`/season/${props.playerAccolade.seasonId}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div className="accolade-sticker" >
                    <img className="accolade-image" src={props.playerAccolade.accolade.imageUrl ? props.playerAccolade.accolade.imageUrl : require("../../images/placeholder_accolade_icon.png")} />
                    <span className="title">{props.playerAccolade.accolade.name}</span>
                    <span className="subtitle">{props.playerAccolade.seasonName}</span>
                    <span className="subtitle">{props.playerAccolade.seasonLocation}</span>
                </div>
            </Link>
        </>
    )
}

export default AccoladeSticker