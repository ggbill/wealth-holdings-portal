import React from "react"
import './season.scss'
import moment from 'moment'
import Paper from '@material-ui/core/Paper';

interface InputProps {
    fixtureList: App.Fixture[]
}

const generateScoreCells = (fixture: App.Fixture) => {
    if (!fixture.oppositionOwnGoals) {
        fixture.oppositionOwnGoals = 0
    }

    let lightningScore = fixture.oppositionOwnGoals;

    if (fixture.players.length) {
        fixture.players.forEach(fixturePlayer => {
            lightningScore += fixturePlayer.goalCount
        });

        return (
            <>
                <td className="score-cell">{lightningScore}</td>
                <td className="score-cell">-</td>
                <td className="score-cell">{fixture.goalsAgainst}</td>
            </>
        )

    } else {
        return (
            <td className="kickoff-cell">{moment(fixture.kickoffDateTime).format("HH:mm D/MM/YYYY")}</td>
        )
    }
}

const generateScorerList = (fixture: App.Fixture) => {
    interface Scorer {
        player: any,
        goalCount: number
        // isMotm: boolean
    }

    let scorerList: Scorer[] = []
    let scorer: Scorer = {
        player: {},
        goalCount: 0,
        // isMotm: false
    }

    fixture.players.forEach(fixturePlayer => {
        if (fixturePlayer.goalCount > 0) {
            scorerList.push(
                {
                    player: fixturePlayer.player,
                    goalCount: fixturePlayer.goalCount,
                    // isMotm: fixturePlayer.isMotm
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
                    <tr className="scorer-row">
                        <td>{scorer.player.firstName.charAt(0)}. {scorer.player.surname}</td>
                        <td style={{ display: scorer.goalCount > 1 ? 'block' : 'none' }}> [{scorer.goalCount}]</td>
                        {/* <td className="motm-label" style={{ display: scorer.isMotm ? 'block' : 'none' }}> [motm]</td> */}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const generateMotm = (fixture: App.Fixture) => {
    let motm = ""

    if (fixture.players.length) {
        fixture.players.forEach(fixturePlayer => {
            if (fixturePlayer.goalCount > 0) {
                if (fixturePlayer.isMotm) {
                    motm = `MoTM: ${fixturePlayer.player.firstName.charAt(0)}. ${fixturePlayer.player.surname}`
                }
            }
        })
    } 
    return motm
}



const SeasonResultsSummaryTable = (props: InputProps) => {

    return (
        <Paper className="season-results-summary-table">
            <table >
                <tbody>
                    {props.fixtureList.map((fixture: App.Fixture) => (
                        <tr className="fixture-row" key={fixture._id}>
                            <td className="team-cell">
                                <span className="team-name">Lenton Lightning FC</span>
                                <div className="scorers">
                                    {generateScorerList(fixture)}
                                </div>
                                <div className="motm">
                                    <table>
                                        <tbody>
                                            <tr className="motm-row">
                                                <td>{generateMotm(fixture)}</td>
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>

                            </td>
                            {generateScoreCells(fixture)}
                            <td className="team-cell opposition">
                                <span className="team-name">{fixture.opposition.name}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Paper>
    )

}

export default SeasonResultsSummaryTable