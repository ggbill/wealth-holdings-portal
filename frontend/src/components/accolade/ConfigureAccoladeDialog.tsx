import React, { useState, useEffect } from "react"
import './accolade.scss';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    InputLabel, Select, MenuItem, Input
} from "@material-ui/core";

const ObjectID = require("mongodb").ObjectID;
type ObjectID= typeof import("mongodb").ObjectID;

interface InputProps {
    isDialogOpen: boolean,
    handleClose: () => void,
    updateAccolade: (accolade: App.Accolade) => void,
    createAccolade: (accolade: App.Accolade) => void
    accolade: App.Accolade,
    isCreateAccoladeDialog: boolean,
    playerList: App.Player[]
}

const ConfigureAccoladeDialog = (props: InputProps) => {

    const [accolade, setAccolade] = useState<App.Accolade>({ ...props.accolade })
    const [isSaveAccoladeCalled, setIsSaveAccoladeCalled] = React.useState<boolean>(false)
    const [player, setPlayer] = React.useState({
        _id: "",
        firstName: "",
        surname: "",
        imageUrl: "",
        isActive: true
    });

    useEffect(() => {
        setAccolade(props.accolade)
    }, [props.accolade])

    React.useEffect(() => {
        if (isSaveAccoladeCalled) {
            if (props.isCreateAccoladeDialog) {
                accolade._id = new ObjectID()
                props.createAccolade(accolade)
            } else {
                props.updateAccolade(accolade)
            }

            setAccolade({
                _id: "",
                name: "",
                imageUrl: "",
                player: player,
                isActive: true
            })

            setIsSaveAccoladeCalled(false)
        }
    }, [isSaveAccoladeCalled, props, accolade])

    const handleChange = (event) => {
        const { name, value } = event.target
        setAccolade({ ...accolade, [name]: value })
    }

    const saveAccolade = (event) => {
        setIsSaveAccoladeCalled(true);
        setAccolade({...accolade});
        props.handleClose();
    }

    const handlePlayerChange = (event) => {
        const { value } = event.target

        props.playerList.forEach((player: App.Player) => {
            if (value === player._id) {
                setAccolade({ ...accolade, player: player })
            }
        });
    }

    return (
        <>
            <Dialog
                open={props.isDialogOpen}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Configure Accolade</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={accolade.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="imageUrl"
                        id="imageUld"
                        label="Image URL"
                        type="text"
                        fullWidth
                        value={accolade.imageUrl}
                        onChange={handleChange}
                    />
                    <FormControl style={{ minWidth: '200px' }}>
                        <InputLabel htmlFor="player-select">Player</InputLabel>
                        <Select
                            value={accolade.player._id}
                            onChange={handlePlayerChange}
                            input={<Input id="player-select" />}
                            fullWidth
                        >
                            {props.playerList.map((player: App.Player) => (
                                <MenuItem key={player._id} value={player._id}>
                                    {player.firstName} {player.surname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveAccolade} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfigureAccoladeDialog