import './instanceList.scss'
import React, { useState, useRef, useEffect } from 'react'
import useFetch from "../../hooks/useFetch"
import useExcelFunctions from "../../hooks/useExcelFunctions"
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@material-ui/core"
import Loading from '../shared/Loading'
import moment from 'moment'
import useCommonFunctions from '../../hooks/useCommonFunctions'
import InstanceFilters from './InstanceFilters'
import SummaryFigures from './SummaryFigures'
import _ from "lodash"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { Link } from 'react-router-dom'
import RagIndicator from '../shared/RagIndicator'

const InstanceList = ({ match }) => {
    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeCases, setActiveCases] = useState<App.ActivityDetail[]>([])
    const [filteredActiveCases, setFilteredActiveCases] = useState<App.ActivityDetail[]>([])
    const [columnToSort, setColumnToSort] = useState("_created_at")
    const [sortDirection, setSortDirection] = useState("desc")
    const [tableFilters, setTableFilters] = useState<App.TableFilters>({ currentActivity: "All", assignedBdm: "All", ragStatus: "All", representing: "All" })

    const commonFunctions = useCommonFunctions()
    const excelFunctions = useExcelFunctions();

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
                    console.log(data)
                    setActiveCases(data.sort((a, b) => new Date(b._created_at).getTime() - new Date(a._created_at).getTime()))
                    setFilteredActiveCases(data.sort((a, b) => new Date(b._created_at).getTime() - new Date(a._created_at).getTime()))
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

    // const determineHeaderRowStyle = (): any => {
    //     if ((tableFilters.currentActivity !== "All" ||
    //         tableFilters.ragStatus !== "All" ||
    //         tableFilters.assignedBdm !== "All" ||
    //         tableFilters.representing !== "All")) {
    //         return ({ height: 40 })
    //     }
    // }

    const clearFilter = (filter: string): any => {
        // console.log(`clearFilter: ${filter}`)
        if (filter === "currentActivity") {
            setTableFilters({ ...tableFilters, currentActivity: "All" })
        } else if (filter === "ragStatus") {
            setTableFilters({ ...tableFilters, ragStatus: "All" })
        } else if (filter === "assignedBdm") {
            setTableFilters({ ...tableFilters, assignedBdm: "All" })
        } else if (filter === "representing") {
            setTableFilters({ ...tableFilters, representing: "All" })
        }
    }

    const clearAllFilters = (): void => {
        setTableFilters({
            currentActivity: "All",
            ragStatus: "All",
            assignedBdm: "All",
            representing: "All"
        })
    }

    const isFilterApplied = (): boolean => {
        if (tableFilters.currentActivity === "All" &&
        tableFilters.ragStatus === "All" &&
        tableFilters.assignedBdm === "All" &&
        tableFilters.representing === "All"){
            return false
        }else{
            return true
        }
    }

    useEffect(() => {

        if (columnToSort === "ragStatus") {
            setFilteredActiveCases(_.orderBy(filteredActiveCases,
                function (item: App.ActivityDetail) {
                    return (commonFunctions.determineRAGStatus(item));
                },
                sortDirection))
        } else if (columnToSort === "assignedBdm") {
            setFilteredActiveCases(_.orderBy(filteredActiveCases,
                function (item: App.ActivityDetail) {
                    return (item._current_assigned_to.Name);
                },
                sortDirection))
        } else if (columnToSort === "representing") {
            setFilteredActiveCases(_.orderBy(filteredActiveCases,
                function (item: App.ActivityDetail) {
                    return (item.representing);
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

            <InstanceFilters
                activeCases={activeCases}
                setFilteredActiveCases={setFilteredActiveCases}
                setTableFilters={setTableFilters}
                tableFilters={tableFilters}
                path={match.path}
                isFilterApplied={isFilterApplied}
                clearAllFilters={clearAllFilters}
            />
            {/* {JSON.stringify(filteredActiveCases)} */}

            <SummaryFigures
                activeCases={filteredActiveCases}
                isFilterApplied={isFilterApplied}
                clearAllFilters={clearAllFilters}
            />

            <h2>Instances {isFilterApplied() && <>(Filtered)<span className="clear-filters" onClick={() => clearAllFilters()}>Clear</span></>}</h2>
            <Paper>
                <Table className="instances-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div className="table-header-wrapper leftAlign">
                                {/* <div className="table-header-wrapper leftAlign" style={determineHeaderRowStyle()}> */}
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
                                <div className="table-header-wrapper" >
                                    <div onClick={() => handleSort("_current_step")} className="tableHeaderCell">
                                        <span>Current Activity</span>
                                        {
                                            columnToSort === "_current_step" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                    {/* {tableFilters.currentActivity !== "All" &&
                                        <span className="filter-indicator">
                                            Filter: {tableFilters.currentActivity}
                                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 1000 }} title="Clear filter">
                                                <CloseIcon onClick={() => clearFilter("currentActivity")} />
                                            </Tooltip>
                                        </span>
                                    } */}
                                </div>
                            </TableCell>
                            <TableCell className="hide-on-mobile">
                                <div className="table-header-wrapper" >
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
                            <TableCell className="hide-on-mobile">
                                <div className="table-header-wrapper" >
                                    <div onClick={() => handleSort("ragStatus")} className="tableHeaderCell">
                                        <span>RAG Status</span>
                                        {
                                            columnToSort === "ragStatus" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                    {/* {tableFilters.ragStatus !== "All" &&
                                        <span className="filter-indicator">
                                            Filter: {tableFilters.ragStatus}
                                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 1000 }} title="Clear filter">
                                                <CloseIcon onClick={() => clearFilter("ragStatus")} />
                                            </Tooltip>
                                        </span>
                                    } */}
                                </div>
                            </TableCell>
                            <TableCell className="hide-on-mobile">
                                <div className="table-header-wrapper">
                                    <div onClick={() => handleSort("assignedBdm")} className="tableHeaderCell">
                                        <span>Assigned BDM</span>
                                        {
                                            columnToSort === "assignedBdm" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                    {/* {tableFilters.assignedBdm !== "All" &&
                                        <span className="filter-indicator">
                                            Filter: {tableFilters.assignedBdm}
                                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 1000 }} title="Clear filter">
                                                <CloseIcon onClick={() => clearFilter("assignedBdm")} />
                                            </Tooltip>
                                        </span>
                                    } */}
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredActiveCases.map((activeCase: App.ActivityDetail) => (
                            <TableRow key={activeCase._id}>
                                <TableCell> <Link to={'/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>
                                <TableCell align="center">{activeCase._current_step}</TableCell>
                                <TableCell className="hide-on-mobile" align="center">{moment(activeCase._created_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                                <TableCell className="hide-on-mobile" align="center">
                                    <RagIndicator ragStatus={commonFunctions.determineRAGStatus(activeCase)} widthPx={30} />
                                </TableCell>
                                <TableCell className="hide-on-mobile" align="center">{activeCase._current_assigned_to.Name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
            </Paper>
            <div className="button-container">
                <Button className="wh-button" variant="contained" onClick={() => excelFunctions.generateInstanceList(filteredActiveCases)}>Export</Button>
            </div>
            
        </div >

    )
}

export default InstanceList