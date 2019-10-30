import React, { useState } from "react"
import './player.scss';
import AddPlayerDialog from "./AddPlayerDialog"
import { Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

interface InputProps {
    playerList: App.Player[];
    removePlayer: (id: string) => void
    addPlayer: (player: App.Player) => void
}

const PlayerUnorderedList = (props: InputProps) => {

    const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);

    const handleAddPlayerDialogOpen = () => {
        setIsAddPlayerDialogOpen(true)
    };

    const handleAddPlayerDialogClose = () => {
        setIsAddPlayerDialogOpen(false);
    };

    const removePlayer = (id) => {
        props.removePlayer(id);
    }

    return (
        <>
            <ul>
                {props.playerList.map((player: App.Player) => (
                    <li key={player._id}>
                        <span>{player.firstName} {player.surname}</span>
                        <Button variant="text" onClick={() => removePlayer(player._id)}>
                            <ClearIcon fontSize="small"/>
                        </Button>
                    </li>
                ))}
            </ul>
            <Button onClick={handleAddPlayerDialogOpen} color="primary">
                Add
            </Button>

            <AddPlayerDialog
                isDialogOpen={isAddPlayerDialogOpen}
                handleClose={handleAddPlayerDialogClose}
                addPlayer={props.addPlayer}
                existingPlayers={props.playerList}
            />
        </>
    )
}

export default PlayerUnorderedList