import React, { useState } from "react"
import SeasonTable from "./SeasonTable"
import './season.scss'
import useFetch from "../../hooks/useFetch"
import moment from 'moment'
import SeasonCard from "./SeasonCard"
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Button } from "@material-ui/core"
import ConfigureSeasonDialog from "./ConfigureSeasonDialog"

interface InputProps {
    auth: any
}

const SeasonAdmin = (props: InputProps) => {

    const { isAuthenticated } = props.auth;

    const seasonsApi = useFetch("seasons");

    const [season, setSeason] = useState<App.Season>({
        _id: "",
        name: "",
        location: "",
        startDate: new Date(),
        endDate: new Date(),
        teamList: [],
        playerList: [],
        fixtureList: [],
        isActive: false
    });
    const [previousSeasonList, setPreviousSeasonList] = useState<App.Season[]>([]);
    const [seasonList, setSeasonList] = useState<App.Season[]>([]);
    const [currentSeason, setCurrentSeason] = useState<App.Season>({
        _id: "",
        name: "",
        location: "",
        startDate: new Date(),
        endDate: new Date(),
        teamList: [],
        playerList: [],
        fixtureList: [],
        isActive: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isEditSeasonDialogOpen, setIsEditSeasonDialogOpen] = useState<boolean>(false);
    const [isAddSeasonDialogOpen, setIsAddSeasonDialogOpen] = useState<boolean>(false);

    const getSeasonList = (): void => {
        setLoading(true)
        seasonsApi.get(null)
            .then(data => {
                determineSeasons(data)
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

    const determineSeasons = (seasonList: App.Season[]) => {
        let today = moment()
        let i = seasonList.length

        while (i--) {
            if (moment(seasonList[i].startDate).isBefore(today) && moment(seasonList[i].endDate).isAfter(today)) {
                setCurrentSeason(seasonList[i]);
                seasonList.splice(i, 1);
            }
        }

        seasonList.sort((a, b) => {
            return (a.startDate > b.startDate ? -1 : 1)
        })

        setPreviousSeasonList(seasonList)

    }

    const clearSeasonObject = () => {
        setSeason({
            _id: "",
            name: "",
            location: "",
            startDate: new Date(),
            endDate: new Date(),
            teamList: [],
            playerList: [],
            fixtureList: [],
            isActive: false
        })
    }

    const handleEditSeasonDialogOpen = (season: App.Season) => {
        setSeason(season)
        setIsEditSeasonDialogOpen(true)
    };

    const handleEditSeasonDialogClose = () => {
        setIsEditSeasonDialogOpen(false)
        clearSeasonObject()
    };

    const handleAddSeasonDialogOpen = () => {
        setIsAddSeasonDialogOpen(true)
    };

    const handleAddSeasonDialogClose = () => {
        setIsAddSeasonDialogOpen(false)
        clearSeasonObject()
    };

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
        <div className="content season">
            <div className="current-season-wrapper">
                <h2>Current Season</h2>
                <div className="season-card-div" key={currentSeason._id}>
                    <SeasonCard season={currentSeason} />
                    {isAuthenticated() &&
                        <div className="admin-buttons">
                            <Button variant="text" onClick={() => handleEditSeasonDialogOpen(currentSeason)}>
                                <EditIcon />
                            </Button>
                            <Button variant="text" onClick={() => deleteSeason(currentSeason._id)}>
                                <DeleteIcon />
                            </Button>
                        </div>
                    }
                </div>
            </div>
            <div className="previous-seasons-wrapper">
                <h2>Previous Seasons</h2>
                {previousSeasonList.map((previousSeason: App.Season) => (
                    <div className="season-card-div" key={previousSeason._id}>
                        <SeasonCard season={previousSeason} />
                        {isAuthenticated() &&
                            <div className="admin-buttons">
                                <Button variant="text" onClick={() => handleEditSeasonDialogOpen(previousSeason)}>
                                    <EditIcon />
                                </Button>
                                <Button variant="text" onClick={() => deleteSeason(currentSeason._id)}>
                                    <DeleteIcon />
                                </Button>
                            </div>
                        }
                    </div>
                ))}
            </div>

            {isAuthenticated() &&
                <Button onClick={handleAddSeasonDialogOpen} color="primary">
                    Add Season
                </Button>
            }

            {/* Edit Season Dialog */}
            <ConfigureSeasonDialog
                handleClose={handleEditSeasonDialogClose}
                updateSeason={updateSeason}
                isDialogOpen={isEditSeasonDialogOpen}
                season={season}
                createSeason={createSeason}
                isCreateSeasonDialog={false}
            />

            {/* Add Season Dialog */}
            <ConfigureSeasonDialog
                handleClose={handleAddSeasonDialogClose}
                updateSeason={updateSeason}
                isDialogOpen={isAddSeasonDialogOpen}
                season={season}
                createSeason={createSeason}
                isCreateSeasonDialog={true}
            />

        </div>
    )
}

export default SeasonAdmin