import React, { useState, useEffect, ComponentState } from "react"
import './season.scss'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'

interface InputProps {
    isDialogOpen: boolean,
    handleClose: () => void,
    updateSeason: (season: App.Season) => void,
    createSeason: (season: App.Season) => void
    season: App.Season,
    isCreateSeasonDialog: boolean
}

const ConfigureSeasonDialog = (props: InputProps) => {

    const [season, setSeason] = useState<App.Season>({ ...props.season })
    const [isSaveSeasonCalled, setIsSaveSeasonCalled] = React.useState<boolean>(false)

    useEffect(() => {
        setSeason(props.season)
    }, [props.season])

    React.useEffect(() => {
        if (isSaveSeasonCalled) {
            if (props.isCreateSeasonDialog) {
                props.createSeason(season)
            } else {
                props.updateSeason(season)
            }

            setSeason({
                _id: "",
                name: "",
                location: "",
                imageUrl: "",
                startDate: new Date(),
                endDate: new Date(),
                teamList: [],
                playerList: [],
                fixtureList: [],
                accoladeList: [],
                isActive: false
            })
    
            setIsSaveSeasonCalled(false)
        }
    }, [isSaveSeasonCalled, props, season])

    const handleStartDateChange = (date) => {
        setSeason({ ...season, startDate: date })
    };

    const handleEndDateChange = (date) => {
        setSeason({ ...season, endDate: date })
    };

    const handleChange = (event) => {
        const { name, value } = event.target
        setSeason({ ...season, [name]: value } as ComponentState)
    }

    const saveSeason = (event) => {
        setIsSaveSeasonCalled(true);
        setSeason({ ...season });
        props.handleClose();
    }

    return (
        <>
            <Dialog
                open={props.isDialogOpen}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Configure Season</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Season Name"
                        type="text"
                        fullWidth
                        value={season.name}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="location"
                        name="location"
                        label="Location"
                        type="text"
                        fullWidth
                        value={season.location}
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
                        value={season.imageUrl}
                        onChange={handleChange}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="Start Date"
                            name="startDate"
                            format="dd/MM/yyyy"
                            value={season.startDate}
                            onChange={handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="End Date"
                            format="dd/MM/yyyy"
                            value={season.endDate}
                            onChange={handleEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveSeason} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfigureSeasonDialog