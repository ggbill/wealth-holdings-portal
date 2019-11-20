import React from "react"
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, MenuItem, Select, Input
} from "@material-ui/core";

interface InputProps {
    isDialogOpen: boolean,
    handleClose: () => void,
    addTeam: (team: App.Team) => void
    existingTeams: App.Team[]
}

const AddTeamDialog = (props: InputProps) => {

    const [team, setTeam] = React.useState<App.Team>({
        _id: "",
        name: "",
        isActive: true
    });

    const [allTeamList, setAllTeamList] = React.useState<App.Team[]>([])
    const [unselectedTeamList, setUnselectedTeamList] = React.useState<App.Team[]>([])

    const handleTeamChange = (event) => {
        const { value } = event.target

        allTeamList.forEach((team: App.Team) => {
            if (value === team._id) {
                setTeam({ ...team })
            }
        });
    }

    const getTeams = (): void => {
        fetch('http://localhost:8080/teams/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data: App.Team[]) => {
                setAllTeamList(data)
                generateUnselectedTeamList(data)
            })
            .catch(error => {
                console.log(`something didnt work: ${error}`);
            })
    }

    //Only run this hook if the dialog is open
    React.useEffect(() => {
        if (props.isDialogOpen) {
            getTeams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [props.isDialogOpen]);

    const submitTeam = () => {

        props.addTeam(team)

        setTeam({
            _id: "",
            name: "",
            isActive: true
        })

        props.handleClose()
    }

    const generateUnselectedTeamList = (allTeamList: App.Team[]) => {
        var unselectedTeamList = allTeamList.filter(team => {
            let isMatch = false;
            props.existingTeams.forEach(existingTeam => {
                if (team._id === existingTeam._id) {
                    isMatch = true;
                }
            });
            return (!isMatch)
        })
        setUnselectedTeamList(unselectedTeamList)
    }

    return (
        <>
            <Dialog
                open={props.isDialogOpen}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle>Add Team</DialogTitle>
                <DialogContent>
                    <div style={{display: unselectedTeamList.length > 0 ? 'block' : 'none' }}>
                        <FormControl style={{ minWidth: '200px' }}>
                            <InputLabel htmlFor="team-select">Team</InputLabel>
                            <Select
                                value={team._id}
                                onChange={handleTeamChange}
                                input={<Input id="team-select" />}
                                fullWidth
                            >
                                {unselectedTeamList.map((team: App.Team) => (
                                    <MenuItem key={team._id} value={team._id}>
                                        {team.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{display: unselectedTeamList.length > 0 ? 'none' : 'block' }}>
                        <p style={{color: 'red'}}>All teams selected</p>
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

export default AddTeamDialog