import React, { useState, useRef, useEffect } from 'react'
import './closedInstances.scss'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@material-ui/core"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { Link, useLocation } from 'react-router-dom'
// import useCommonFunctions from '../../hooks/useCommonFunctions'
import _ from "lodash"
import useMarriageBureauExcelFunctions from "../../hooks/useMarriageBureauExcelFunctions"
import useBuyerOnboardingExcelFunctions from "../../hooks/useBuyerOnboardingExcelFunctions"

const ClosedInstances = () => {

    const isCancelled = useRef(false)
    const marriageBureauApi = useFetch("marriage-bureau")
    const buyerOnboardingApi = useFetch("buyer-onboarding")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [closedCases, setClosedCases] = useState<App.ActivityDetail[]>([])
    const [columnToSort, setColumnToSort] = useState("firmName")
    const [sortDirection, setSortDirection] = useState("desc")
    const marriageBureauExcelFunctions = useMarriageBureauExcelFunctions();
    const buyerOnboardingExcelFunctions = useBuyerOnboardingExcelFunctions();

    let location = useLocation();

    const invertDirection = (currentDirection: string) => {
        if (currentDirection === "asc") {
            return "desc"
        } else if (currentDirection === "desc") {
            return "asc"
        }
    }

    const getMarriageBureauClosedCases = (): void => {
        setLoading(true)
        marriageBureauApi.get("getClosedCases")
            .then(data => {
                if (!isCancelled.current) {
                    setClosedCases(data.filter(result => result.isCloseCase))
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

    const getBuyerOnboardingClosedCases = (): void => {
        setLoading(true)
        buyerOnboardingApi.get("getClosedCases")
            .then(data => {
                if (!isCancelled.current) {
                    setClosedCases(data.filter(result => result.isCloseCase))
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
        if (location.pathname.split("/")[1] === "marriage-bureau"){
            getMarriageBureauClosedCases()
        }else if (location.pathname.split("/")[1] === "buyer-onboarding"){
            getBuyerOnboardingClosedCases();
        }
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {closedCases.map((closedCase: App.ActivityDetail) => (
                            <TableRow key={closedCase._kissflow_id}>
                                {/* <TableCell> <Link to={'/instance-details/' + closedCase._kissflow_id}>{closedCase.firmName}</Link></TableCell> */}
                                {location.pathname.split("/")[1] === "marriage-bureau" ?
                                    <TableCell> <Link to={'/marriage-bureau/instance-details/' + closedCase._kissflow_id}>{closedCase.firmName}</Link></TableCell> :
                                    <TableCell> <Link to={'/buyer-onboarding/instance-details/' + closedCase._kissflow_id}>{closedCase.firmName}</Link></TableCell>
                                }
                                <TableCell align="center">{String(closedCase.isReEngage)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <div className="button-container">
                {/* <Button className="wh-button" variant="contained" onClick={() => excelFunctions.generateClosedInstances(closedCases)}>Export</Button>  */}
                {location.pathname.split("/")[1] === "marriage-bureau" ?
                    <Button className="wh-button" variant="contained" onClick={() => marriageBureauExcelFunctions.generateClosedInstances(closedCases)}>Export</Button> :
                    <Button className="wh-button" variant="contained" onClick={() => buyerOnboardingExcelFunctions.generateClosedInstances(closedCases)}>Export</Button>
                }
            </div>
        </div>
    )
}

export default ClosedInstances