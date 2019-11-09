import React, { useState } from "react"
import './team.scss';
import ConfigureTeamDialog from "./ConfigureTeamDialog"
import Button from "@material-ui/core/Button";
import App from "../../App";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

interface InputProps {
    teams: App.Team[];
    deleteTeam: (id: string) => void
    updateTeam: (team: App.Team) => void
    createTeam: (team: App.Team) => void
}

const CreateTeamTable = (props: InputProps) => {

    const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState<boolean>(false);
    const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState<boolean>(false);
    const [team, setTeam] = React.useState({
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

    const clearTeamObject = () => {
        setTeam({
            _id: "",
            name: "",
            isActive: true
        })
    }

    const handleEditTeamDialogOpen = (team: App.Team) => {
        setTeam(team)
        setIsEditTeamDialogOpen(true)
    };

    const handleEditTeamDialogClose = () => {
        setIsEditTeamDialogOpen(false)
        clearTeamObject()
    };

    const handleAddTeamDialogOpen = () => {
        setIsAddTeamDialogOpen(true)
    };

    const handleAddTeamDialogClose = () => {
        setIsAddTeamDialogOpen(false)
        clearTeamObject()
    };

    const deleteTeam = (id) => {
        props.deleteTeam(id);
    }

    const updateTeam = (team: App.Team) => {
        props.updateTeam(team)
        setIsEditTeamDialogOpen(false);
    }

    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.teams.map((item: App.Team) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">
                                    <Button variant="text" onClick={() => handleEditTeamDialogOpen(item)}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="text" onClick={() => deleteTeam(item._id)}>
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

            {/* Edit Team Dialog */}
            <ConfigureTeamDialog
                handleClose={handleEditTeamDialogClose}
                updateTeam={updateTeam}
                isDialogOpen={isEditTeamDialogOpen}
                team={team}
                createTeam={props.createTeam}
                isCreateTeamDialog={false}
            />

            {/* Create Team Dialog */}
            <ConfigureTeamDialog
                handleClose={handleAddTeamDialogClose}
                updateTeam={updateTeam}
                isDialogOpen={isAddTeamDialogOpen}
                team={team}
                createTeam={props.createTeam}
                isCreateTeamDialog={true}
            />

        </>
    )
}

export default CreateTeamTable