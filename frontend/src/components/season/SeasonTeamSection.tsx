import React, { useState } from "react"
import TeamUnorderedList from "../team/TeamUnorderedList"

interface InputProps {
    season: App.Season
    setSeason: (season: App.Season) => void
    setIsSeasonUpdated: (isTrue: boolean) => void
}

const SeasonTeamSection = (props: InputProps) => {
    const [teamList, setTeamList] = useState<App.Team[]>(props.season.teamList)
    const [isTeamUpdated, setIsTeamUpdated] = useState<boolean>(false)

    React.useEffect(() => {
        if (isTeamUpdated) {
            props.setSeason({ ...props.season, teamList: teamList })
            setIsTeamUpdated(false)
            props.setIsSeasonUpdated(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTeamUpdated]);

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

    return (
        <>
            <h3>Teams</h3>
            <TeamUnorderedList
                teamList={props.season.teamList}
                removeTeam={removeTeam}
                addTeam={addTeam}
            />
        </>
    )
}

export default SeasonTeamSection