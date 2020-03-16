import React, { useState } from "react"
import './season.scss'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

interface InputProps {
    season: App.Season
}

const SeasonHeader = (props: InputProps) => {

    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    return (
        <>
            <div className="header-section">
                <div className="season-header">
                    <img style={{ display: props.season.imageUrl ? 'block' : 'none' }} alt="" src={props.season.imageUrl} onClick={() => setIsLightboxOpen(true)} />
                    <img style={{ display: !props.season.imageUrl ? 'block' : 'none' }} alt="" src={require('../../images/football.jpg')} />
                    <div className="season-info">
                        <span className="title">Season: {props.season.name}</span>
                        <span className="sub-title">{props.season.location}</span>
                        <span className="sub-title">{new Intl.DateTimeFormat('en-GB').format(new Date(props.season.startDate))} - {new Intl.DateTimeFormat('en-GB').format(new Date(props.season.endDate))}</span>
                    </div>
                </div>
            </div>
            {isLightboxOpen && props.season.imageUrl && (
                <Lightbox
                    mainSrc={props.season.imageUrl}
                    onCloseRequest={() => setIsLightboxOpen(false)}
                />
            )}
        </>
    )
}

export default SeasonHeader