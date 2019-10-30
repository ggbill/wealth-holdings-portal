import React from "react"
import './fixture.scss';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ConfigureFixtureDialog from "./ConfigureFixtureDialog"
import { Link } from 'react-router-dom'


interface InputProps {
    fixtureList: App.Fixture[];
    teamList: App.Team[];
    playerList: App.Player[];
    deleteFixture: (id: string) => void
    updateFixture: (fixture: App.Fixture) => void
    createFixture: (fixture: App.Fixture) => void
}

const FixtureTable = (props: InputProps) => {

    const [isAddFixtureDialogOpen, setIsAddFixtureDialogOpen] = React.useState<boolean>(false);
    const [isEditFixtureDialogOpen, setIsEditFixtureDialogOpen] = React.useState<boolean>(false);
    const [fixture, setfixture] = React.useState<App.Fixture>({
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

    const generateScore = (fixture: App.Fixture): string => {

        if (!fixture.oppositionOwnGoals){
            fixture.oppositionOwnGoals = 0
        }

        if (fixture.players.length < 1) {

            return ''

        } else {

            var goalsFor: number = fixture.oppositionOwnGoals

            fixture.players.forEach(fixturePlayer => {
                goalsFor += fixturePlayer.goalCount;
            });

            return `${goalsFor} - ${fixture.goalsAgainst}`;

        }
    }

    const handleAddFixtureDialogClose = () => {
        setIsAddFixtureDialogOpen(false)
        setfixture({
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
    };

    const handleAddFixtureDialogOpen = () => {
        setIsAddFixtureDialogOpen(true)
    };

    const handleEditFixtureDialogClose = () => {
        setIsEditFixtureDialogOpen(false)
        setfixture({
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
    };

    const handleEditFixtureDialogOpen = (fixture: App.Fixture) => {
        setfixture(fixture)
        setIsEditFixtureDialogOpen(true)
    };

    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell >Kickoff</TableCell>
                            <TableCell align="right">Opposition</TableCell>
                            <TableCell align="right">Fixture Type</TableCell>
                            <TableCell align="right">Result</TableCell>
                            <TableCell align="right">Score</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.fixtureList.map((item: App.Fixture) => (
                            <TableRow key={item._id}>
                                <TableCell >
                                    <Link to={'/fixture/' + item._id}>
                                        {new Intl.DateTimeFormat('en-GB', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric'
                                        }).format(new Date(item.kickoffDateTime))}
                                    </Link>
                                </TableCell>
                                <TableCell align="right">{item.opposition.name}</TableCell>
                                <TableCell align="right">{item.fixtureType}</TableCell>
                                <TableCell align="right">{item.result}</TableCell>
                                <TableCell align="right">{generateScore(item)}</TableCell>
                                <TableCell align="right">
                                    <Button variant="text" onClick={() => handleEditFixtureDialogOpen(item)}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="text" onClick={() => props.deleteFixture(item._id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={handleAddFixtureDialogOpen} color="primary">
                    Add
                </Button>
            </Paper>

            {/* Create Fixture Dialog */}
            <ConfigureFixtureDialog
                isFixtureDialogOpen={isAddFixtureDialogOpen}
                handleClose={handleAddFixtureDialogClose}
                createFixture={props.createFixture}
                updateFixture={props.updateFixture}
                teamList={props.teamList}
                playerList={props.playerList}
                isCreateFixtureDialog={true}
                fixture={fixture}
            />

            {/* Edit Fixture Dialog */}
            <ConfigureFixtureDialog
                isFixtureDialogOpen={isEditFixtureDialogOpen}
                handleClose={handleEditFixtureDialogClose}
                createFixture={props.createFixture}
                updateFixture={props.updateFixture}
                teamList={props.teamList}
                playerList={props.playerList}
                isCreateFixtureDialog={false}
                fixture={fixture}
            />

        </>
    )
}

export default FixtureTable