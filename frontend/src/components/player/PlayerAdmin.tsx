import React from "react"
import PlayerTable from "./PlayerTable"
import './player.scss'
import useFetch from "../../hooks/useFetch"
import PlayerCard from "./PlayerCard"
import { Box, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

interface SeasonStat {
    seasonName: string,
    seasonId: string,
    capCount: number,
    goalCount: number,
    motmCount: number,
    winCount: number,
    lossCount: number
}

interface PlayerCareerStat {
    player: any,
    seasonStatList: SeasonStat[],
    capTotal: number,
    goalTotal: number,
    motmTotal: number,
    winTotal: number,
    lossTotal: number
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

const PlayerAdmin = () => {

    const classes = useStyles();

    const playersApi = useFetch(
        "http://localhost:8080/players"
    );

    const seasonsApi = useFetch(
        "http://localhost:8080/seasons"
    );

    const [playerList, setPlayerList] = React.useState<App.Player[]>([]);
    const [playerCareerStatList, setPlayerCareerStatList] = React.useState<PlayerCareerStat[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const [orderBy, setOrderBy] = React.useState<string>("CAPS");


    const getPlayerList = (): void => {
        setLoading(true)
        playersApi.get(null)
            .then(data => {
                setPlayerList(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const GetAllPlayerCareerStats = (): void => {
        setLoading(true)
        seasonsApi.get('allPlayersCareerStats')
            .then(data => {
                setPlayerOrder("CAPS", data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const createPlayer = (player: App.Player): void => {
        setLoading(true)
        playersApi.post(player)
            .then(data => {
                getPlayerList();
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const updatePlayer = (player: App.Player): void => {
        setLoading(true)
        playersApi.put(player._id, player)
            .then(data => {
                getPlayerList();
                setLoading(false)
            })
            .catch((err: Error) => {
                setLoading(false)
                setError(err.message)
            })
    }

    const deletePlayer = (id): void => {
        let playerToDelete;
        playerList.forEach(player => {
            if (player._id === id) {
                playerToDelete = player;
                playerToDelete.isActive = false;
            }
        });
        updatePlayer(playerToDelete);
    }

    const setPlayerOrder = (orderBy: string, playerCareerStatList: PlayerCareerStat[]) => {
        if (orderBy === "CAPS") {
            let orderedList = playerCareerStatList.sort((a, b) => {
                return (a.capTotal > b.capTotal ? -1 : 1)
            })
            setPlayerCareerStatList(orderedList);
        } else if (orderBy === "NAME") {
            let orderedList = playerCareerStatList.sort((a, b) => {
                return (`${a.player.firstName} ${a.player.surname}` < `${b.player.firstName} ${b.player.surname}` ? -1 : 1)
            })
            setPlayerCareerStatList(orderedList);
        } else if (orderBy === "GOALS") {
            let orderedList = playerCareerStatList.sort((a, b) => {
                return (a.goalTotal > b.goalTotal ? -1 : 1)
            })
            setPlayerCareerStatList(orderedList);
        } else if (orderBy === "WIN") {
            let orderedList = playerCareerStatList.sort((a, b) => {
                return ((a.winTotal / a.capTotal) > (b.winTotal / b.capTotal) ? -1 : 1)
            })
            setPlayerCareerStatList(orderedList);
        }
    }

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setOrderBy(event.target.value as string);
        setPlayerOrder(event.target.value as string, playerCareerStatList)
    };

    React.useEffect(() => {
        getPlayerList();
        GetAllPlayerCareerStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps       
    }, []);

    if (loading) {
        return (
            <i>Loading players...</i>
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <div className="content">
            <h2>Player List</h2>
            <FormControl className={classes.formControl}>
                <InputLabel id="order-by-select">Sort</InputLabel>
                <Select
                    id="order-by-select"
                    value={orderBy}
                    onChange={handleChange}
                >
                    <MenuItem value={"NAME"}>By Name</MenuItem>
                    <MenuItem value={"CAPS"}>Most Caps</MenuItem>
                    <MenuItem value={"GOALS"}>Most Goals</MenuItem>
                    <MenuItem value={"WIN"}>Win Percentage</MenuItem>
                </Select>
            </FormControl>
            <div className={classes.root} >
                <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                    {playerCareerStatList.map((item: PlayerCareerStat) => (
                        <div key={item.player._id}>
                            <PlayerCard
                                player={item.player}
                                caps={item.capTotal}
                                goals={item.goalTotal}
                                winPercentage={(item.winTotal / item.capTotal * 100)}
                            />
                        </div>
                    ))}
                </Box>
            </div>
            <PlayerTable
                players={playerList}
                deletePlayer={deletePlayer}
                updatePlayer={updatePlayer}
                createPlayer={createPlayer}
            />
        </div>
    )
}

export default PlayerAdmin