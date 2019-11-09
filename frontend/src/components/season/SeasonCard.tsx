import React from "react"
import './season.scss'
import { Card, CardActionArea, CardContent } from '@material-ui/core'
import moment from 'moment'
import { Link } from 'react-router-dom'

interface InputProps {
    season: App.Season
}

const SeasonCard = (props: InputProps) => {
    const generateWDL = () => {
        let winCount = 0, drawCount = 0, lossCount = 0;

        props.season.fixtureList.forEach(fixture => {
            if (fixture.result == "WIN") {
                winCount++
            } else if (fixture.result == "DRAW") {
                drawCount++
            } else if (fixture.result == "LOSS") {
                lossCount++
            }
        });

        return (
            `W${winCount} / D${drawCount} / L${lossCount}`
        )
    }

    return (
        <div className="season-card">
            <Card>
                <CardActionArea component={Link} to={`/season/${props.season._id}`}>
                    <CardContent>
                        <div className="left-content">
                            <h3>{props.season.name} ({props.season.location})</h3>
                        </div>
                        <div className="centre-content">
                            <h5>{generateWDL()}</h5>
                        </div>
                        <div className="right-content">
                            <h5>{moment(props.season.startDate).format("DD/MM/YYYY")} - {moment(props.season.endDate).format("DD/MM/YYYY")}</h5>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>

    )
}

export default SeasonCard