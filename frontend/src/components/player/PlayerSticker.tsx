import React from "react"
import './player.scss'
import { Link } from 'react-router-dom'

interface InputProps {
    player: App.Player;
}

const PlayerSticker = (props: InputProps) => {
    return (
        <>
            <Link to={`/player/${props.player._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div className="player-sticker" >
                    <img className="player-image" src={props.player.imageUrl ? props.player.imageUrl : require("../../images/placeholder_image_logo.png")} />
                    <span className="title">{props.player.firstName} {props.player.surname}</span>
                </div>
            </Link>
        </>
    )
}

export default PlayerSticker