import React, { useState } from "react"
import './fixture.scss';
import FixturePlayerDialog from "./FixturePlayerDialog"
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {Table, Button, TableBody, TableCell, TableHead, TableRow, Paper} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

interface InputProps {
    fixturePlayerList: App.FixturePlayer[];
    addFixturePlayer: (fixturePlayer) => void,
    removeFixturePlayer: (fixturePlayer) => void,
    // fixturePlayer: App.FixturePlayer
    playerList: App.Player[]
    isPenalties: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            position: "relative"
        },
        table: {
            minWidth: 650,
        },
    }),
);

const FixturePlayerTable = (props: InputProps) => {
    const classes = useStyles();

    const [isFixturePlayerDialogOpen, setIsFixturePlayerDialogOpen] = useState<boolean>(false)

    const handleClose = () => {
        setIsFixturePlayerDialogOpen(false)
    };

    const handleClickOpen = () => {
        setIsFixturePlayerDialogOpen(true)
    };

    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Is MotM</TableCell>
                            <TableCell align="right">Goals Scored</TableCell>
                            <TableCell align="right" style={{display: props.isPenalties ? 'block' : 'none' }}>
                                Pens Scored
                                </TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { props.fixturePlayerList.map((item: App.FixturePlayer, index) => (
                            <TableRow key={new Date().getTime() + index}>
                                <TableCell >{item.player.firstName} {item.player.surname}</TableCell>
                                <TableCell align="right">{String(item.isMotm)}</TableCell>
                                <TableCell align="right">{item.goalCount}</TableCell>
                                <TableCell align="right" style={{display: props.isPenalties ? 'block' : 'none' }}>{item.penaltyCount}</TableCell>
                                <TableCell align="right">
                                    <Button variant="text" onClick={() => props.removeFixturePlayer(item)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={handleClickOpen} color="primary">
                    Add
                </Button>
            </Paper>

            <FixturePlayerDialog
                isFixturePlayerDialogOpen={isFixturePlayerDialogOpen}
                handleClose={handleClose}
                addFixturePlayer={props.addFixturePlayer}
                playerList={props.playerList}
                fixturePlayerList={props.fixturePlayerList}
                isPenalties={props.isPenalties}
            />
        </>
    )
}

export default FixturePlayerTable