import React, { useState, useRef, useEffect } from 'react'
import './closedInstances.scss'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, FormControlLabel, Switch } from "@material-ui/core"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { Link, useLocation } from 'react-router-dom'
import _ from "lodash"
import useMarriageBureauExcelFunctions from "../../hooks/useMarriageBureauExcelFunctions"
import useBuyerOnboardingExcelFunctions from "../../hooks/useBuyerOnboardingExcelFunctions"
import useSellerOnboardingExcelFunctions from "../../hooks/useSellerOnboardingExcelFunctions"
import SummaryFigures from '../activePipeline/SummaryFigures'

interface InputProps {
    auth: any,
}

const ClosedInstances = (props: InputProps) => {
    const isCancelled = useRef(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [closedCases, setClosedCases] = useState<App.ActivityDetail[]>([])
    const [columnToSort, setColumnToSort] = useState("firmName")
    const [sortDirection, setSortDirection] = useState("desc")
    const marriageBureauExcelFunctions = useMarriageBureauExcelFunctions()
    const buyerOnboardingExcelFunctions = useBuyerOnboardingExcelFunctions()
    const sellerOnboardingExcelFunctions = useSellerOnboardingExcelFunctions()
    const [isSimplyBizFilter, setIsSimplyBizFilter] = useState<boolean>(false)
    const [authorisedUserProfile, setAuthorisedUserProfile] = useState<any>(null)
    const { getProfile, isAuthenticated } = props.auth

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
                                (activeCase.isSimplyBizDeal === true && (activeCase.activityAction === "Close Case" || activeCase.completeActivityAction === "Close Case"))
                            ))
                        } else {
                            setClosedCases(data.filter((activeCase) =>
                                ((activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true") && (activeCase.activityAction === "Close Case" || activeCase.completeActivityAction === "Close Case"))
                            ))
                        }
                    } else {
                        // console.log(data.filter(result => (result.activityAction === "Close Case" || result.completeActivityAction === "Close Case")))
                        // console.log(data.filter(result => ( result.completeActivityAction === "Close Case")))
                        setClosedCases(data.filter(result => (result.activityAction === "Close Case" || result.completeActivityAction === "Close Case")))
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
        setClosedCases(_.orderBy(closedCases, columnToSort, sortDirection))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnToSort, sortDirection])


    useEffect(() => {
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
            {authorisedUserProfile && authorisedUserProfile.name !== "a.morley@simplybiz.co.uk" &&
                <div className="sb-filter-wrapper">
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
                </div>
            }

            {location.pathname.split("/")[1] === "marriage-bureau" &&
                <div className="summary-figures-wrapper">
                    <SummaryFigures
                        activeCases={closedCases}
                        isFilterApplied={() => false}
                        clearAllFilters={() => false}
                        pathname={location.pathname.split("/")[1]}
                        title="Aborted Deals - Summary Figures"
                    />
                </div>
            }
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
                            {location.pathname.split("/")[1] !== "marriage-bureau" &&
                                <TableCell>
                                    <div className="table-header-wrapper">
                                        <div onClick={() => handleSort("isReEngage")} className="tableHeaderCell">
                                            <span>Re-Engage In Future?</span>
                                            {
                                                columnToSort === "isReEngage" ? (
                                                    sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                </TableCell>
                            }
                            {location.pathname.split("/")[1] === "marriage-bureau" &&
                                <>
                                    <TableCell>
                                        <div className="table-header-wrapper">
                                            <div onClick={() => handleSort("whFee")} className="tableHeaderCell">
                                                <span>Wealth Holdings Fee</span>
                                                {
                                                    columnToSort === "whFee" ? (
                                                        sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="table-header-wrapper">
                                            <div onClick={() => handleSort("sbFee")} className="tableHeaderCell">
                                                <span>SimplyBiz Fee</span>
                                                {
                                                    columnToSort === "sbFee" ? (
                                                        sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="table-header-wrapper">
                                            <div onClick={() => handleSort("introducerFee")} className="tableHeaderCell">
                                                <span>Introducer Fee</span>
                                                {
                                                    columnToSort === "introducerFee" ? (
                                                        sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                </>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {closedCases.map((closedCase: App.ActivityDetail) => (
                            <TableRow key={closedCase._kissflow_id}>
                                {location.pathname.split("/")[1] === "marriage-bureau" && <TableCell><Link to={'/marriage-bureau/instance-details/' + closedCase._kissflow_id}>{closedCase.buyer} purchasing {closedCase.seller}</Link></TableCell>}
                                {location.pathname.split("/")[1] === "seller-onboarding" && <TableCell><Link to={'/seller-onboarding/instance-details/' + closedCase._kissflow_id}>{closedCase.firmName}</Link></TableCell>}
                                {location.pathname.split("/")[1] === "buyer-onboarding" && <TableCell><Link to={'/buyer-onboarding/instance-details/' + closedCase._kissflow_id}>{closedCase.firmName}</Link></TableCell>}
                                {location.pathname.split("/")[1] !== "marriage-bureau" && <TableCell align="center">{String(closedCase.isReEngage)}</TableCell>}
                                {location.pathname.split("/")[1] === "marriage-bureau" &&
                                    <>
                                        <TableCell align="center">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(closedCase.wealthHoldingsFee)}</TableCell>
                                        <TableCell align="center">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(closedCase.simplyBizFee)}</TableCell>
                                        <TableCell align="center">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(closedCase.introducerFee)}</TableCell>
                                    </>
                                }

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <div className="button-container">
                {location.pathname.split("/")[1] === "marriage-bureau" && <Button className="wh-button" variant="contained" onClick={() => marriageBureauExcelFunctions.generateClosedInstances(closedCases)}>Export</Button>}
                {location.pathname.split("/")[1] === "seller-onboarding" && <Button className="wh-button" variant="contained" onClick={() => sellerOnboardingExcelFunctions.generateClosedInstances(closedCases)}>Export</Button>}
                {location.pathname.split("/")[1] === "buyer-onboarding" && <Button className="wh-button" variant="contained" onClick={() => buyerOnboardingExcelFunctions.generateClosedInstances(closedCases)}>Export</Button>}
            </div>
        </div>
    )
}

export default ClosedInstances