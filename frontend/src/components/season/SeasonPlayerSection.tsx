import React, { useState } from "react"
import PlayerUnorderedList from "../player/PlayerUnorderedList"

interface InputProps {
    season: App.Season
    setSeason: (season: App.Season) => void
    setIsSeasonUpdated: (isTrue: boolean) => void
}

const SeasonPlayerSection = (props: InputProps) => {
    const [playerList, setPlayerList] = useState<App.Player[]>(props.season.playerList)
    const [isPlayerUpdated, setIsPlayerUpdated] = useState<boolean>(false)

    React.useEffect(() => {
        if (isPlayerUpdated) {
            props.setSeason({ ...props.season, playerList: playerList })
            setIsPlayerUpdated(false)
            props.setIsSeasonUpdated(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlayerUpdated]);

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

    return (
        <>
            <h3>Players</h3>
            <PlayerUnorderedList
                playerList={props.season.playerList}
                removePlayer={removePlayer}
                addPlayer={addPlayer}
            />
        </>
    )
}

export default SeasonPlayerSection