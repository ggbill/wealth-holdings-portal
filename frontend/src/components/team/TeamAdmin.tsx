import React from "react"
import CreateTeamTable from "./CreateTeamTable"
import './team.scss'
import useFetch from "../../hooks/useFetch"

const TeamAdmin = () => {

    const teamsApi = useFetch("teams");

    const [teamList, setTeamList] = React.useState<App.Team[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    const getTeamList = (): void => {
        setLoading(true)
        teamsApi.get(null)
            .then(data => {
                setTeamList(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const createTeam = (team: App.Team): void => {
        setLoading(true)
        teamsApi.post(team)
            .then(data => {
                getTeamList();
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const updateTeam = (team: App.Team): void => {
        setLoading(true)
        teamsApi.put(team._id, team)
            .then(data => {
                getTeamList();
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const deleteTeam = (id): void => {
        let teamToDelete;
        teamList.forEach(team => {
            if (team._id === id) {
                teamToDelete = team;
                teamToDelete.isActive = false;
            }
        });
        updateTeam(teamToDelete);
    }

    React.useEffect(() => {
        getTeamList();
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    if (loading) {
        return (
            <i>Loading teams...</i>
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <div className="content team menu-bar-margin">
            <h2>Team List</h2>
            <CreateTeamTable
                teams={teamList}
                deleteTeam={deleteTeam}
                updateTeam={updateTeam}
                createTeam={createTeam}
            />
        </div>
    )


}

export default TeamAdmin