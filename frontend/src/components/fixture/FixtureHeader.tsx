import React from "react"
import './fixture.scss'
import moment from 'moment'

interface InputProps {
    fixture: App.Fixture
}

const FixtureHeader = (props: InputProps) => {

    const getLightningGoals = (): number => {
        if (!props.fixture.oppositionOwnGoals) {
            props.fixture.oppositionOwnGoals = 0
        }

        let lightningScore = props.fixture.oppositionOwnGoals

        if (props.fixture.players.length) {
            props.fixture.players.forEach(fixturePlayer => {
                lightningScore += fixturePlayer.goalCount
            })
        }

        return lightningScore
    }

    const generateScores = () => {
        if (props.fixture.result) {
            return (
                <div className="score-kickoff-wrapper">
                    <div className="score-wrapper desktop-view">
                        <span className={"score"}>{getLightningGoals()}</span>
                        <span className="score">-</span>
                        <span className="score">{props.fixture.goalsAgainst}</span>
                    </div>

                    <div className="kickoff-wrapper">
                        <span className="kickoff">{moment(props.fixture.kickoffDateTime).format("HH:mm D/MM/YYYY")}</span>
                        <span className="fixture-type">{props.fixture.fixtureType}</span>
                    </div>
                </div>
            )

        } else {
            return (
                <div className="kickoff-wrapper">
                    <span className="kickoff">{moment(props.fixture.kickoffDateTime).format("HH:mm D/MM/YYYY")}</span>
                    <span className="fixture-type">{props.fixture.fixtureType}</span>
                </div>
            )
        }
    }

    const generateScorerList = () => {
        interface Scorer {
            player: any,
            goalCount: number
        }

        let scorerList: Scorer[] = []

        props.fixture.players.forEach(fixturePlayer => {
            if (fixturePlayer.goalCount > 0) {
                scorerList.push(
                    {
                        player: fixturePlayer.player,
                        goalCount: fixturePlayer.goalCount,
                    }
                )
            }
        })

        scorerList.sort((a, b) => {
            return a.player.surname.localeCompare(b.player.surname)
        })

        return (
            <table>
                <tbody>
                    {scorerList.map(scorer => (
                        <tr key={scorer.player._id} className="scorer-row">
                            <td>{scorer.player.firstName.charAt(0)}. {scorer.player.surname}</td>
                            <td style={{ display: scorer.goalCount > 1 ? 'block' : 'none' }}> [{scorer.goalCount}]</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    const generateMotm = () => {
        let motm: any = []

        if (props.fixture.players.length) {
            props.fixture.players.forEach(fixturePlayer => {
                if (fixturePlayer.isMotm) {
                    motm = <span>MotM: {fixturePlayer.player.firstName.charAt(0)}. {fixturePlayer.player.surname}</span>
                }
            })
        }
        return motm
    }

    return (
        <div className="header-section">
            <div className="fixture-header">
                <div className="desktop-view">
                    <div className="left-content">
                        <span className="team-name title">Lenton Lightning FC</span>
                        <div className="scorers">
                            {generateScorerList()}
                        </div>
                        <div className="motm">
                            {generateMotm()}
                        </div>
                    </div>
                    <div className="centre-content">
                        {generateScores()}
                    </div>
                    <div className="right-content">
                        <span className="team-name">{props.fixture.opposition.name}</span>
                    </div>
                </div>

                <div className="mobile-view">
                        {props.fixture.result ?
                            <span className="team-name">{props.fixture.opposition.name}: {props.fixture.goalsAgainst}</span> :
                            <span className="team-name">{props.fixture.opposition.name}</span>
                        }
                    <div className="kickoff-wrapper">
                        <span className="kickoff">{moment(props.fixture.kickoffDateTime).format("HH:mm DD/MM/YYYY")}</span>
                        <span className="fixture-type">{props.fixture.fixtureType}</span>
                    </div>
                    <div className="lightning-wrapper">
                        {props.fixture.result ?
                            <span className="team-name">Lenton Lightning FC: <span>{getLightningGoals()}</span></span> :
                            <span className="team-name">Lenton Lightning FC</span>
                        }
                        <div className="scorers">
                            {generateScorerList()}
                        </div>
                        <div className="motm">
                            {generateMotm()}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FixtureHeader