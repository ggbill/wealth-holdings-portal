import React from "react"
import './fixture.scss'
import { Box } from "@material-ui/core"
import useFetch from "../../hooks/useFetch"
import Loading from "../shared/Loading";
import FixtureHeader from "./FixtureHeader";
import PlayerSticker from "../player/PlayerSticker";

const Fixture = ({ match }) => {

    const [fixtureId] = React.useState<string>(
        match.params.id
    );

    const fixturesApi = useFetch("fixtures");

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

    React.useEffect(() => {
        getFixtureById(fixtureId);
    }, []);

    // let widget = window.cloudinary.createUploadWidget({
    //     cloudName: "demo",
    //     uploadPreset: "blog_upload"
    // },
    //     (error, result) => { })

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
            <FixtureHeader fixture={fixture} />
            <div className="content">
                <div style={{ display: fixture.players.length ? 'block' : 'none' }}>
                    <h2>Players</h2>
                    <Box display="flex" flexDirection="row" flexWrap="wrap">
                        {fixture.players.map((fixturePlayer: App.FixturePlayer) => (
                            <PlayerSticker player={fixturePlayer.player} />
                        ))}
                    </Box>
                    < br />
                </div>

            </div>


        </>
    )
}

export default Fixture