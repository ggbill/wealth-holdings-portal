import React, { useState } from "react"
import './team.scss';
import AddTeamDialog from "./AddTeamDialog"
import { Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

interface InputProps {
    teamList: App.Team[];
    removeTeam: (id: string) => void
    addTeam: (team: App.Team) => void
}

const TeamUnorderedList = (props: InputProps) => {

    const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);

    const handleAddTeamDialogOpen = () => {
        setIsAddTeamDialogOpen(true)
    };

    const handleAddTeamDialogClose = () => {
        setIsAddTeamDialogOpen(false);
    };

    const removeTeam = (id) => {
        props.removeTeam(id);
    }

    return (
        <>
            <ul>
                {props.teamList.map((team: App.Team) => (
                    <li key={team._id}>
                        <span>{team.name}</span>
                        <Button variant="text" onClick={() => removeTeam(team._id)}>
                            <ClearIcon fontSize="small"/>
                        </Button>
                    </li>
                ))}
            </ul>
            <Button onClick={handleAddTeamDialogOpen} color="primary">
                Add
            </Button>

            <AddTeamDialog
                isDialogOpen={isAddTeamDialogOpen}
                handleClose={handleAddTeamDialogClose}
                addTeam={props.addTeam}
                existingTeams={props.teamList}
            />
        </>
    )
}

export default TeamUnorderedList