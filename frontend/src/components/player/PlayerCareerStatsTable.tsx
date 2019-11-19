import React, { useState, useEffect } from "react"
import './player.scss'
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

    const url = process.env.PUBLIC_URL || "http://localhost:8080"
  
    const getPlayerCareerStats = (): void => {
        fetch(`${url}/seasons/${props.playerId}/playerCareerStats`, {
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
            <TableRow key={"total"} className="total">
                <TableCell className="align-left">
                    {totalFigures.seasonName}
                </TableCell>
                <TableCell>{totalFigures.capCount}</TableCell>
                <TableCell>{totalFigures.goalCount}</TableCell>
                <TableCell>{totalFigures.motmCount}</TableCell>
                <TableCell className="hide-on-mobile">{Math.round((totalFigures.goalCount / totalFigures.capCount) * 100)}%</TableCell>
                <TableCell className="hide-on-mobile">{Math.round((totalFigures.winCount / totalFigures.capCount) * 100)}%</TableCell>
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

    useEffect(() => {
        getPlayerCareerStats()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Paper className="stats-table-wrapper">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell>
                                <div onClick={() => handleSort("seasonStartDate")} className="firstTableHeaderCell">
                                    <span>Season</span>
                                    {
                                        columnToSort === "seasonStartDate" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("capCount")} className="tableHeaderCell">
                                    {
                                        columnToSort === "capCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Caps</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("goalCount")} className="tableHeaderCell">
                                    {
                                        columnToSort === "goalCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>Goals</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("motmCount")} className="tableHeaderCell">
                                    {
                                        columnToSort === "motmCount" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                    <span>MotMs</span>
                                </div>
                            </TableCell>
                            <TableCell className="hide-on-mobile">Goals/Game %</TableCell>
                            <TableCell className="hide-on-mobile">Win %</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerCareerStatList.map((item: SeasonStat, index: number) => (
                            <TableRow key={item.seasonId} >
                                <TableCell className="align-left">
                                    <Link to={'/season/' + item.seasonId}>{item.seasonName}</Link>
                                </TableCell>
                                <TableCell>{item.capCount}</TableCell>
                                <TableCell>{item.goalCount}</TableCell>
                                <TableCell>{item.motmCount}</TableCell>
                                <TableCell className="hide-on-mobile">{Math.round((item.goalCount / item.capCount) * 100)}%</TableCell>
                                <TableCell className="hide-on-mobile">{Math.round((item.winCount / item.capCount) * 100)}%</TableCell>
                            </TableRow>
                        ))}
                        {generateTotalRow()}
                    </TableBody>
                </Table>
            </Paper>
            <p className="hide-on-desktop">
                <i>* Columns hidden for small screen size. Please hold your phone in landscape mode, or view on a larger screen to see full detail.</i>
            </p>
        </>
    )
}

export default PlayerCareerStatsTable