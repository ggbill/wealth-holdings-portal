import './instanceList.scss'
import React, { useState, useRef, useEffect } from 'react'
import useFetch from "../../hooks/useFetch"
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core"
import Loading from '../shared/Loading'
import moment from 'moment'
import useCommonFunctions from '../../hooks/useCommonFunctions'
import InstanceFilters from './InstanceFilters'
import SummaryFigures from './SummaryFigures'
import _ from "lodash"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

const InstanceList = ({ match }) => {
    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeCases, setActiveCases] = useState<App.ActiveCase[]>([])
    const [filteredActiveCases, setFilteredActiveCases] = useState<App.ActiveCase[]>([])
    const [columnToSort, setColumnToSort] = useState("")
    const [sortDirection, setSortDirection] = useState("")
    

    const commonFunctions = useCommonFunctions()

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    const getLatestDataForActiveCases = (): void => {
        setLoading(true)
        kissflowApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    setActiveCases(data)
                    setFilteredActiveCases(data)
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    setError(err.message)
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

        if (columnToSort === "ragStatus") {
            setFilteredActiveCases(_.orderBy(filteredActiveCases,
                function (item: App.ActiveCase) {
                    return (commonFunctions.determineRAGStatus(item));
                },
                sortDirection))
        } else if (columnToSort === "assignedBdm") {
            setFilteredActiveCases(_.orderBy(filteredActiveCases,
                function (item: App.ActiveCase) {
                    return (item.assignedBdm.Name);
                },
                sortDirection))
        } else {
            setFilteredActiveCases(_.orderBy(filteredActiveCases, columnToSort, sortDirection))
        }



        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnToSort, sortDirection])

    useEffect(() => {
        getLatestDataForActiveCases();

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
        <div className="instance-list">
            <h1>Live Instances</h1>
            <InstanceFilters
                activeCases={activeCases}
                setFilteredActiveCases={setFilteredActiveCases}
            />
            {/* {JSON.stringify(filteredActiveCases)} */}

            <SummaryFigures
                activeCases={filteredActiveCases}
            />

            <h2>Instances</h2>
            <Paper>
                <Table className="instances-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div onClick={() => handleSort("firmName")} className="tableHeaderCell">
                                    <span>Firm Name</span>
                                    {
                                        columnToSort === "firmName" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("_current_step")} className="tableHeaderCell">
                                    <span>Current Activity</span>
                                    {
                                        columnToSort === "_current_step" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("_created_at")} className="tableHeaderCell">
                                    <span>Activity Start Date</span>
                                    {
                                        columnToSort === "_created_at" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell align="center">
                                <div onClick={() => handleSort("ragStatus")} className="tableHeaderCell">
                                    <span>RAG Status</span>
                                    {
                                        columnToSort === "ragStatus" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div onClick={() => handleSort("assignedBdm")} className="tableHeaderCell">
                                    <span>Assigned BDM</span>
                                    {
                                        columnToSort === "assignedBdm" ? (
                                            sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                        ) : null
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredActiveCases.map((activeCase: App.ActiveCase) => (
                            <TableRow key={activeCase._id}>
                                <TableCell>{activeCase.firmName}</TableCell>
                                <TableCell>{activeCase._current_step}</TableCell>
                                <TableCell>{moment(activeCase._created_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                                {commonFunctions.determineRAGStatus(activeCase) === "GREEN" &&
                                    <TableCell align="center"><div className="rag-circle green"></div></TableCell>
                                }
                                {commonFunctions.determineRAGStatus(activeCase) === "AMBER" &&
                                    <TableCell align="center"><div className="rag-circle amber"></div></TableCell>
                                }
                                {commonFunctions.determineRAGStatus(activeCase) === "RED" &&
                                    <TableCell align="center"><div className="rag-circle red"></div></TableCell>
                                }
                                <TableCell>{activeCase.assignedBdm.Name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div >
    )
}

export default InstanceList