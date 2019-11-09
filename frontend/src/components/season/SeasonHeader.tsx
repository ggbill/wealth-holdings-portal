import React from "react"
import './season.scss'

interface InputProps {
    season: App.Season
}

const SeasonHeader = (props: InputProps) => {

    return (
        <div className="header-section">
            <div className="season-header">
                <img src={require('../../images/football.jpg')} />
                <div className="season-info">
                    <span className="title">Season: {props.season.name}</span>
                    <span className="sub-title">{props.season.location}</span>
                    <span className="sub-title">{new Intl.DateTimeFormat('en-GB').format(new Date(props.season.startDate))} - {new Intl.DateTimeFormat('en-GB').format(new Date(props.season.endDate))}</span>
                </div>
            </div>
        </div>
    )
}

export default SeasonHeader