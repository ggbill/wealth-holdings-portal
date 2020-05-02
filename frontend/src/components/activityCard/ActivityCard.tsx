import React from 'react'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { Link } from "react-router-dom"
import './activityCard.scss';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BallotIcon from '@material-ui/icons/Ballot';
import GroupIcon from '@material-ui/icons/Group';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DescriptionIcon from '@material-ui/icons/Description';
import GavelIcon from '@material-ui/icons/Gavel';
import LanguageIcon from '@material-ui/icons/Language';

interface InputProps {
    activitySummary: App.ActivitySummary
    index: number
}

const determineActivityIcon = (activityName: string) => {
    if (activityName === "Onboard Lead"){
        return (<GroupIcon />)
    } else if (activityName === "Initial Fee Payment"){
        return (<CreditCardIcon />)
    } else if (activityName === "High Level Due Diligence"){
        return (<BallotIcon />)
    } else if (activityName === "Heads of Terms"){
        return (<DescriptionIcon />)
    } else if (activityName === "Detailed Due Diligence"){
        return (<ListAltIcon />)
    } else if (activityName === "Formal Offer"){
        return (<GavelIcon />)
    } else if (activityName === "Transaction Agreement"){
        return (<DescriptionIcon />)
    } else if (activityName === "Final Fee Payment"){
        return (<CreditCardIcon />)
    } else if (activityName === "Total Instances"){
        return (<LanguageIcon />)
    } else{
        return (<AccountTreeIcon />)
    }    
}

const ActivityCard = (props: InputProps) => {

    return (
        <>
            <Card style={{ animationDelay: `${props.index * 0.1}s` }} className="activity-card">
                <CardActionArea component={Link} to={`/${props.activitySummary.link}`}>
                    <CardContent>
                        <div className="icon-wrapper">
                            {determineActivityIcon(props.activitySummary.name)}
                        </div>

                        <span className="activity-label">{props.activitySummary.name}</span>
                        <span className="instance-count">{props.activitySummary.totalCount}</span>

                        <div className="rag-wrapper">
                            <div className="green">
                            <span>On Time:</span>
                                <span>{props.activitySummary.greenCount}</span>
                            </div>
                            <div className="amber">
                            <span>At Risk:</span>
                                <span>{props.activitySummary.amberCount}</span>
                            </div>
                            <div className="red">
                                <span>Overdue:</span>
                                <span>{props.activitySummary.redCount}</span>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}

export default ActivityCard