import React from "react"
import './player.scss';

interface InputProps {
    playerList: App.FixturePlayer[];
}

const FixturePlayerUnorderedList = (props: InputProps) => {
    return (
        <>
            <ul>
                {props.playerList.map((fixturePlayer: App.FixturePlayer) => (
                    <li key={fixturePlayer._id}>
                        <span><strong>{fixturePlayer.isMotm ? `[MotM] `: ''}</strong></span>
                        <span>{fixturePlayer.player.firstName} {fixturePlayer.player.surname}</span>
                        <span>{fixturePlayer.goalCount ? ` (${fixturePlayer.goalCount})`: ''}</span>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default FixturePlayerUnorderedList