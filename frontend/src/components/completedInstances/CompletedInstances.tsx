import React, { useState, useRef, useEffect } from 'react'
import './completedInstances.scss'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, FormControlLabel, Switch } from "@material-ui/core"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import useMarriageBureauExcelFunctions from "../../hooks/useMarriageBureauExcelFunctions"
import useBuyerOnboardingExcelFunctions from "../../hooks/useBuyerOnboardingExcelFunctions"
import { Link, useLocation } from 'react-router-dom'
import _ from "lodash"
import moment from 'moment'
import SummaryFigures from '../activePipeline/SummaryFigures'

const CompletedInstances = () => {

    const isCancelled = useRef(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [closedCases, setClosedCases] = useState<App.ActivityDetail[]>([])
    const [columnToSort, setColumnToSort] = useState("_created_at")
    const [sortDirection, setSortDirection] = useState("desc")
    const [isSimplyBizFilter, setIsSimplyBizFilter] = useState<boolean>(false)

    const marriageBureauExcelFunctions = useMarriageBureauExcelFunctions();
    const buyerOnboardingExcelFunctions = useBuyerOnboardingExcelFunctions();

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

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    const getClosedCases = (): void => {
        setLoading(true)
        processApi.get("getClosedCases")
            .then(data => {
                if (!isCancelled.current) {


                    if (isSimplyBizFilter) {
                        if (location.pathname.split("/")[1] === "marriage-bureau") {
                            setClosedCases(data.filter((activeCase) =>
                                (activeCase.isSimplyBizDeal === true && activeCase.activityAction !== "Close Case")
                            ))
                        } else {
                            setClosedCases(data.filter((activeCase) =>
                                ((activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true") && activeCase.activityAction !== "Close Case")
                            ))
                        }
                    } else {
                        setClosedCases(data.filter(result => result.activityAction !== "Close Case"))
                    }

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

        if (columnToSort === "assignedBdm") {
            setClosedCases(_.orderBy(closedCases,
                function (closedCase: App.ActivityDetail) {
                    return (moment.duration(moment(closedCase._last_action_performed_at).diff(moment(closedCase._created_at))).asDays());
                },
                sortDirection))
        } else {
            setClosedCases(_.orderBy(closedCases, columnToSort, sortDirection))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [columnToSort, sortDirection])


    useEffect(() => {
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    useEffect(() => {
        getClosedCases()
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
        <div className="closed-instance-list">

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

            <div className="summary-figures-wrapper">
                <SummaryFigures
                    activeCases={closedCases}
                    isFilterApplied={() => false}
                    clearAllFilters={() => false}
                    pathname={location.pathname.split("/")[1]}
                    title="Completed Deals - Summary Figures"
                />
            </div>

            <Paper>
                <Table className="instances-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div className="table-header-wrapper leftAlign">
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
                            <TableCell>
                                <div className="table-header-wrapper">
                                    <div onClick={() => handleSort("_last_action_performed_at")} className="tableHeaderCell">
                                        <span>Instance Duration (days)</span>
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
                                {location.pathname.split("/")[1] === "marriage-bureau" ?
                                    <TableCell> <Link to={'/marriage-bureau/instance-details/' + closedCase._kissflow_id}>{closedCase.buyer} purchasing {closedCase.seller}</Link></TableCell> :
                                    <TableCell> <Link to={'/buyer-onboarding/instance-details/' + closedCase._kissflow_id}>{closedCase.firmName}</Link></TableCell>
                                }

                                <TableCell align="center">{moment(closedCase._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</TableCell>

                                <TableCell align="center">{moment.duration(moment(closedCase._last_action_performed_at).diff(moment(closedCase._created_at))).asDays().toFixed(1)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <div className="button-container">
                {location.pathname.split("/")[1] === "marriage-bureau" ?
                    <Button className="wh-button" variant="contained" onClick={() => marriageBureauExcelFunctions.generateCompletedInstances(closedCases)}>Export</Button> :
                    <Button className="wh-button" variant="contained" onClick={() => buyerOnboardingExcelFunctions.generateCompletedInstances(closedCases)}>Export</Button>
                }
            </div>
        </div>

    )
}

export default CompletedInstances