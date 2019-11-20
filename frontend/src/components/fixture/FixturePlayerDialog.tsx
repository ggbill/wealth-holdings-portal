import React, { ComponentState } from "react"
import './fixture.scss';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Input
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const ObjectID = require("mongodb").ObjectID;
type ObjectID= typeof import("mongodb").ObjectID;

interface InputProps {
    isFixturePlayerDialogOpen: boolean,
    handleClose: () => void,
    playerList: App.Player[],
    fixturePlayerList: App.FixturePlayer[],
    // fixturePlayer: App.FixturePlayer,
    addFixturePlayer: (fixturePlayer) => void,
    isPenalties: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        formControl: {
        },
    }),
);

const FixturePlayerDialog = (props: InputProps) => {
    const classes = useStyles();

    const [isSetPlayerCalled, setIsSetPlayerCalled] = React.useState<boolean>(false);
    const [playerList] = React.useState<App.Player[]>(
        props.playerList
    )

    const [unselectedPlayerList, setUnselectedPlayerList] = React.useState<App.Player[]>([])

    const [player, setPlayer] = React.useState<App.Player>({
        _id: "",
        firstName: "",
        surname: "",
        imageUrl: "",
        isActive: true
    });

    // const [fixturePlayer, setFixturePlayer] = React.useState<App.FixturePlayer>({ ...props.fixturePlayer });
    const [fixturePlayer, setFixturePlayer] = React.useState<App.FixturePlayer>({
        _id: new ObjectID(),
        player: player,
        goalCount: 0,
        penaltyCount: 0,
        isMotm: false
    });

    const handlePlayerChange = (event) => {
        const { value } = event.target

        playerList.forEach((player: App.Player) => {
            if (value === player._id) {
                setPlayer({ ...player })
                setIsSetPlayerCalled(true);
            }
        });
    }

    const handleFixturePlayerChange = (event) => {
        const { name, value, type, checked } = event.target
        type === "checkbox" ? setFixturePlayer({ ...fixturePlayer, [name]: checked } as ComponentState) : setFixturePlayer({ ...fixturePlayer, [name]: value } as ComponentState)
    }

    const submitFixturePlayer = () => {

        props.addFixturePlayer(fixturePlayer)

        setPlayer({
            _id: "",
            firstName: "",
            surname: "",
            imageUrl: "",
            isActive: true
        })

        setFixturePlayer({
            _id: new ObjectID(),
            player: player,
            goalCount: 0,
            penaltyCount: 0,
            isMotm: false
        })

        props.handleClose()
    }

    const generateUnselectedPlayerList = () => {
        var unselectedPlayerList = props.playerList.filter(player => {
            let isMatch = false;
            props.fixturePlayerList.forEach((existingFixturePlayer: App.FixturePlayer) => {
                if (player._id === existingFixturePlayer.player._id) {
                    isMatch = true;
                }
            });
            return (!isMatch)
        })
        setUnselectedPlayerList(unselectedPlayerList)
    }

    React.useEffect(() => {
        if (isSetPlayerCalled) {
            setFixturePlayer({ ...fixturePlayer, player: player })
            setIsSetPlayerCalled(false);
        }
    }, [fixturePlayer, player, isSetPlayerCalled]);


    React.useEffect(() => {
        generateUnselectedPlayerList() 
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [props.fixturePlayerList])

    return (
        <>

            <Dialog
                open={props.isFixturePlayerDialogOpen}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Fixture Player</DialogTitle>
                <DialogContent className="fixture-player-dialog-content">
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="select-player">Player</InputLabel>
                        <Select
                            value={player._id}
                            onChange={handlePlayerChange}
                            input={<Input id="select-player" />}
                            fullWidth
                        >
                            {unselectedPlayerList.map((player: App.Player) => (
                                <MenuItem key={player._id} value={player._id}>
                                    {`${player.firstName} ${player.surname}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isMotm"
                                checked={fixturePlayer.isMotm}
                                onChange={handleFixturePlayerChange}
                            />
                        } label="Is Man of the Match?"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="goalCount"
                        label="Goals Scored"
                        type="number"
                        fullWidth
                        value={fixturePlayer.goalCount}
                        onChange={handleFixturePlayerChange}
                    />
                    <TextField
                        style={{display: props.isPenalties ? 'block' : 'none' }}
                        autoFocus
                        margin="dense"
                        name="penaltyCount"
                        label="Penalties Scored"
                        type="number"
                        fullWidth
                        value={fixturePlayer.penaltyCount}
                        onChange={handleFixturePlayerChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={submitFixturePlayer} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default FixturePlayerDialog