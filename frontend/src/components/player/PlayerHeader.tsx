import React, { useState } from "react"
import './player.scss'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

interface InputProps {
    player: App.Player
}


const PlayerHeader = (props: InputProps) => {

    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    return (
        <>
            <div className="header-section">
                <div className="player-header">
                    <img style={{ display: props.player.imageUrl ? 'block' : 'none' }} alt="" src={props.player.imageUrl} onClick={() => setIsLightboxOpen(true)} />
                    <img style={{ display: !props.player.imageUrl ? 'block' : 'none' }} alt="" src={require("../../images/placeholder_image_logo.png")} />
                    <div className="player-info">
                        <span className="title">{props.player.firstName} {props.player.surname}</span>
                    </div>
                </div>
            </div>

            {isLightboxOpen && props.player.imageUrl && (
                <Lightbox
                    mainSrc={props.player.imageUrl}
                    onCloseRequest={() => setIsLightboxOpen(false)}
                />
            )}
        </>
    )
}

export default PlayerHeader 