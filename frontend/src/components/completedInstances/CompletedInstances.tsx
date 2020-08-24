import React, { useState, useRef, useEffect } from 'react'
import './completedInstances.scss'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@material-ui/core"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import useExcelFunctions from "../../hooks/useExcelFunctions"
import { Link } from 'react-router-dom'
import _ from "lodash"
import moment from 'moment'

const CompletedInstances = () => {

    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [closedCases, setClosedCases] = useState<App.ActivityDetail[]>([])
    const [columnToSort, setColumnToSort] = useState("_created_at")
    const [sortDirection, setSortDirection] = useState("desc")

    const excelFunctions = useExcelFunctions();

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    const getClosedCases = (): void => {
        setLoading(true)
        kissflowApi.get("getClosedCases")
            .then(data => {
                if (!isCancelled.current) {
                    setClosedCases(data.filter(result => !result.isCloseCase))
                    console.log(data.filter(result => !result.isCloseCase))
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    const handleSort = (columnName) => {
        setColumnToSort(columnName)

        let sortDirect;
        sortDirect = columnToSort === columnName ? invertDirection(sortDirection) : 'desc'
        setSortDirection(sortDirect)
    }

    useEffect(() => {
        setClosedCases(_.orderBy(closedCases, columnToSort, sortDirection))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnToSort, sortDirection])


    useEffect(() => {
        getClosedCases();
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="closed-instance-list">
            <Paper>
                <Table className="instances-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div className="table-header-wrapper leftAlign">
                                    <div onClick={() => handleSort("firmName")} className="tableHeaderCell">
                                        <span>Firm Name</span>
                                        {
                                            columnToSort === "firmName" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                            <div className="table-header-wrapper">
                                    <div onClick={() => handleSort("_last_action_performed_at")} className="tableHeaderCell">
                                        <span>Completed Date</span>
                                        {
                                            columnToSort === "_last_action_performed_at" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {closedCases.map((closedCase: App.ActivityDetail) => (
                            <TableRow key={closedCase._id}>
                                <TableCell> <Link to={'/instance-details/' + closedCase._kissflow_id}>{closedCase.firmName}</Link></TableCell>
                                <TableCell align="center">{moment(closedCase._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <div className="button-container">
                <Button className="wh-button" variant="contained" onClick={() => excelFunctions.generateCompletedInstances(closedCases)}>Export</Button> 
            </div>
        </div>

    )
}

export default CompletedInstances