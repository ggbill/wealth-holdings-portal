import React, { ComponentState } from "react"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FixturePlayerTable from './FixturePlayerTable';

const ObjectID = require("mongodb").ObjectID;
type ObjectID = typeof import("mongodb").ObjectID;

interface InputProps {
    isFixtureDialogOpen: boolean,
    handleClose: () => void,
    createFixture: (fixture: App.Fixture) => void,
    updateFixture: (fixture: App.Fixture) => void,
    teamList: App.Team[]
    playerList: App.Player[]
    isCreateFixtureDialog: boolean
    fixture: App.Fixture
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        }
    }),
);

const ConfigureFixtureDialog = (props: InputProps) => {

    const classes = useStyles();

    const [isSaveFixtureCalled, setIsSaveFixtureCalled] = React.useState<boolean>(false);
    const [isSaveFixturePlayerCalled, setIsSaveFixturePlayerCalled] = React.useState<boolean>(false);

    const [opposition, setOpposition] = React.useState<App.Team>({
        _id: "",
        name: "",
        isActive: true
    });

    const [player, setPlayer] = React.useState<App.Player>({
        _id: "",
        firstName: "",
        surname: "",
        imageUrl: "",
        isActive: true
    });

    const [fixturePlayer, setFixturePlayer] = React.useState<App.FixturePlayer>({
        _id: "",
        player: player,
        goalCount: 0,
        penaltyCount: 0,
        isMotm: false
    });

    const [fixturePlayerList, setFixturePlayerList] = React.useState<App.FixturePlayer[]>([]);

    const [fixture, setFixture] = React.useState<App.Fixture>({ ...props.fixture });

    React.useEffect(() => {
        if (props.isCreateFixtureDialog === false && props.fixture._id) {
            setFixture({ ...props.fixture })
            setOpposition( props.fixture.opposition )
            setFixturePlayerList(props.fixture.players)
        }
    }, [props.fixture]);

    //use the useEffect hook to only call the props.createFixture method once the createdFixture has been updated
    React.useEffect(() => {
        if (isSaveFixtureCalled) {
            if (props.isCreateFixtureDialog) {
                props.createFixture(fixture)
            } else {
                props.updateFixture(fixture)
            }

            //Reset values
            setFixture({
                _id: "",
                fixtureType: "",
                kickoffDateTime: new Date(),
                result: "",
                goalsAgainst: 0,
                oppositionOwnGoals: 0,
                isPenalties: false,
                opposition: {
                    _id: "",
                    name: "",
                    isActive: true
                },
                players: [],
                isActive: true
            })

            setOpposition({
                _id: "",
                name: "",
                isActive: true
            })

            setFixturePlayerList([])

            setIsSaveFixtureCalled(false)
        }
    }, [fixture, isSaveFixtureCalled, props]);

    React.useEffect(() => {
        if (isSaveFixturePlayerCalled) {
            var updatedList = fixturePlayerList.concat(fixturePlayer);
            setFixturePlayerList(updatedList);

            //Reset values
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
            setIsSaveFixturePlayerCalled(false);
        }

    }, [fixturePlayer, fixturePlayerList, isSaveFixturePlayerCalled, player]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target
        type === "checkbox" ? setFixture({ ...fixture, [name]: checked } as ComponentState) : setFixture({ ...fixture, [name]: value } as ComponentState)
    }

    const handleKickoffDateChange = (date) => {
        setFixture({ ...fixture, kickoffDateTime: date })
    };

    const addFixturePlayer = (fixturePlayer) => {
        setIsSaveFixturePlayerCalled(true);
        setFixturePlayer({ ...fixturePlayer })
    }

    const removeFixturePlayer = (fixturePlayerToDelete: App.FixturePlayer) => {
        let indexToSplice;
        fixturePlayerList.forEach((fixturePlayer, index) => {
            if (fixturePlayerToDelete._id === fixturePlayer._id) {
                indexToSplice = index;
            }
        });
        let newList = [...fixturePlayerList]
        newList.splice(indexToSplice, 1);
        setFixturePlayerList(newList)
    }

    const handleOppositionChange = (event) => {
        const { value } = event.target
        props.teamList.forEach((team: App.Team) => {
            if (value === team._id) {
                setOpposition({ ...team });
            }
        });
    }

    const saveFixture = (event) => {
        setIsSaveFixtureCalled(true);
        setFixture({ ...fixture, opposition: opposition, players: fixturePlayerList });
        props.handleClose();
    }

    return (
        <Dialog
            open={props.isFixtureDialogOpen}
            onClose={props.handleClose}
            maxWidth='lg'
        >
            <DialogTitle id="form-dialog-title">Configure Fixture</DialogTitle>
            <DialogContent className="fixture-dialog-content">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDateTimePicker
                        variant="inline"
                        ampm={false}
                        id="kickoffDateTime"
                        label="Kick Off"
                        name="kickoffDateTime"
                        format="HH:mm dd/MM/yyyy"
                        value={fixture.kickoffDateTime}
                        onChange={handleKickoffDateChange}
                        fullWidth
                    />
                </MuiPickersUtilsProvider>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="opposition">Opposition:</InputLabel>
                    <Select
                        value={opposition._id}
                        onChange={handleOppositionChange}
                        name="opposition"
                        inputProps={{
                            name: 'opposition',
                            id: 'opposition',
                        }}
                    >
                        {props.teamList.map((team: App.Team) => (
                            <MenuItem key={team._id} value={team._id}>{`${team.name}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="fixtureType">Fixture Type:</InputLabel>
                    <Select
                        value={fixture.fixtureType}
                        onChange={handleChange}
                        name="fixtureType"
                    >
                        <MenuItem value="LEAGUE">League</MenuItem>
                        <MenuItem value="SEMI-FINAL">Semi Final</MenuItem>
                        <MenuItem value="FINAL">Final</MenuItem>
                        <MenuItem value="3RD-PLACE-PLAYOFF">3rd Place Playoff</MenuItem>
                        <MenuItem value="LAST-PLACE-PLAYOFF">Last Place Playoff</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="result">Result:</InputLabel>
                    <Select
                        value={fixture.result}
                        onChange={handleChange}
                        name="result"
                    >
                        <MenuItem value="WIN">Win</MenuItem>
                        <MenuItem value="LOSS">Loss</MenuItem>
                        <MenuItem value="DRAW">Draw</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    autoFocus
                    margin="dense"
                    name="goalsAgainst"
                    label="Goals Conceeded"
                    type="number"
                    fullWidth
                    value={fixture.goalsAgainst}
                    onChange={handleChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="oppositionOwnGoals"
                    label="Opposition Own Goals"
                    type="number"
                    fullWidth
                    value={fixture.oppositionOwnGoals}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="isPenalties"
                            checked={fixture.isPenalties}
                            onChange={handleChange}
                        />
                    } label="Went to Penalties?"
                />
                <br />
                <div className="table-wrapper">
                    <FixturePlayerTable
                        fixturePlayerList={fixturePlayerList}
                        addFixturePlayer={addFixturePlayer}
                        removeFixturePlayer={removeFixturePlayer}
                        // fixturePlayer={fixturePlayer}
                        playerList={props.playerList} 
                        isPenalties={fixture.isPenalties}
                    />
                </div>

                <br />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                    </Button>
                <Button onClick={saveFixture} color="primary">
                    Save
                    </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfigureFixtureDialog