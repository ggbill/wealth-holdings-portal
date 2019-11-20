import React, { useState, useEffect, useRef } from "react"
import './player.scss';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom'
import useFetch from "../../hooks/useFetch"
import _ from "lodash"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Loading from "../shared/Loading";

const seasonsApi = useFetch("seasons");

interface SeasonStat {
    season: {},
    capCount: number,
    goalCount: number,
    motmCount: number,
    winCount: number,
    lossCount: number
}

interface PlayerSeasonStat {
    player: any,
    seasonStat: SeasonStat
}

interface InputProps {
    seasonId: string;
}

const PlayerSeasonStatsTable = (props: InputProps) => {
    const [playerSeasonStatList, setSeasonPlayerStatList] = useState<PlayerSeasonStat[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const [columnToSort, setColumnToSort] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    const isComponentMounted = useRef(true);

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    useEffect(() => {
        getSeasonPlayerStats()

        return () => {
            isComponentMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [props.seasonId])

    const getSeasonPlayerStats = () => {

        setLoading(true)
        seasonsApi.get(`${props.seasonId}/playerSeasonStats`)
            .then((data: PlayerSeasonStat[]) => {
                if (isComponentMounted.current) {
                    setSeasonPlayerStatList(_.orderBy(data, `player.surname`, "asc"))
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                setError(err.message)
            })
    }

    const handleSort = (columnName) => {
        setColumnToSort(columnName)
        let sortDirect: any = columnToSort === columnName ? invertDirection(sortDirection) : 'desc'
        setSortDirection(sortDirect)
    }

    useEffect(() => {
        if (columnToSort === "seasonStat.strikeRate") {
            setSeasonPlayerStatList(_.orderBy(playerSeasonStatList,
                function (item: PlayerSeasonStat) {
                    return (item.seasonStat.goalCount / item.seasonStat.capCount);
                },
                sortDirection))
        } else if (columnToSort === "seasonStat.winPercentage") {
            setSeasonPlayerStatList(_.orderBy(playerSeasonStatList,
                function (item: PlayerSeasonStat) {
                    return (item.seasonStat.winCount / item.seasonStat.capCount);
                },
                sortDirection))
        } else {
            setSeasonPlayerStatList(_.orderBy(playerSeasonStatList, columnToSort, sortDirection))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [columnToSort, sortDirection])


    if (loading) {
        return (
            <Loading />
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <>
            <Paper className="stats-table-wrapper">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div onClick={() => handleSort("player.surname")} className="firstTableHeaderCell">
                                    <span>Player</span>
                                    {
                                        columnToSort === "player.surname" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("seasonStat.capCount")} className="tableHeaderCell">
                                    {
                                        columnToSort === "seasonStat.capCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Caps</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("seasonStat.goalCount")} className="tableHeaderCell">
                                    {
                                        columnToSort === "seasonStat.goalCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Goals</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("seasonStat.motmCount")} className="tableHeaderCell">
                                    {
                                        columnToSort === "seasonStat.motmCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>MotMs</span>
                                </div>
                            </TableCell>
                            <TableCell className="hide-on-mobile">
                                <div onClick={() => handleSort("seasonStat.strikeRate")} className="tableHeaderCell">
                                    {
                                        columnToSort === "seasonStat.strikeRate" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Strike Rate</span>
                                </div>
                            </TableCell>
                            <TableCell className="hide-on-mobile">
                                <div onClick={() => handleSort("seasonStat.winPercentage")} className="tableHeaderCell">
                                    {
                                        columnToSort === "seasonStat.winPercentage" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Win %</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerSeasonStatList.map((item: PlayerSeasonStat) => (
                            <TableRow key={item.player._id}>
                                <TableCell className="align-left">
                                    <Link to={'/player/' + item.player._id}>{item.player.firstName} {item.player.surname}</Link>
                                </TableCell>
                                <TableCell>{item.seasonStat.capCount}</TableCell>
                                <TableCell>{item.seasonStat.goalCount}</TableCell>
                                <TableCell>{item.seasonStat.motmCount}</TableCell>
                                <TableCell className="hide-on-mobile">{Math.round((item.seasonStat.goalCount / item.seasonStat.capCount) * 100) / 100}</TableCell>
                                <TableCell className="hide-on-mobile">{Math.round((item.seasonStat.winCount / item.seasonStat.capCount) * 100) / 100}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <p className="hide-on-desktop">
                <i>* Columns hidden for small screen size. Please hold your phone in landscape mode, or view on a larger screen to see full detail.</i>
            </p>
        </>
    )
}

export default PlayerSeasonStatsTable