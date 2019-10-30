import React, { useState } from "react"
import './team.scss';
import AddTeamDialog from "./AddTeamDialog"
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

interface InputProps {
    teamList: App.Team[];
    removeTeam: (id: string) => void
    addTeam: (team: App.Team) => void
}

const AddTeamTable = (props: InputProps) => {

    const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = React.useState({
        _id: "",
        name: "",
        isActive: true
    });

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100%',
                marginTop: theme.spacing(3),
                overflowX: 'auto',
            },
            table: {
                minWidth: 650,
            },
        }),
    );

    const classes = useStyles();

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
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team Name</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.teamList.map((team: App.Team, index) => (
                            <TableRow key={new Date().getTime() + index}>
                                <TableCell >{team.name}</TableCell>
                                <TableCell align="right">
                                    <Button variant="text" onClick={() => removeTeam(team._id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={handleAddTeamDialogOpen} color="primary">
                    Add
                </Button>
            </Paper>
            <AddTeamDialog
                isDialogOpen={isAddTeamDialogOpen}
                handleClose={handleAddTeamDialogClose}
                addTeam={props.addTeam}
                existingTeams={props.teamList} 
            />

        </>
    )
}

export default AddTeamTable