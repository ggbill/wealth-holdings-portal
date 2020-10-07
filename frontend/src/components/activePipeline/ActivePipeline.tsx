import './activePipeline.scss'
import React, { useState, useRef, useEffect } from 'react'
import useFetch from "../../hooks/useFetch"
import useMarriageBureauExcelFunctions from "../../hooks/useMarriageBureauExcelFunctions"
import useBuyerOnboardingExcelFunctions from "../../hooks/useBuyerOnboardingExcelFunctions"
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
import { useLocation } from 'react-router-dom'

const ActivePipeline = ({ match }) => {
    const isCancelled = useRef(false)
    const marriageBureauApi = useFetch("marriage-bureau")
    const buyerOnboardingApi = useFetch("buyer-onboarding")
    const settingsApi = useFetch("settings")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeCases, setActiveCases] = useState<App.ActivityDetail[]>([])
    const [filteredActiveCases, setFilteredActiveCases] = useState<App.ActivityDetail[]>([])
    const [columnToSort, setColumnToSort] = useState("_created_at")
    const [sortDirection, setSortDirection] = useState("desc")
    const [tableFilters, setTableFilters] = useState<App.TableFilters>({ currentActivity: "All", assignedBdm: "All", ragStatus: "All", representing: "All" })
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const commonFunctions = useCommonFunctions()
    const marriageBureauExcelFunctions = useMarriageBureauExcelFunctions();
    const buyerOnboardingExcelFunctions = useBuyerOnboardingExcelFunctions();

    let location = useLocation();

    const getActivitySummaries = (): void => {
        let tempActivitySummaries = []
        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    data.filter(result => result.process === location.pathname.split("/")[1]).sort((a, b) => a.orderNumber - b.orderNumber).forEach(setting => {
                        tempActivitySummaries.push({
                            name: setting.activityName,
                            link: "",
                            amberSla: setting.amberSla,
                            redSla: setting.redSla,
                            greenCount: 0,
                            amberCount: 0,
                            redCount: 0,
                            totalCount: 0
                        })
                    });
                }
                setActivitySummaries(tempActivitySummaries)
            })
    }

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    const getLatestDataForActiveMarriageBureauCases = (): void => {
        setLoading(true)
        marriageBureauApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
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

    const getLatestDataForActiveBuyerOnboardingCases = (): void => {
        setLoading(true)
        buyerOnboardingApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
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
            tableFilters.representing === "All") {
            return false
        } else {
            return true
        }
    }

    useEffect(() => {

        if (columnToSort === "ragStatus") {

            if (location.pathname.split("/")[1] === "marriage-bureau") {
                setFilteredActiveCases(_.orderBy(filteredActiveCases,
                    function (item: App.ActivityDetail) {
                        return (commonFunctions.determineMarriageBureauRAGStatus(item, activitySummaries));
                    },
                    sortDirection))
            } else {
                setFilteredActiveCases(_.orderBy(filteredActiveCases,
                    function (item: App.ActivityDetail) {
                        return (commonFunctions.determineBuyerOnboardingRAGStatus(item, activitySummaries));
                    },
                    sortDirection))
            }

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
        getActivitySummaries()
        location.pathname.split("/")[1] === "marriage-bureau" ? getLatestDataForActiveMarriageBureauCases() : getLatestDataForActiveBuyerOnboardingCases()

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
                activitySummaries={activitySummaries}
                setFilteredActiveCases={setFilteredActiveCases}
                setTableFilters={setTableFilters}
                tableFilters={tableFilters}
                path={match.path}
                isFilterApplied={isFilterApplied}
                clearAllFilters={clearAllFilters}
                pathname={location.pathname.split("/")[1]}
            />
            {/* {JSON.stringify(filteredActiveCases)} */}

            <SummaryFigures
                activeCases={filteredActiveCases}
                isFilterApplied={isFilterApplied}
                clearAllFilters={clearAllFilters}
                pathname={location.pathname.split("/")[1]}
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
                                        <span>Assignee</span>
                                        {
                                            columnToSort === "assignedBdm" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredActiveCases.map((activeCase: App.ActivityDetail) => (
                            <TableRow key={activeCase._id}>
                                {location.pathname.split("/")[1] === "marriage-bureau" ?
                                    <TableCell> <Link to={'/marriage-bureau/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell> :
                                    <TableCell> <Link to={'/buyer-onboarding/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>
                                }
                                <TableCell align="center">{activeCase._current_step}</TableCell>
                                <TableCell className="hide-on-mobile" align="center">{moment(activeCase._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                                <TableCell className="hide-on-mobile" align="center">
                                    {location.pathname.split("/")[1] === "marriage-bureau" ?
                                        <RagIndicator ragStatus={commonFunctions.determineMarriageBureauRAGStatus(activeCase, activitySummaries)} widthPx={30} /> :
                                        <RagIndicator ragStatus={commonFunctions.determineBuyerOnboardingRAGStatus(activeCase, activitySummaries)} widthPx={30} />
                                    }
                                </TableCell>
                                <TableCell className="hide-on-mobile" align="center">{activeCase._current_assigned_to.Name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Paper>
            <div className="button-container">

                {location.pathname.split("/")[1] === "marriage-bureau" ?
                    <Button className="wh-button" variant="contained" onClick={() => marriageBureauExcelFunctions.generateInstanceList(filteredActiveCases, activitySummaries)}>Export</Button> :
                    <Button className="wh-button" variant="contained" onClick={() => buyerOnboardingExcelFunctions.generateInstanceList(filteredActiveCases, activitySummaries)}>Export</Button>
                }
            </div>

        </div >

    )
}

export default ActivePipeline