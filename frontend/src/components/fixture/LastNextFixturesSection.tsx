import React, { useState } from 'react'
import { Paper, Box } from '@material-ui/core'
import moment from 'moment'
import { Link } from 'react-router-dom'

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

    const getResultClass = () => {
        if (previousFixture.result === "WIN") {
            return "win"
        } else if (previousFixture.result === "LOSS") {
            return "loss"
        } else {
            return "draw"
        }
    }

    const getMotm = () => {
        let motm: any = "N/A"
        previousFixture.players.forEach(fixturePlayer => {
            if (fixturePlayer.isMotm) {
                motm = <Link to={'/player/' + fixturePlayer.player._id}>{fixturePlayer.player.firstName.charAt(0)}. {fixturePlayer.player.surname}</Link>
            }
        });
        return motm
    }

    const getTopScorers = (): any => {
        interface TopScorer {
            id: string,
            name: string,
            goalCount: number
        }
        let topScorerList: TopScorer[] = []
        let topScorer: TopScorer = {
            id: "",
            name: "",
            goalCount: 0
        }
        let isMoreThanOneGoalScored = false

        previousFixture.players.forEach(fixturePlayer => {
            if (fixturePlayer.goalCount > topScorer.goalCount) {
                if (fixturePlayer.goalCount > 1) {
                    isMoreThanOneGoalScored = true
                }
                topScorerList = []
                topScorer.goalCount = fixturePlayer.goalCount
                topScorer.name = `${fixturePlayer.player.firstName.charAt(0)}. ${fixturePlayer.player.surname}`
                topScorer.id = fixturePlayer.player._id
                topScorerList.push(topScorer)
            } else if (fixturePlayer.goalCount === topScorer.goalCount) {
                topScorer = { id: "", name: "", goalCount: 0 }
                topScorer.goalCount = fixturePlayer.goalCount
                topScorer.name = `${fixturePlayer.player.firstName.charAt(0)}. ${fixturePlayer.player.surname}`
                topScorer.id = fixturePlayer.player._id

                topScorerList.push(topScorer)
            }
        });

        let topScorerListString: any = ""

        if (topScorerList.length > 1) {
            topScorerListString = "Top Scorers:"
        } else if (topScorerList.length === 1) {
            topScorerListString = "Top Scorer:"
        } else {
            topScorerListString = "N/A"
        }

        return (
            <div className="row">
                <span style={{ display: isMoreThanOneGoalScored ? 'flex' : 'none' }}>
                    {topScorerListString}&nbsp;

                    {
                        topScorerList.map((element, index) => {
                            if ((index + 1) < topScorerList.length) {
                                return (<Link to={'/player/' + element.id}>{element.name}</Link>)
                            } else {
                                return (<div><Link to={'/player/' + element.id}>{element.name}</Link> [{element.goalCount}]</div>)
                            }
                        })
                    }


                </span>
            </div>

        )
    }

    React.useEffect(() => {
        getNextFixture(props.fixtureList);
        getLatestFixture(props.fixtureList)
    }, [props.fixtureList]);

    return (
        <div className="last-next-fixture-section" >
            {/* <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" alignItems="center"> */}
            <Box display="flex" flexDirection="row" justifyContent="space-evenly" alignItems="center">
                <Paper>
                    <h2>Latest Result</h2>
                    <div className="row desktop-view">
                        <span className="lightning-score">
                            Lenton Lightning&nbsp;
                            <span className={getResultClass()}>
                                {calculateGoalsScored()}
                            </span>
                        </span>
                        <span>
                            &nbsp;-&nbsp;
                        </span>
                        <span className="opposition-score">
                            <span className="score">
                                {previousFixture.goalsAgainst}&nbsp;
                            </span>
                            {previousFixture.opposition.name}
                        </span>
                    </div>
                    <div className="mobile-view">
                        <div className="row">
                            <span className="lightning-score">
                                Lenton Lightning:&nbsp;
                            <span className={getResultClass()}>
                                    {calculateGoalsScored()}
                                </span>
                            </span>
                        </div>
                        <div className="row">
                            <span className="opposition-score">
                                {previousFixture.opposition.name}:&nbsp;
                                <span className="score">
                                    {previousFixture.goalsAgainst}
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        <span>MOTM: {getMotm()}</span>
                    </div>
                    {getTopScorers()}
                </Paper>
                <Paper>
                    <h2>Next Fixture</h2>
                    {nextFixture._id ?
                        <>
                            <div className="row">
                                <span className="label">Opposition:&nbsp;</span><span>{nextFixture.opposition.name}</span>
                            </div>
                            <div className="row">
                                <span className="label">Kickoff:&nbsp;</span><span>{moment(nextFixture.kickoffDateTime).format("HH:mm DD/MM/YYYY")}</span>
                            </div>
                            <div className="row">
                                <span className="label">Fixture Type:&nbsp;</span><span>{nextFixture.fixtureType}</span>
                            </div>
                        </>
                        :
                        <>
                            <div className="row"><span><i>No upcoming fixtures</i></span></div>
                            <div className="row"></div>
                            <div className="row"></div>
                        </>
                    }
                </Paper>
            </Box>
        </div>
    )
}

export default LastNextFixturesSection