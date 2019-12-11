import React from "react"
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, MenuItem, Select, Input
} from "@material-ui/core";

interface InputProps {
    isDialogOpen: boolean,
    handleClose: () => void,
    addPlayer: (player: App.Player) => void
    existingPlayers: App.Player[]
}

const AddPlayerDialog = (props: InputProps) => {

    const url = process.env.PUBLIC_URL || "http://localhost:8080"

    const [player, setPlayer] = React.useState<App.Player>({
        _id: "",
        firstName: "",
        surname: "",
        imageUrl: "",
        isActive: true
    });

    const [allPlayerList, setAllPlayerList] = React.useState<App.Player[]>([])
    const [unselectedPlayerList, setUnselectedPlayerList] = React.useState<App.Player[]>([])

    const handlePlayerChange = (event) => {
        const { value } = event.target

        allPlayerList.forEach((player: App.Player) => {
            if (value === player._id) {
                setPlayer({ ...player })
            }
        });
    }

    const getPlayers = (): void => {
        fetch(`${url}/players/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data: App.Player[]) => {
                setAllPlayerList(data)
                generateUnselectedPlayerList(data)
            })
            .catch(error => {
                console.log(`something didnt work: ${error}`);
            })
    }

    //Only run this hook if the dialog is open
    React.useEffect(() => {
        if (props.isDialogOpen) {
            getPlayers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [props.isDialogOpen]);

    const submitTeam = () => {

        props.addPlayer(player)

        setPlayer({
            _id: "",
            firstName: "",
            surname: "",
            imageUrl: "",
            isActive: true
        })

        props.handleClose()
    }

    const generateUnselectedPlayerList = (allPlayerList: App.Player[]) => {
        var unselectedPlayerList = allPlayerList.filter(player => {
            let isMatch = false;
            props.existingPlayers.forEach(existingPlayer => {
                if (player._id === existingPlayer._id) {
                    isMatch = true;
                }
            });
            return (!isMatch)
        })
        setUnselectedPlayerList(unselectedPlayerList)
    }

    return (
        <>
            <Dialog
                open={props.isDialogOpen}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle>Add Player</DialogTitle>
                <DialogContent>
                    <div style={{display: unselectedPlayerList.length > 0 ? 'block' : 'none' }}>
                        <FormControl style={{ minWidth: '200px' }}>
                            <InputLabel htmlFor="player-select">Player</InputLabel>
                            <Select
                                value={player._id}
                                onChange={handlePlayerChange}
                                input={<Input id="player-select" />}
                                fullWidth
                            >
                                {unselectedPlayerList.map((player: App.Player) => (
                                    <MenuItem key={player._id} value={player._id}>
                                        {player.firstName} {player.surname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{display: unselectedPlayerList.length > 0 ? 'none' : 'block' }}>
                        <p style={{color: 'red'}}>All players selected</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={submitTeam} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddPlayerDialog