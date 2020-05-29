import React, { useState, useRef } from 'react'
import './closedInstances.scss'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import SummaryFigures from '../instanceList/SummaryFigures'
import { Table, TableBody, TableCell, TableHead, TableRow, Paper} from "@material-ui/core"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import CloseIcon from '@material-ui/icons/Close'
import { Link } from 'react-router-dom'
import RagIndicator from '../shared/RagIndicator'
import useCommonFunctions from '../../hooks/useCommonFunctions'
import moment from 'moment'



const ClosedInstances = () => {

    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [closedCases, setClosedCases] = useState<App.ActiveCase[]>([])
    const [columnToSort, setColumnToSort] = useState("_created_at")
    const [sortDirection, setSortDirection] = useState("desc")
    const commonFunctions = useCommonFunctions()

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
                    setClosedCases(data.filter(result => result.closeCase))
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


    React.useEffect(() => {
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
            <h1>Closed Instances</h1>

            <SummaryFigures
                activeCases={closedCases}
            />

            <h2>Firms</h2>
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
                                    <div onClick={() => handleSort("reEngage")} className="tableHeaderCell">
                                        <span>Re-Engage In Future?</span>
                                        {
                                            columnToSort === "_current_step" ? (
                                                sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                            ) : null
                                        }
                                    </div>                                    
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {closedCases.map((closedCase: App.ActiveCase) => (
                            <TableRow key={closedCase._id}>
                                <TableCell> <Link to={'/instance-details/' + closedCase._id}>{closedCase.firmName}</Link></TableCell>
                                <TableCell align="center">{String(closedCase.isReEngage)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div >
    )
}

export default ClosedInstances