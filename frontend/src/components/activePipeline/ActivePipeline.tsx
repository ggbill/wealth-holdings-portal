import './activePipeline.scss'
import React, { useState, useRef, useEffect } from 'react'
import useFetch from "../../hooks/useFetch"
import useMarriageBureauExcelFunctions from "../../hooks/useMarriageBureauExcelFunctions"
import useBuyerOnboardingExcelFunctions from "../../hooks/useBuyerOnboardingExcelFunctions"
import useSellerOnboardingExcelFunctions from "../../hooks/useSellerOnboardingExcelFunctions"
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, FormControlLabel, Switch } from "@material-ui/core"
import Loading from '../shared/Loading'
import moment from 'moment'
import InstanceFilters from './InstanceFilters'
import SummaryFigures from './SummaryFigures'
import _ from "lodash"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { Link } from 'react-router-dom'
import RagIndicator from '../shared/RagIndicator'
import { useLocation } from 'react-router-dom'

interface InputProps {
    auth: any,
}

const ActivePipeline = (props: InputProps) => {
    const isCancelled = useRef(false)
    const settingsApi = useFetch("settings")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeCases, setActiveCases] = useState<App.ActivityDetail[]>([])
    const [filteredActiveCases, setFilteredActiveCases] = useState<App.ActivityDetail[]>([])
    const [columnToSort, setColumnToSort] = useState("_last_action_performed_at")
    const [sortDirection, setSortDirection] = useState("desc")
    const [tableFilters, setTableFilters] = useState<App.TableFilters>({ currentActivity: "All", assignedBdm: "All", ragStatus: "All", representing: "All" })
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const marriageBureauExcelFunctions = useMarriageBureauExcelFunctions();
    const buyerOnboardingExcelFunctions = useBuyerOnboardingExcelFunctions();
    const sellerOnboardingExcelFunctions = useSellerOnboardingExcelFunctions();
    const [isSimplyBizFilter, setIsSimplyBizFilter] = useState<boolean>(true)
    const [authorisedUserProfile, setAuthorisedUserProfile] = useState<any>(null)
    const { getProfile, isAuthenticated } = props.auth;

    let location = useLocation();

    let process = ""

    if (location.pathname.split("/")[1] === "marriage-bureau") {
        process = "marriage-bureau"
    } else if (location.pathname.split("/")[1] === "buyer-onboarding") {
        process = "buyer-onboarding"
    } else if (location.pathname.split("/")[1] === "seller-onboarding") {
        process = "seller-onboarding"
    }

    const processApi = useFetch(process)

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

    const getLatestDataForActiveCases = (): void => {
        setLoading(true)
        processApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {

                    if (isSimplyBizFilter) {
                        if (location.pathname.split("/")[1] === "marriage-bureau") {
                            setActiveCases(data.filter((activeCase) =>
                                activeCase.isSimplyBizDeal === true
                            ).sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))

                            setFilteredActiveCases(data.filter((activeCase) =>
                                activeCase.isSimplyBizDeal === true
                            ).sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))

                        } else {
                            setActiveCases(data.filter((activeCase) =>
                                (activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true")
                            ).sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))

                            setFilteredActiveCases(data.filter((activeCase) =>
                                (activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true")
                            ).sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
                        }
                    } else {
                        setActiveCases(data.sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
                        setFilteredActiveCases(data.sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
                    }

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

    React.useEffect(() => {
        if (isAuthenticated() && !isCancelled.current) {
            getProfile((err, profile) => {
                if (err) {
                    console.log(err)
                }
                setAuthorisedUserProfile(profile)

                if (profile && profile.name !== "a.morley@simplybiz.co.uk") {
                    setIsSimplyBizFilter(false)
                }
            });
        }

        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    useEffect(() => {

        if (columnToSort === "ragStatus") {
            setFilteredActiveCases(_.orderBy(filteredActiveCases,
                function (item: App.ActivityDetail) {
                    return (item.confidence);
                    // return (commonFunctions.determineRAGStatus(item, activitySummaries));
                },
                sortDirection))

        } else if (columnToSort === "_last_action_performed_at") {
            setFilteredActiveCases(_.orderBy(filteredActiveCases,
                function (item: App.ActivityDetail) {
                    return (new Date(item._last_action_performed_at).getTime());
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
        getActivitySummaries()
        getLatestDataForActiveCases()

        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [isSimplyBizFilter]);

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
        <>
            {activeCases.length > 1 &&
                <div className="instance-list">
                    {isSimplyBizFilter.valueOf()}

                    {authorisedUserProfile && authorisedUserProfile.name !== "a.morley@simplybiz.co.uk" &&
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isSimplyBizFilter}
                                    onChange={() => setIsSimplyBizFilter(!isSimplyBizFilter)}
                                    name="isSimplyBizFilter"
                                />
                            }
                            label={`Display SimplyBiz Data Only: ${isSimplyBizFilter.valueOf()}`}
                        />
                    }

                    <InstanceFilters
                        activeCases={activeCases}
                        activitySummaries={activitySummaries}
                        setFilteredActiveCases={setFilteredActiveCases}
                        setTableFilters={setTableFilters}
                        tableFilters={tableFilters}
                        // path={props.match.path}
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
                        title="Summary Figures"
                    />

                    <h3>Instances {isFilterApplied() && <>(Filtered)<span className="clear-filters" onClick={() => clearAllFilters()}>Clear</span></>}</h3>
                    <Paper>
                        <Table className="instances-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <div className="table-header-wrapper leftAlign">
                                            {/* <div className="table-header-wrapper leftAlign" style={determineHeaderRowStyle()}> */}
                                            <div onClick={() => handleSort("firmName")} className="tableHeaderCell">
                                                <span>Name</span>
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
                                        </div>
                                    </TableCell>
                                    <TableCell className="hide-on-mobile">
                                        <div className="table-header-wrapper" >
                                            <div onClick={() => handleSort("_last_action_performed_at")} className="tableHeaderCell">
                                                <span>Activity Start Date</span>
                                                {
                                                    columnToSort === "_last_action_performed_at" ? (
                                                        sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hide-on-mobile">
                                        <div className="table-header-wrapper" >
                                            <div onClick={() => handleSort("_created_at")} className="tableHeaderCell">
                                                <span>Process Start Date</span>
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
                                                <span>Status</span>
                                                {
                                                    columnToSort === "ragStatus" ? (
                                                        sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/* {location.pathname.split("/")[1] === "buyer-onboarding" &&
                            <TableCell className="hide-on-mobile">
                                <div className="table-header-wrapper">
                                    <div onClick={() => handleSort("fundsAvailable")} className="tableHeaderCell">
                                        <span>Funds Available</span>
                                        {
                                            columnToSort === "fundsAvailable" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </TableCell>

                            // <TableCell className="hide-on-mobile">
                            //     <div className="table-header-wrapper">
                            //         <div onClick={() => handleSort("assignedBdm")} className="tableHeaderCell">
                            //             <span>Assignee</span>
                            //             {
                            //                 columnToSort === "assignedBdm" ? (
                            //                     sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                            //                 ) : null
                            //             }
                            //         </div>
                            //     </div>
                            // </TableCell>
                        } */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredActiveCases.map((activeCase: App.ActivityDetail) => (
                                    <TableRow key={activeCase._id}>
                                        {/* {location.pathname.split("/")[1] === "marriage-bureau" ?
                                <TableCell> <Link to={'/marriage-bureau/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell> :
                                <TableCell> <Link to={'/buyer-onboarding/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>
                            } */}
                                        {location.pathname.split("/")[1] === "marriage-bureau" && <TableCell><Link to={'/marriage-bureau/instance-details/' + activeCase._id}>{activeCase.buyer} purchasing {activeCase.seller}</Link></TableCell>}
                                        {location.pathname.split("/")[1] === "seller-onboarding" && <TableCell><Link to={'/seller-onboarding/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>}
                                        {location.pathname.split("/")[1] === "buyer-onboarding" && <TableCell><Link to={'/buyer-onboarding/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>}
                                        <TableCell align="center">{activeCase._current_step}</TableCell>
                                        <TableCell className="hide-on-mobile" align="center">
                                            <div className="date-wrapper">
                                                <span>{`${moment(activeCase._last_action_performed_at).format("HH:mm DD/MM/YYYY")}`}</span>
                                                {!isSimplyBizFilter &&
                                                    <span style={{ fontSize: "0.8em" }}>{` (${moment.duration(moment(moment().startOf('day')).diff(activeCase._last_action_performed_at)).asDays().toFixed(1)} days ago)`}</span>
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell className="hide-on-mobile" align="center">
                                            <div className="date-wrapper">
                                                <span>{`${moment(activeCase._created_at).format("HH:mm DD/MM/YYYY")}`}</span>
                                                {!isSimplyBizFilter &&
                                                    <span style={{ fontSize: "0.8em" }}>{` (${moment.duration(moment(moment().startOf('day')).diff(activeCase._created_at)).asDays().toFixed(1)} days ago)`}</span>
                                                }
                                            </div>
                                        </TableCell>

                                        <TableCell className="hide-on-mobile" align="center">
                                            <RagIndicator ragStatus={activeCase.confidence} widthPx={30} />
                                            {/* <RagIndicator ragStatus={commonFunctions.determineRAGStatus(activeCase, activitySummaries)} widthPx={30} /> */}
                                        </TableCell>
                                        {/* {location.pathname.split("/")[1] === "buyer-onboarding" &&
                                <TableCell className="hide-on-mobile" align="center">{activeCase.fundsAvailable ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activeCase.fundsAvailable) : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(0)}</TableCell>

                                // <TableCell className="hide-on-mobile" align="center">{activeCase._current_assigned_to.Name}</TableCell>
                            } */}

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                    <div className="button-container">
                        {location.pathname.split("/")[1] === "marriage-bureau" && <Button className="wh-button" variant="contained" onClick={() => marriageBureauExcelFunctions.generateInstanceList(filteredActiveCases, activitySummaries)}>Export</Button>}
                        {location.pathname.split("/")[1] === "seller-onboarding" && <Button className="wh-button" variant="contained" onClick={() => { sellerOnboardingExcelFunctions.generateInstanceList(filteredActiveCases, activitySummaries); console.log(filteredActiveCases) }}>Export</Button>}
                        {location.pathname.split("/")[1] === "buyer-onboarding" && <Button className="wh-button" variant="contained" onClick={() => buyerOnboardingExcelFunctions.generateInstanceList(filteredActiveCases, activitySummaries)}>Export</Button>}
                    </div>
                </div >
            }
        </>
    )
}

export default ActivePipeline