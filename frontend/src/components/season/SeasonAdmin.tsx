import React from "react"
import SeasonTable from "./SeasonTable"
import './season.scss'
import useFetch from "../../hooks/useFetch"

const SeasonAdmin = () => {

    const seasonsApi = useFetch(
        "http://localhost:8080/seasons/"
    );

    const [seasonList, setSeasonList] = React.useState<App.Season[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    const getSeasonList = (): void => {
        setLoading(true)
        seasonsApi.get(null)
            .then(data => {
                setSeasonList(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const createSeason = (season: App.Season): void => {
        setLoading(true)
        seasonsApi.post(season)
            .then(data => {
                getSeasonList();
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const updateSeason = (season: App.Season): void => {
        setLoading(true)
        seasonsApi.put(season._id, season)
            .then(data => {
                getSeasonList();
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const deleteSeason = (id): void => {
        let seasonToDelete;
        seasonList.forEach(season => {
            if (season._id === id) {
                seasonToDelete = season;
                seasonToDelete.isActive = false;
            }
        });
        updateSeason(seasonToDelete);
    }

    React.useEffect(() => {
        getSeasonList();
    }, []);

    if (loading) {
        return (
            <i>Loading seasons...</i>
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <div className="season">
            <h2>Season List</h2>
            <SeasonTable
                seasons={seasonList}
                deleteSeason={deleteSeason}
                updateSeason={updateSeason}
                createSeason={createSeason}
            />
        </div>
    )
}

export default SeasonAdmin