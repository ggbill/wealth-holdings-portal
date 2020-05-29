import './instanceList.scss'
import React, { useState, useRef, useEffect } from 'react'
import useFetch from "../../hooks/useFetch"
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Tooltip, Fade } from "@material-ui/core"
import Loading from '../shared/Loading'
import moment from 'moment'
import useCommonFunctions from '../../hooks/useCommonFunctions'
import InstanceFilters from './InstanceFilters'
import SummaryFigures from './SummaryFigures'
import _ from "lodash"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import CloseIcon from '@material-ui/icons/Close'
import { Link } from 'react-router-dom'
import RagIndicator from '../shared/RagIndicator'

const InstanceList = ({ match }) => {
    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeCases, setActiveCases] = useState<App.ActiveCase[]>([])
    const [filteredActiveCases, setFilteredActiveCases] = useState<App.ActiveCase[]>([])
    const [columnToSort, setColumnToSort] = useState("_created_at")
    const [sortDirection, setSortDirection] = useState("desc")
    const [tableFilters, setTableFilters] = useState<App.TableFilters>({ currentActivity: "All", assignedBdm: "All", ragStatus: "All" })

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

    const determineHeaderRowStyle = (): any => {
        if ((tableFilters.currentActivity !== "All" ||
            tableFilters.ragStatus !== "All" ||
            tableFilters.assignedBdm !== "All")) {
            return ({ height: 40 })
        }
    }

    const clearFilter = (filter: string): any => {
        // console.log(`clearFilter: ${filter}`)
        if (filter === "currentActivity") {
            setTableFilters({ ...tableFilters, currentActivity: "All" })
        } else if (filter === "ragStatus") {
            setTableFilters({ ...tableFilters, ragStatus: "All" })
        } else if (filter === "assignedBdm") {
            setTableFilters({ ...tableFilters, assignedBdm: "All" })
        }
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
                setTableFilters={setTableFilters}
                tableFilters={tableFilters}
                path={match.path}
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
                                <div className="table-header-wrapper leftAlign" style={determineHeaderRowStyle()}>
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
                                <div className="table-header-wrapper" style={determineHeaderRowStyle()}>
                                    <div onClick={() => handleSort("_current_step")} className="tableHeaderCell">
                                        <span>Current Activity</span>
                                        {
                                            columnToSort === "_current_step" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                    {tableFilters.currentActivity !== "All" &&
                                        <span className="filter-indicator">
                                            Filter: {tableFilters.currentActivity}
                                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 1000 }} title="Clear filter">
                                                <CloseIcon onClick={() => clearFilter("currentActivity")} />
                                            </Tooltip>
                                        </span>
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="table-header-wrapper" style={determineHeaderRowStyle()}>
                                    <div onClick={() => handleSort("_created_at")} className="tableHeaderCell">
                                        <span>Activity Start Date</span>
                                        {
                                            columnToSort === "_created_at" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="table-header-wrapper" style={determineHeaderRowStyle()}>
                                    <div onClick={() => handleSort("ragStatus")} className="tableHeaderCell">
                                        <span>RAG Status</span>
                                        {
                                            columnToSort === "ragStatus" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                    {tableFilters.ragStatus !== "All" &&
                                        <span className="filter-indicator">
                                            Filter: {tableFilters.ragStatus}
                                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 1000 }} title="Clear filter">
                                                <CloseIcon onClick={() => clearFilter("ragStatus")} />
                                            </Tooltip>
                                        </span>
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="table-header-wrapper" style={determineHeaderRowStyle()}>
                                    <div onClick={() => handleSort("assignedBdm")} className="tableHeaderCell">
                                        <span>Assigned BDM</span>
                                        {
                                            columnToSort === "assignedBdm" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                    {tableFilters.assignedBdm !== "All" &&
                                        <span className="filter-indicator">
                                            Filter: {tableFilters.assignedBdm}
                                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 1000 }} title="Clear filter">
                                                <CloseIcon onClick={() => clearFilter("assignedBdm")} />
                                            </Tooltip>
                                        </span>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredActiveCases.map((activeCase: App.ActiveCase) => (
                            <TableRow key={activeCase._id}>
                                <TableCell> <Link to={'/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>
                                <TableCell align="center">{activeCase._current_step}</TableCell>
                                <TableCell align="center">{moment(activeCase._created_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                                <TableCell align="center">
                                    <RagIndicator ragStatus={commonFunctions.determineRAGStatus(activeCase)} widthPx={30} />
                                </TableCell>
                                <TableCell align="center">{activeCase.assignedBdm.Name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div >
    )
}

export default InstanceList