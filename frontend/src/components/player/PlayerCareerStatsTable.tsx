import React, { useState, useEffect } from "react"
import './player.scss';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'
import _ from "lodash"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

interface SeasonStat {
    seasonName: string,
    seasonId: string,
    seasonStartDate: Date,
    capCount: number,
    goalCount: number,
    motmCount: number,
    winCount: number,
    lossCount: number
}

interface InputProps {
    playerId: string;
}

const PlayerCareerStatsTable = (props: InputProps) => {

    const [playerCareerStatList, setPlayerCareerStatList] = useState<SeasonStat[]>([])
    const [columnToSort, setColumnToSort] = useState("")
    const [sortDirection, setSortDirection] = useState("")

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    

    const getPlayerCareerStats = (): void => {
        fetch(`http://localhost:8080/seasons/${props.playerId}/playerCareerStats`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data: SeasonStat[]) => {
                setPlayerCareerStatList(_.orderBy(data, `seasonStartDate`, "desc"))
            })
            .catch(error => {
                console.log(`something didnt work: ${error}`);
            })
    }

    const generateTotalRow = (): any => {
        let totalFigures: SeasonStat = {
            seasonName: "Total",
            seasonId: "",
            seasonStartDate: new Date(),
            capCount: 0,
            goalCount: 0,
            lossCount: 0,
            motmCount: 0,
            winCount: 0
        };

        playerCareerStatList.forEach(seasonStat => {
            totalFigures.capCount += seasonStat.capCount
            totalFigures.goalCount += seasonStat.goalCount
            totalFigures.motmCount += seasonStat.motmCount
            totalFigures.lossCount += seasonStat.lossCount
            totalFigures.winCount += seasonStat.winCount
        });

        return (
            <TableRow key={"total"}>
                <TableCell style={{fontWeight: 'bold'}}>
                    {totalFigures.seasonName}
                </TableCell>
                <TableCell style={{fontWeight: 'bold'}} align="right">{totalFigures.capCount}</TableCell>
                <TableCell style={{fontWeight: 'bold'}} align="right">{totalFigures.goalCount}</TableCell>
                <TableCell style={{fontWeight: 'bold'}} align="right">{totalFigures.motmCount}</TableCell>
                <TableCell style={{fontWeight: 'bold'}} align="right">{Math.round((totalFigures.goalCount / totalFigures.capCount) * 100)}%</TableCell>
                <TableCell style={{fontWeight: 'bold'}} align="right">{Math.round((totalFigures.winCount / totalFigures.capCount) * 100)}%</TableCell>
            </TableRow>
        )
    }

    const handleSort = (columnName) => {
        setColumnToSort(columnName)

        let sortDirect;
        sortDirect = columnToSort === columnName ? invertDirection(sortDirection) : 'desc'
        setSortDirection(sortDirect)
    }

    useEffect(() => {
        setPlayerCareerStatList(_.orderBy(playerCareerStatList, columnToSort, sortDirection))
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

    useEffect(() => {
        getPlayerCareerStats()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell>
                                <div onClick={() => handleSort("seasonStartDate")} className={classes.firstTableHeaderCell}>
                                    <span>Season</span>
                                    {
                                        columnToSort === "seasonStartDate" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                <div onClick={() => handleSort("capCount")} className={classes.tableHeaderCell}>
                                    {
                                        columnToSort === "capCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Caps</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                <div onClick={() => handleSort("goalCount")} className={classes.tableHeaderCell}>
                                    {
                                        columnToSort === "goalCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Goals</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                <div onClick={() => handleSort("motmCount")} className={classes.tableHeaderCell}>
                                    {
                                        columnToSort === "motmCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>MotMs</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">Goals/Game %</TableCell>
                            <TableCell align="right">Win %</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerCareerStatList.map((item: SeasonStat, index: number) => (
                            <TableRow key={item.seasonId} >
                                <TableCell>
                                    <Link to={'/season/' + item.seasonId}>{item.seasonName}</Link>
                                </TableCell>
                                <TableCell align="right">{item.capCount}</TableCell>
                                <TableCell align="right">{item.goalCount}</TableCell>
                                <TableCell align="right">{item.motmCount}</TableCell>
                                <TableCell align="right">{Math.round((item.goalCount / item.capCount) * 100)}%</TableCell>
                                <TableCell align="right">{Math.round((item.winCount / item.capCount) * 100)}%</TableCell>
                            </TableRow>
                        ))}
                        {generateTotalRow()}
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}

export default PlayerCareerStatsTable