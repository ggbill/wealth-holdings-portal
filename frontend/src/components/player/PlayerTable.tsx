import React, { useState } from "react"
import './player.scss';
import ConfigurePlayerDialog from "./ConfigurePlayerDialog"
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Table, Button, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom'

interface InputProps {
    players: App.Player[];
    deletePlayer: (id: string) => void
    updatePlayer: (player: App.Player) => void
    createPlayer: (player: App.Player) => void
}

const PlayerTable = (props: InputProps) => {

    const [isEditPlayerDialogOpen, setIsEditPlayerDialogOpen] = useState<boolean>(false);
    const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState<boolean>(false);
    const [player, setPlayer] = React.useState({
        _id: "",
        firstName: "",
        surname: "",
        imageUrl: "",
        isActive: true
    });

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100%',
                marginTop: theme.spacing(3),
                overflowX: 'auto',
            },
            table: {
                minWidth: 650,
            },
        }),
    );

    const classes = useStyles();

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

    const handleAddPlayerDialogOpen = () => {
        setIsAddPlayerDialogOpen(true)
    };

    const handleAddPlayerDialogClose = () => {
        setIsAddPlayerDialogOpen(false)
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
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell >Name</TableCell>
                            <TableCell align="right">Image URL</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.players.map((item: App.Player) => (
                            <TableRow key={item._id}>
                                <TableCell>
                                    <Link to={'/player/' + item._id}>{item.firstName} {item.surname}</Link>
                                </TableCell>
                                <TableCell align="right">{item.imageUrl}</TableCell>
                                <TableCell align="right">
                                    <Button variant="text" onClick={() => handleEditPlayerDialogOpen(item)}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="text" onClick={() => deletePlayer(item._id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={handleAddPlayerDialogOpen} color="primary">
                    Add
                </Button>
            </Paper>

            {/* Edit Player Dialog */}
            <ConfigurePlayerDialog
                handleClose={handleEditPlayerDialogClose}
                updatePlayer={updatePlayer}
                createPlayer={props.createPlayer}
                isDialogOpen={isEditPlayerDialogOpen}
                player={player}
                isCreatePlayerDialog={false}
            />

            {/* Create Player Dialog */}
            <ConfigurePlayerDialog
                handleClose={handleAddPlayerDialogClose}
                updatePlayer={updatePlayer}
                createPlayer={props.createPlayer}
                isDialogOpen={isAddPlayerDialogOpen}
                player={player}
                isCreatePlayerDialog={true}
            />

        </>
    )
}

export default PlayerTable