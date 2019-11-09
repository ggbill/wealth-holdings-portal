import React from "react"
import './player.scss'

interface InputProps {
    player: App.Player
}

const PlayerHeader = (props: InputProps) => {

    return (
        <div className="header-section">
            <div className="player-header">
                <img src={props.player.imageUrl} />
                <div className="player-info">
                    <span className="title">{props.player.firstName} {props.player.surname}</span>
                </div>
            </div>
        </div>
    )
}

export default PlayerHeader 