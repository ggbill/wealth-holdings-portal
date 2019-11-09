import React, { useState, useEffect } from "react"
import './player.scss';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom'
import useFetch from "../../hooks/useFetch"
import _ from "lodash"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const seasonsApi = useFetch(
    "http://localhost:8080/seasons"
);

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

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    useEffect(() => {
        getSeasonPlayerStats()
    }, [props.seasonId])

    const getSeasonPlayerStats = () => {

        setLoading(true)
        seasonsApi.get(`${props.seasonId}/playerSeasonStats`)
            .then((data: PlayerSeasonStat[]) => {
                setSeasonPlayerStatList(_.orderBy(data, `player.surname`, "asc"))
                setLoading(false)
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
        setSeasonPlayerStatList(_.orderBy(playerSeasonStatList, columnToSort, sortDirection))
    }, [columnToSort, sortDirection])

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100%',
                marginTop: theme.spacing(3),
                overflowX: 'auto',
            },
            table: {
                minWidth: 650,
                tableLayout: 'fixed'
            },
            firstTableHeaderCell: {
                display: "flex",
                alignItems: "center",
                cursor: "pointer"
            },
            tableHeaderCell: {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                cursor: "pointer"
            }
            
        }),
    );

    const classes = useStyles();

    if (loading) {
        return (
            <i>Loading season...</i>
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div onClick={() => handleSort("player.surname")} className={classes.firstTableHeaderCell}>
                                    <span>Player</span>
                                    {
                                        columnToSort === "player.surname" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                <div onClick={() => handleSort("seasonStat.capCount")} className={classes.tableHeaderCell}>
                                    {
                                        columnToSort === "seasonStat.capCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Caps</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                <div onClick={() => handleSort("seasonStat.goalCount")} className={classes.tableHeaderCell}>                                
                                    {
                                        columnToSort === "seasonStat.goalCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Goals</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                <div onClick={() => handleSort("seasonStat.motmCount")} className={classes.tableHeaderCell}>                                
                                    {
                                        columnToSort === "seasonStat.motmCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>MotMs</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                    Strike Rate
                            </TableCell>
                            <TableCell align="right">
                                    Win %
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerSeasonStatList.map((item: PlayerSeasonStat) => (
                            <TableRow key={item.player._id}>
                                <TableCell>
                                    <Link to={'/player/' + item.player._id}>{item.player.firstName} {item.player.surname}</Link>
                                </TableCell>
                                <TableCell align="right">{item.seasonStat.capCount}</TableCell>
                                <TableCell align="right">{item.seasonStat.goalCount}</TableCell>
                                <TableCell align="right">{item.seasonStat.motmCount}</TableCell>
                                <TableCell align="right">{Math.round((item.seasonStat.goalCount / item.seasonStat.capCount) * 100) / 100}</TableCell>
                                <TableCell align="right">{Math.round((item.seasonStat.winCount / item.seasonStat.capCount) * 100) / 100}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}

export default PlayerSeasonStatsTable