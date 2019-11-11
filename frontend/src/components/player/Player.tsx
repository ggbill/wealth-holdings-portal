import React from "react"
import './player.scss'
import useFetch from "../../hooks/useFetch"
import PlayerCareerStatsTable from "./PlayerCareerStatsTable";
import PlayerHeader from "./PlayerHeader";

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

    React.useEffect(() => {
        getPlayerById(playerId);
    }, []);

    if (loading) {
        return (
            <i>Loading player...</i>
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
                <PlayerCareerStatsTable playerId={player._id} />
            </div>
        </>
    )
}

export default Player