import React from "react"
import './season.scss'
import FixtureTable from '../fixture/FixtureTable'
import TeamUnorderedList from "../team/TeamUnorderedList"
import PlayerSeasonStatsTable from "../player/PlayerSeasonStatsTable"
import useFetch from "../../hooks/useFetch"
import PlayerUnorderedList from "../player/PlayerUnorderedList"

const Season = ({ match }) => {

    const seasonsApi = useFetch(
        "http://localhost:8080/seasons"
    );

    const fixturesApi = useFetch(
        "http://localhost:8080/fixtures"
    );

    const [seasonId] = React.useState<string>(
        match.params.id
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
        isActive: false
    });

    const [teamList, setTeamList] = React.useState<App.Team[]>([])
    const [isTeamUpdated, setIsTeamUpdated] = React.useState<boolean>(false)
    const [playerList, setPlayerList] = React.useState<App.Player[]>([])
    const [isPlayerUpdated, setIsPlayerUpdated] = React.useState<boolean>(false)
    const [fixtureList, setFixtureList] = React.useState<App.Fixture[]>([])
    const [isFixtureUpdated, setIsFixtureUpdated] = React.useState<boolean>(false)
    const [isSeasonUpdated, setIsSeasonUpdated] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    const getSeasonById = (seasonId: string): void => {
        setLoading(true)
        seasonsApi.get(seasonId)
            .then((data: App.Season) => {
                setSeason(data)
                setTeamList(data.teamList)
                setPlayerList(data.playerList)
                setFixtureList(data.fixtureList)
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
        setIsSeasonUpdated(true)
    }, [isTeamUpdated, isFixtureUpdated, isPlayerUpdated]);

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
        setTeamList(updatedList);
        setIsTeamUpdated(true)
    }

    const addPlayer = (player: App.Player): void => {
        var updatedList = playerList.concat(player);
        setPlayerList(updatedList);
        setIsPlayerUpdated(true)
    }

    const removePlayer = (id): void => {
        var updatedList = playerList.filter(player =>
            player._id !== id
        );
        setPlayerList(updatedList);
        setIsPlayerUpdated(true)
    }

    const removeFixture = (id): void => {

        var updatedList = fixtureList.filter(team =>
            team._id !== id
        );
        setFixtureList(updatedList);
        setIsFixtureUpdated(true)

    }

    if (loading) {
        return (
            <i>Loading season...</i>
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <>
            <h3>Season: {season.name}</h3>
            <h3>Location: {season.location}</h3>
            <h3>Start Date: {new Intl.DateTimeFormat('en-GB').format(new Date(season.startDate))}</h3>
            <h3>End Date: {new Intl.DateTimeFormat('en-GB').format(new Date(season.endDate))}</h3>
            <h3>Fixtures</h3>
            <FixtureTable
                fixtureList={fixtureList}
                teamList={season.teamList}
                playerList={season.playerList}
                deleteFixture={removeFixture}
                updateFixture={updateFixture}
                createFixture={createFixture}
            />
            <h3>Season Player Stats</h3>
            <PlayerSeasonStatsTable
                seasonId={seasonId}
            />
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
    )
}

export default Season