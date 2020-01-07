import React, { useState } from "react"
import './season.scss'
import TeamUnorderedList from "../team/TeamUnorderedList"
import PlayerSeasonStatsTable from "../player/PlayerSeasonStatsTable"
import useFetch from "../../hooks/useFetch"
import PlayerUnorderedList from "../player/PlayerUnorderedList"
import moment from 'moment'
import FixtureCard from '../fixture/FixtureCard'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Button, Box } from "@material-ui/core";
import ConfigureFixtureDialog from "../fixture/ConfigureFixtureDialog"
import SeasonHeader from "./SeasonHeader"
import {
    useParams
} from "react-router-dom";
import Loading from "../shared/Loading"
import AccoladeCard from "../accolade/AccoladeCard"
import ConfigureAccoladeDialog from "../accolade/ConfigureAccoladeDialog"

interface InputProps {
    auth: any
}

const Season = (props: InputProps) => {
    const { isAuthenticated } = props.auth;
    const { id } = useParams();

    const seasonsApi = useFetch("seasons");

    const fixturesApi = useFetch("fixtures");

    const [seasonId] = React.useState<string>(
        // match.params.id
        id
    );

    const [season, setSeason] = React.useState<App.Season>({
        _id: "",
        name: "",
        location: "",
        startDate: new Date(),
        endDate: new Date(),
        teamList: [],
        playerList: [],
        fixtureList: [],
        accoladeList: [],
        isActive: false
    });

    const [teamList, setTeamList] = useState<App.Team[]>([])
    const [accoladeList, setAccoladeList] = useState<App.Accolade[]>([])
    const [isTeamUpdated, setIsTeamUpdated] = useState<boolean>(false)
    const [playerList, setPlayerList] = useState<App.Player[]>([])
    const [isPlayerUpdated, setIsPlayerUpdated] = useState<boolean>(false)
    const [isAccoladeUpdated, setIsAccoladeUpdated] = useState<boolean>(false)
    const [fixtureList, setFixtureList] = useState<App.Fixture[]>([])
    const [isFixtureUpdated, setIsFixtureUpdated] = useState<boolean>(false)
    const [isSeasonUpdated, setIsSeasonUpdated] = useState<boolean>(false)
    const [futureFixtureList, setFutureFixtureList] = useState<App.Fixture[]>([]);
    const [pastFixtureList, setPastFixtureList] = useState<App.Fixture[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isAddFixtureDialogOpen, setIsAddFixtureDialogOpen] = React.useState<boolean>(false);
    const [isAddAccoladeDialogOpen, setIsAddAccoladeDialogOpen] = React.useState<boolean>(false);
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
    const [accolade, setAccolade] = React.useState<App.Accolade>({
        _id: "",
        name: "",
        imageUrl: "",
        player: {
            _id: "",
            firstName: "",
            surname: "",
            imageUrl: "",
            isActive: true
        },
        isActive: true
    })

    const getSeasonById = (seasonId: string): void => {
        setLoading(true)
        seasonsApi.get(seasonId)
            .then((data: App.Season) => {
                setSeason(data)
                setTeamList(data.teamList)
                setPlayerList(data.playerList)
                setFixtureList(data.fixtureList)
                sortFixtures(data)
                setAccoladeList(data.accoladeList)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const updateSeason = (season: App.Season): void => {
        setLoading(true)
        seasonsApi.put(season._id, season)
            .then(data => {
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const createFixture = (fixture: App.Fixture): void => {
        setLoading(true)
        fixturesApi.post(fixture)
            .then(data => {
                var updatedList = fixtureList.concat(data);
                setFixtureList(updatedList);
                setIsFixtureUpdated(true)
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const updateFixture = (fixture: App.Fixture): void => {
        setLoading(true)
        fixturesApi.put(fixture._id, fixture)
            .then(data => {
                getSeasonById(seasonId)
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    React.useEffect(() => {
        getSeasonById(seasonId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    React.useEffect(() => {
        if (isTeamUpdated) {
            setSeason({ ...season, teamList: teamList })
            setIsTeamUpdated(false)
        }
        if (isFixtureUpdated) {
            setSeason({ ...season, fixtureList: fixtureList })
            setIsFixtureUpdated(false)
        }
        if (isPlayerUpdated) {
            setSeason({ ...season, playerList: playerList })
            setIsPlayerUpdated(false)
        }
        if (isAccoladeUpdated) {
            setSeason({ ...season, accoladeList: accoladeList })
            setIsAccoladeUpdated(false)
        }
        setIsSeasonUpdated(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTeamUpdated, isFixtureUpdated, isPlayerUpdated, isAccoladeUpdated]);

    React.useEffect(() => {
        if (isSeasonUpdated) {
            updateSeason(season)
        }
        setIsSeasonUpdated(false)
    }, [isSeasonUpdated]);

    const addTeam = (team: App.Team): void => {
        var updatedList = teamList.concat(team);
        setTeamList(updatedList);
        setIsTeamUpdated(true)
    }

    const removeTeam = (id): void => {
        var updatedList = teamList.filter(team =>
            team._id !== id
        );
        setTeamList(updatedList)
        setIsTeamUpdated(true)
    }

    const deleteAccolade = (id): void => {
        var updatedList = accoladeList.filter(accolade =>
            accolade._id !== id
        );
        setAccoladeList(updatedList)
        setIsAccoladeUpdated(true)
    }

    const addPlayer = (player: App.Player): void => {
        var updatedList = playerList.concat(player)
        setPlayerList(updatedList)
        setIsPlayerUpdated(true)
    }

    const removePlayer = (id): void => {
        var updatedList = playerList.filter(player =>
            player._id !== id
        );
        setPlayerList(updatedList)
        setIsPlayerUpdated(true)
    }

    const removeFixture = (id): void => {
        var updatedList = fixtureList.filter(team =>
            team._id !== id
        );
        setFixtureList(updatedList);
        setIsFixtureUpdated(true)
    }

    const updateAccoladeList = (accolade: App.Accolade): void => {

        const updatedAccoladeList = season.accoladeList.map(obj => {
            if (obj._id === accolade._id) {
                return accolade;
            } else {
                return obj
            }
        })

        setAccoladeList(updatedAccoladeList);
        setIsAccoladeUpdated(true)
    }

    const addNewAccolade = (accolade: App.Accolade) => {
        season.accoladeList.push(accolade)
        setAccoladeList(season.accoladeList);
        setIsAccoladeUpdated(true)

    }

    const updateAccolade = (accolade: App.Accolade) => {
    }

    const sortFixtures = (season: App.Season) => {
        let now = moment()
        let pastFixtureList: App.Fixture[] = []
        let futureFixtureList: App.Fixture[] = []

        season.fixtureList.forEach(fixture => {
            if (moment(fixture.kickoffDateTime).isBefore(now)) {
                pastFixtureList.push(fixture)
            } else if (moment(fixture.kickoffDateTime).isAfter(now)) {
                futureFixtureList.push(fixture)
            }
        });

        pastFixtureList.sort((a, b) => {
            return (a.kickoffDateTime > b.kickoffDateTime ? -1 : 1)
        })
        futureFixtureList.sort((a, b) => {
            return (a.kickoffDateTime > b.kickoffDateTime ? -1 : 1)
        })

        setPastFixtureList(pastFixtureList)
        setFutureFixtureList(futureFixtureList)
    }

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

    const handleAddFixtureDialogOpen = () => {
        setIsAddFixtureDialogOpen(true)
    };

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

    const handleAddAccoladeDialogOpen = () => {
        setIsAddAccoladeDialogOpen(true)
    };

    const handleAddAccoladeDialogClose = () => {
        setIsAddAccoladeDialogOpen(false)
        setAccolade({
            _id: "",
            name: "",
            imageUrl: "",
            player: {
                _id: "",
                firstName: "",
                surname: "",
                imageUrl: "",
                isActive: true
            },
            isActive: true
        })
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <>
            <SeasonHeader season={season} />
            <div className="content">
                <div style={{ display: accoladeList.length ? 'block' : 'none' }}>
                    <h2>Accolades</h2>
                    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                        {accoladeList.map(accolade => {
                            return (
                                <div className="accolade-card-div" key={accolade._id}>
                                    <AccoladeCard
                                        accolade={accolade}
                                        auth={props.auth}
                                        deleteAccolade={deleteAccolade}
                                        updateAccoladeList={updateAccoladeList}
                                        playerList={season.playerList}
                                    />
                                </div>
                            )
                        })}
                    </Box>
                    {isAuthenticated() &&
                        <Button onClick={handleAddAccoladeDialogOpen} color="primary">
                            Add
                    </Button>
                    }
                    <br />
                </div>
                <div style={{ display: isAuthenticated() && !accoladeList.length ? 'block' : 'none' }}>
                    <h2>Accolades</h2>
                    {isAuthenticated() &&
                        <Button onClick={handleAddAccoladeDialogOpen} color="primary">
                            Add
                    </Button>
                    }
                    <br />
                </div>
                <div style={{ display: futureFixtureList.length ? 'block' : 'none' }}>
                    <h2>Fixtures</h2>
                    {futureFixtureList.map(fixture => {
                        return (
                            <div className="fixture-card-div" key={fixture._id}>
                                <FixtureCard fixture={fixture} />
                                {isAuthenticated() &&
                                    <div className="admin-buttons">
                                        <Button variant="text" onClick={() => handleEditFixtureDialogOpen(fixture)}>
                                            <EditIcon />
                                        </Button>
                                        <Button variant="text" onClick={() => removeFixture(fixture._id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                }

                            </div>
                        )
                    })}
                    <br />
                </div>

                <h2>Results</h2>
                {pastFixtureList.map(fixture => {
                    return (
                        <div className="fixture-card-div" key={fixture._id}>
                            <FixtureCard
                                fixture={fixture}
                            />
                            {isAuthenticated() &&
                                <div className="admin-buttons">
                                    <Button variant="text" onClick={() => handleEditFixtureDialogOpen(fixture)}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="text" onClick={() => removeFixture(fixture._id)}>
                                        <DeleteIcon />
                                    </Button>
                                </div>
                            }
                        </div>
                    )
                })}
                {isAuthenticated() &&
                    <Button onClick={handleAddFixtureDialogOpen} color="primary">
                        Add
                    </Button>
                }
                <br />

                <h2>Player Stats</h2>
                <PlayerSeasonStatsTable
                    seasonId={seasonId}
                />

                {isAuthenticated() &&
                    <>
                        <h3>Teams</h3>
                        <TeamUnorderedList
                            teamList={season.teamList}
                            removeTeam={removeTeam}
                            addTeam={addTeam}
                        />
                        <h3>Players</h3>
                        <PlayerUnorderedList
                            playerList={season.playerList}
                            removePlayer={removePlayer}
                            addPlayer={addPlayer}
                        />
                    </>
                }

            </div>

            {/* Edit Fixture Dialog */}
            <ConfigureFixtureDialog
                isFixtureDialogOpen={isEditFixtureDialogOpen}
                handleClose={handleEditFixtureDialogClose}
                createFixture={createFixture}
                updateFixture={updateFixture}
                teamList={season.teamList}
                playerList={season.playerList}
                isCreateFixtureDialog={false}
                fixture={fixture}
            />

            {/* Create Fixture Dialog */}
            <ConfigureFixtureDialog
                isFixtureDialogOpen={isAddFixtureDialogOpen}
                handleClose={handleAddFixtureDialogClose}
                createFixture={createFixture}
                updateFixture={updateFixture}
                teamList={teamList}
                playerList={playerList}
                isCreateFixtureDialog={true}
                fixture={fixture}
            />
            {/* Add Accolade Dialog */}
            <ConfigureAccoladeDialog
                handleClose={handleAddAccoladeDialogClose}
                updateAccolade={updateAccolade}
                createAccolade={addNewAccolade}
                isDialogOpen={isAddAccoladeDialogOpen}
                accolade={accolade}
                isCreateAccoladeDialog={true}
                playerList={season.playerList}
            />
        </>
    )
}

export default Season