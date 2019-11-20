import React from "react"
import './player.scss'

interface InputProps {
    player: App.Player
}


const PlayerHeader = (props: InputProps) => {
    return (
        <div className="header-section">
            <div className="player-header">
                <img alt="" src={props.player.imageUrl ? props.player.imageUrl : require("../../images/placeholder_image_logo.png")} />
                <div className="player-info">
                    <span className="title">{props.player.firstName} {props.player.surname}</span>
                </div>
            </div>
        </div>
    )
}

export default PlayerHeader 