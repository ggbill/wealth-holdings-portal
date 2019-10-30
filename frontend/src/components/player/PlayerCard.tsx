import React from "react"
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardActionArea, CardMedia, CardContent, Typography} from '@material-ui/core'
import { Link } from 'react-router-dom'

interface InputProps {
    player: App.Player;
    caps: number;
    goals: number;
    winPercentage: number
}

const useStyles = makeStyles({
    card: {
        width: 345,
        margin: 12
    },
    media: {
        height: 200,
    },
});


const PlayerCard = (props: InputProps) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
                <CardActionArea component={Link} to={`/player/${props.player._id}`}>
                    <CardMedia
                        className={classes.media}
                        image={props.player.imageUrl ? props.player.imageUrl : require("../../images/placeholder_image_logo.png")}
                        title={`${props.player.firstName} ${props.player.surname}`}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.player.firstName} {props.player.surname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Caps: {props.caps}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Goals: {props.goals}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Win %: {props.winPercentage.toFixed(2)}
                        </Typography>
                    </CardContent>
                </CardActionArea>
        </Card>
    )
}

export default PlayerCard