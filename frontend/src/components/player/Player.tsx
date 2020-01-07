import React from "react"
import './player.scss'
import useFetch from "../../hooks/useFetch"
import PlayerCareerStatsTable from "./PlayerCareerStatsTable"
import PlayerHeader from "./PlayerHeader"
import Loading from "../shared/Loading"
import { Box } from "@material-ui/core"
import AccoladeSticker from "../accolade/AccoladeSticker"

const Player = ({ match }) => {

    const [playerId] = React.useState<string>(
        match.params.id
    );

    const playersApi = useFetch("players");

    const [player, setPlayer] = React.useState<App.Player>({
        _id: "",
        firstName: "",
        surname: "",
        imageUrl: "",
        isActive: true
    });
    const [playerCareerAccoladeList, setPlayerCareerAccoladeList] = React.useState<App.PlayerAccolade[]>([]);

    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    const getPlayerById = (playerId: string): void => {
        setLoading(true)
        playersApi.get(playerId)
            .then((data: App.Player) => {
                setPlayer(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const getPlayerCareerAccoladeList = (playerId: string): void => {
        setLoading(true)
        playersApi.get(`${playerId}/careerAccoladeList`)
            .then((data: App.PlayerAccolade[]) => {
                data.sort((a, b) => {
                    return (a.seasonStartDate > b.seasonStartDate ? -1 : 1)
                })
                setPlayerCareerAccoladeList(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    React.useEffect(() => {
        getPlayerById(playerId);
        getPlayerCareerAccoladeList(playerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

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
            <PlayerHeader player={player} />
            <div className="content">
                <div style={{ display: playerCareerAccoladeList.length ? 'block' : 'none' }}>
                    <h2>Career Accolades</h2>
                        <Box display="flex" flexDirection="row" flexWrap="wrap">
                            {playerCareerAccoladeList.map(playerAccolade => {
                                return (
                                    <div className="accolade-card-div" key={playerAccolade.accolade._id}>
                                        <AccoladeSticker
                                            playerAccolade={playerAccolade}
                                        />
                                    </div>
                                )
                            })}
                        </Box>
                    <br />
                </div>

                <h2>Career Stats</h2>
                <PlayerCareerStatsTable playerId={player._id} />
                <br />
            </div>
        </>
    )
}

export default Player