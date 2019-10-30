import './home.scss'
import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Paper, Grid, Box } from '@material-ui/core'
import moment from 'moment'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            flexGrow: 1,
            margin: '0 12px 12px 12px',
            minWidth: 300,
            fontWeight: "bold"

        },
        win: {
            color: "#2b9813",
            fontWeight: "bold",
            fontSize: "1.4em"
        },
        loss: {
            color: "red",
            fontWeight: "bold",
            fontSize: "1.4em"
        },
        draw: {
            fontWeight: "bold",
            fontSize: "1.4em"
        },
        score: {
            fontSize: "1.4em"
        },
        row: {
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    }),
);

interface InputProps {
    fixtureList: App.Fixture[];
}

const LastNextFixturesSection = (props: InputProps) => {

    const [nextFixture, setNextFixture] = useState<App.Fixture>({
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

    const [previousFixture, setPreviousFixture] = useState<App.Fixture>({
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

    const getLatestFixture = (fixtureList: App.Fixture[]) => {
        const now = new Date();
        // A long time in the past
        let closestDate = new Date(-8640000000000000)

        let mostRecentFixture: App.Fixture = {
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
        };

        fixtureList.forEach((fixture: App.Fixture) => {
            const kickoffDate = new Date(fixture.kickoffDateTime);

            if (kickoffDate <= now && (kickoffDate > closestDate)) {
                closestDate = new Date(fixture.kickoffDateTime)
                mostRecentFixture = fixture;
            }
        });

        setPreviousFixture(mostRecentFixture)

    }

    const getNextFixture = (fixtureList: App.Fixture[]) => {

        const now = new Date();
        // A long time in the future
        let closestDate = new Date(8640000000000000)

        let soonestFixture: App.Fixture = {
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
        };

        fixtureList.forEach((fixture: App.Fixture) => {
            const kickoffDate = new Date(fixture.kickoffDateTime);

            if (kickoffDate >= now && (kickoffDate < closestDate)) {
                closestDate = new Date(fixture.kickoffDateTime)
                soonestFixture = fixture;
            }
        });

        setNextFixture(soonestFixture)
    }

    const calculateGoalsScored = (): number => {
        if (!previousFixture.oppositionOwnGoals) {
            previousFixture.oppositionOwnGoals = 0
        }
        let goalsScored = previousFixture.oppositionOwnGoals
        previousFixture.players.forEach((fixturePlayer: App.FixturePlayer) => {
            goalsScored += fixturePlayer.goalCount
        });

        return goalsScored
    }

    const classes = useStyles();

    const getResultClass = () => {
        if (previousFixture.result == "WIN") {
            return classes.win
        } else if (previousFixture.result == "LOSS") {
            return classes.loss
        } else {
            return classes.draw
        }
    }

    const getMotm = () => {
        let motm = "N/A"
        previousFixture.players.forEach(fixturePlayer => {
            if (fixturePlayer.isMotm) {
                motm = `${fixturePlayer.player.firstName} ${fixturePlayer.player.surname}`
            }
        });
        return motm
    }

    const getTopScorers = () => {
        interface TopScorer {
            name: string,
            goalCount: number
        }
        let topScorerList: TopScorer[] = []
        let topScorer: TopScorer = {
            name: "",
            goalCount: 0
        }
        let isMoreThanOneGoalScored = false

        previousFixture.players.forEach(fixturePlayer => {
            if (fixturePlayer.goalCount > topScorer.goalCount) {
                if (fixturePlayer.goalCount > 1){
                    isMoreThanOneGoalScored = true
                }
                topScorerList = []
                topScorer.goalCount = fixturePlayer.goalCount
                topScorer.name = `${fixturePlayer.player.firstName} ${fixturePlayer.player.surname}`
                topScorerList.push(topScorer)
            } else if (fixturePlayer.goalCount == topScorer.goalCount) {
                topScorer = { name: "", goalCount: 0 }
                topScorer.goalCount = fixturePlayer.goalCount
                topScorer.name = `${fixturePlayer.player.firstName} ${fixturePlayer.player.surname}`

                topScorerList.push(topScorer)
            }
        });

        let topScorerListString = ""

        if (topScorerList.length > 1) {
            topScorerListString = "Top Scorers: "
        } else if (topScorerList.length == 1) {
            topScorerListString = "Top Scorer: "
        } else {
            topScorerListString = "N/A"
        }

        topScorerList.forEach((element, index) => {
            if ((index + 1) < topScorerList.length) {
                topScorerListString += `${element.name}, `
            } else {
                topScorerListString += `${element.name} [${element.goalCount}]`
            }
        });

        return (
            <div className={classes.row}>
                <span style={{ display: isMoreThanOneGoalScored ? 'flex' : 'none' }}>{topScorerListString}</span>
            </div>

        ) 
    }

    React.useEffect(() => {
        getNextFixture(props.fixtureList);
        getLatestFixture(props.fixtureList)
    }, [props.fixtureList]);

    return (
        <div className={classes.root} >
            <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" alignItems="center">
                <Paper className={classes.paper}>
                    <h2>Latest Result</h2>
                    <div className={classes.row}>
                        <span>Lenton Lightning <span className={getResultClass()}>{calculateGoalsScored()}</span> - <span className={classes.score}>{previousFixture.goalsAgainst}</span> {previousFixture.opposition.name}</span>
                    </div>
                    <div className={classes.row}>
                        <span>MOTM: {getMotm()}</span>
                    </div>
                    {getTopScorers()}
                    {/* <div className={classes.row}>
                        <span>{getTopScorers()}</span>
                    </div> */}
                </Paper>
                <Paper className={classes.paper}>
                    <h2>Next Fixture</h2>
                    <div className={classes.row}>
                        <span>Opposition: {nextFixture.opposition.name}</span>
                    </div>
                    <div className={classes.row}>
                        <span>Kickoff: {moment(nextFixture.kickoffDateTime).format("HH:mm D/MM/YYYY")}</span>
                    </div>
                    <div className={classes.row}>
                        <span>Fixture Type: {nextFixture.fixtureType}</span>
                    </div>
                </Paper>
            </Box>
        </div>
    )
}

export default LastNextFixturesSection