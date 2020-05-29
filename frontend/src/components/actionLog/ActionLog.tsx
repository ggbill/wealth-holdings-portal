import React, { useState, useRef } from 'react'
import useFetch from "../../hooks/useFetch"
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Card, Button, CardActions, CardContent, TablePagination } from "@material-ui/core"
import "./actionLog.scss"
import moment from 'moment'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Loading from '../shared/Loading'

const ActionLog = () => {

    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeCases, setActiveCases] = useState<App.ActiveCase[]>([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const getLatestDataForActiveCases = (): void => {
        setLoading(true)
        kissflowApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    setActiveCases(data.sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    React.useEffect(() => {
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
        <div className="action-log">
            <h2>Action Log</h2>
            <Card>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <span>Completed Activity</span>
                                </TableCell>
                                <TableCell>
                                    <span>Firm Name</span>
                                </TableCell>
                                <TableCell>
                                    <span>Assigned BDM</span>
                                </TableCell>
                                <TableCell>
                                    <span>Completed Date</span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((activeCase: App.ActiveCase) => (
                                <TableRow key={activeCase._id}>
                                    <TableCell>{activeCase.previousStep.Name}</TableCell>
                                    <TableCell><Link to={'/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>
                                    <TableCell>{activeCase.assignedBdm.Name}</TableCell>
                                    <TableCell>{moment(activeCase._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={activeCases.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ActionLog