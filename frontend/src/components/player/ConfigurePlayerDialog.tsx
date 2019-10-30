import React, { useState, useEffect} from "react"
import './player.scss';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

interface InputProps {
    isDialogOpen: boolean,
    handleClose: () => void,
    updatePlayer: (player: App.Player) => void,
    createPlayer: (player: App.Player) => void
    player: App.Player,
    isCreatePlayerDialog: boolean
}

const ConfigurePlayerDialog = (props: InputProps) => {

    const [player, setPlayer] = useState<App.Player>({ ...props.player })
    const [isSavePlayerCalled, setIsSavePlayerCalled] = React.useState<boolean>(false)

    useEffect(() => {
        setPlayer(props.player)
    }, [props.player])

    React.useEffect(() => {
        if (isSavePlayerCalled) {
            if (props.isCreatePlayerDialog) {
                props.createPlayer(player)
            } else {
                props.updatePlayer(player)
            }

            setPlayer({
                _id: "",
                firstName: "",
                surname: "",
                imageUrl: "",
                isActive: true
            })
    
            setIsSavePlayerCalled(false)
        }
    }, [isSavePlayerCalled, props, player])

    const handleChange = (event) => {
        const { name, value } = event.target
        setPlayer({ ...player, [name]: value })
    }

    const savePlayer = (event) => {
        setIsSavePlayerCalled(true);
        setPlayer({ ...player });
        props.handleClose();
    }
    return (
        <>
            <Dialog
                open={props.isDialogOpen}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Configure Player</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        id="firstName"
                        label="First Name"
                        type="text"
                        fullWidth
                        value={player.firstName}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="surname"
                        id="surname"
                        label="Surname"
                        type="text"
                        fullWidth
                        value={player.surname}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="imageUrl"
                        name="imageUrl"
                        label="Image URL"
                        type="text"
                        fullWidth
                        value={player.imageUrl}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={savePlayer} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfigurePlayerDialog