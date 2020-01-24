import React, { useState } from "react"
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ConfigurePlayerDialog from "./ConfigurePlayerDialog"

interface InputProps {
    player: App.Player;
    caps: number;
    goals: number;
    winPercentage: number;
    auth: any;
    deletePlayer: (id: string) => void
    updatePlayer: (player: App.Player) => void
    createPlayer: (player: App.Player) => void
}

const PlayerCard = (props: InputProps) => {
    const { isAuthenticated } = props.auth;
    const [isEditPlayerDialogOpen, setIsEditPlayerDialogOpen] = useState<boolean>(false);
    const [player, setPlayer] = React.useState({
        _id: "",
        firstName: "",
        surname: "",
        imageUrl: "",
        isActive: true
    });

    const clearPlayerObject = () => {
        setPlayer({
            _id: "",
            firstName: "",
            surname: "",
            imageUrl: "",
            isActive: true
        })
    }

    const handleEditPlayerDialogOpen = (player: App.Player) => {
        setPlayer(player)
        setIsEditPlayerDialogOpen(true)
    };

    const handleEditPlayerDialogClose = () => {
        setIsEditPlayerDialogOpen(false)
        clearPlayerObject()
    };

    const deletePlayer = (id) => {
        props.deletePlayer(id);
    }

    const updatePlayer = (player: App.Player) => {
        props.updatePlayer(player)
        setIsEditPlayerDialogOpen(false);
    }

    return (
        <>
            <div className="player-card">
                <Card>
                    <CardActionArea component={Link} to={`/player/${props.player._id}`}>
                        <CardMedia
                            image={props.player.imageUrl ? props.player.imageUrl : require("../../images/placeholder_image_logo.png")}
                            title={`${props.player.firstName} ${props.player.surname}`}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {props.player.firstName} {props.player.surname}
                            </Typography>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="horizontal-line"></div>
                                        </td>
                                        <td>Caps:</td>
                                        <td className="value">{props.caps}</td>
                                        <td>
                                            <div className="horizontal-line"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="horizontal-line"></div>
                                        </td>
                                        <td>Goals:</td>
                                        <td className="value">{props.goals}</td>
                                        <td>
                                            <div className="horizontal-line"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="horizontal-line"></div>
                                        </td>
                                        <td>Win %:</td>
                                        <td className="value">{props.winPercentage.toFixed(2)}</td>
                                        <td>
                                            <div className="horizontal-line"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <Typography variant="body2" color="textSecondary" component="p">
                                Caps: {props.caps}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Goals: {props.goals}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Win %: {props.winPercentage.toFixed(2)}
                            </Typography> */}
                        </CardContent>
                    </CardActionArea>
                    {isAuthenticated() &&
                        <CardActions>
                            <Button variant="text" onClick={() => handleEditPlayerDialogOpen(props.player)}>
                                <EditIcon />
                            </Button>
                            <Button variant="text" onClick={() => deletePlayer(props.player._id)}>
                                <DeleteIcon />
                            </Button>
                        </CardActions>
                    }
                </Card>
            </div>

            {/* Edit Player Dialog */}
            <ConfigurePlayerDialog
                handleClose={handleEditPlayerDialogClose}
                updatePlayer={updatePlayer}
                createPlayer={props.createPlayer}
                isDialogOpen={isEditPlayerDialogOpen}
                player={player}
                isCreatePlayerDialog={false}
            />
        </>
    )
}

export default PlayerCard