import React, { useState, useEffect } from "react"
import './player.scss';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom'
import useFetch from "../../hooks/useFetch"

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

    useEffect(() => {
        getSeasonPlayerStats()
    }, [props.seasonId])

    const getSeasonPlayerStats = () => {

        setLoading(true)
        seasonsApi.get(`${props.seasonId}/playerSeasonStats`)
            .then((data: PlayerSeasonStat[]) => {
                setSeasonPlayerStatList(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
            })
        
    }

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100%',
                marginTop: theme.spacing(3),
                overflowX: 'auto',
            },
            table: {
                minWidth: 650,
            },
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
                            <TableCell>Player</TableCell>
                            <TableCell align="right">Caps</TableCell>
                            <TableCell align="right">Goals</TableCell>
                            <TableCell align="right">MotMs</TableCell>
                            <TableCell align="right">Strike Rate</TableCell>
                            <TableCell align="right">Win %</TableCell>
                            <TableCell align="right">Loss %</TableCell>
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
                                <TableCell align="right">{Math.round((item.seasonStat.lossCount / item.seasonStat.capCount) * 100) / 100}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}

export default PlayerSeasonStatsTable