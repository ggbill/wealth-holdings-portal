import React, { useState } from "react"
import './season.scss';
import ConfigureSeasonDialog from "./ConfigureSeasonDialog"
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom'

interface InputProps {
    seasons: App.Season[];
    deleteSeason: (id: string) => void
    updateSeason: (season: App.Season) => void
    createSeason: (season: App.Season) => void
}

const SeasonTable = (props: InputProps) => {

    const [isEditSeasonDialogOpen, setIsEditSeasonDialogOpen] = useState<boolean>(false);
    const [isAddSeasonDialogOpen, setIsAddSeasonDialogOpen] = useState<boolean>(false);
    const [season, setSeason] = React.useState<App.Season>({
        _id: "",
        name: "",
        location: "",
        startDate: new Date(),
        endDate: new Date(),
        teamList: [],
        playerList: [],
        fixtureList: [],
        isActive: false
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

    const clearSeasonObject = () => {
        setSeason({
            _id: "",
            name: "",
            location: "",
            startDate: new Date(),
            endDate: new Date(),
            teamList: [],
            playerList: [],
            fixtureList: [],
            isActive: false
        })
    }

    const handleEditSeasonDialogOpen = (season: App.Season) => {
        setSeason(season)
        setIsEditSeasonDialogOpen(true)
    };

    const handleEditSeasonDialogClose = () => {
        setIsEditSeasonDialogOpen(false)
        clearSeasonObject()
    };

    const handleAddSeasonDialogOpen = () => {
        setIsAddSeasonDialogOpen(true)
    };

    const handleAddSeasonDialogClose = () => {
        setIsAddSeasonDialogOpen(false)
        clearSeasonObject()
    };

    const deleteSeason = (id) => {
        props.deleteSeason(id)
    }

    const updateSeason = (season: App.Season) => {
        props.updateSeason(season)
        setIsEditSeasonDialogOpen(false)
    }

    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell >Name</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Start Date</TableCell>
                            <TableCell align="right">End Date</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.seasons.map((item: App.Season) => (
                            <TableRow key={item._id}>
                                <TableCell >
                                    <Link to={'/season/' + item._id}>{item.name}</Link>
                                </TableCell>
                                <TableCell align="right">{item.location}</TableCell>
                                <TableCell align="right">{new Intl.DateTimeFormat('en-GB').format(new Date(item.startDate))}</TableCell>
                                <TableCell align="right">{new Intl.DateTimeFormat('en-GB').format(new Date(item.endDate))}</TableCell>
                                <TableCell align="right">
                                    <Button variant="text" onClick={() => handleEditSeasonDialogOpen(item)}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="text" onClick={() => deleteSeason(item._id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={handleAddSeasonDialogOpen} color="primary">
                    Add
                </Button>
            </Paper>

            {/* Edit Season Dialog */}
            <ConfigureSeasonDialog
                handleClose={handleEditSeasonDialogClose}
                updateSeason={updateSeason}
                isDialogOpen={isEditSeasonDialogOpen}
                season={season}
                createSeason={props.createSeason}
                isCreateSeasonDialog={false}
            />

            {/* Add Season Dialog */}
            <ConfigureSeasonDialog
                handleClose={handleAddSeasonDialogClose}
                updateSeason={updateSeason}
                isDialogOpen={isAddSeasonDialogOpen}
                season={season}
                createSeason={props.createSeason}
                isCreateSeasonDialog={true}
            />

        </>
    )
}

export default SeasonTable