import React, { useState, useEffect} from "react"
import './team.scss';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

interface InputProps {
    isDialogOpen: boolean,
    handleClose: () => void,
    updateTeam: (team: App.Team) => void,
    createTeam: (team: App.Team) => void
    team: App.Team,
    isCreateTeamDialog: boolean
}

const ConfigureTeamDialog = (props: InputProps) => {
    const [team, setTeam] = useState<App.Team>({ ...props.team })
    const [isSaveTeamCalled, setIsSaveTeamCalled] = React.useState<boolean>(false)

    useEffect(() => {
        setTeam(props.team)
    }, [props.team])

    React.useEffect(() => {
        if (isSaveTeamCalled) {
            if (props.isCreateTeamDialog) {
                props.createTeam(team)
            } else {
                props.updateTeam(team)
            }

            setTeam({
                _id: "",
                name: "",
                isActive: true
            })
    
            setIsSaveTeamCalled(false)
        }
    }, [isSaveTeamCalled, props, team])

    const handleChange = (event) => {
        const { name, value } = event.target
        setTeam({ ...team, [name]: value })
    }

    const saveTeam = (event) => {
        setIsSaveTeamCalled(true);
        setTeam({ ...team });
        props.handleClose();
    }

    return (
        <>
            <Dialog
                open={props.isDialogOpen}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Configure Team</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        id="name"
                        label="Team Name"
                        type="text"
                        fullWidth
                        value={team.name}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveTeam} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfigureTeamDialog