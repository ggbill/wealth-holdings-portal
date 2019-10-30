import React from "react"
import './fixture.scss'
import FixturePlayerUnorderedList from "../player/FixturePlayerUnorderedList";
import useFetch from "../../hooks/useFetch"

const Fixture = ({ match }) => {

    const [fixtureId] = React.useState<string>(
        match.params.id
    );

    const fixturesApi = useFetch(
        "http://localhost:8080/fixtures/"
    );

    const [fixture, setFixture] = React.useState<App.Fixture>({
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

    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    const getFixtureById = (fixtureId: string): void => {
        setLoading(true)
        fixturesApi.get(fixtureId)
            .then((data: App.Fixture) => {
                setFixture(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const generateScore = (): string => {

        if (fixture.players.length < 1){
            return ''
        }else{
            var goalsFor: number = 0

            fixture.players.forEach(fixturePlayer => {
                goalsFor += fixturePlayer.goalCount;
            });
    
            return `${goalsFor} - ${fixture.goalsAgainst}`;
        }
    }

    React.useEffect(() => {
        getFixtureById(fixtureId);
    }, []);

    if (loading) {
        return (
            <i>Loading fixture...</i>
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <>
            <h3>Kickoff: {new Intl.DateTimeFormat('en-GB').format(new Date(fixture.kickoffDateTime))}</h3>
            <h3>Opposition: {fixture.opposition.name}</h3>
            <h3>Fixture Type: {fixture.fixtureType}</h3>
            <h3>Result: {fixture.result}</h3>
            <h3>Score: {generateScore()}</h3>
            <h3>Players:</h3>
            <FixturePlayerUnorderedList
                playerList={fixture.players}
            />
        </>
    )
}

export default Fixture