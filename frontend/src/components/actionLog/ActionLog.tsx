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
    const [actions, setActions] = useState<App.ActivityDetail[]>([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const getActions = (): void => {
        setLoading(true)
        kissflowApi.get("getActions")
            .then(data => {
                if (!isCancelled.current) {
                    setActions(data.sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
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
        getActions();
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
                                <TableCell className="hide-on-mobile">
                                    <span>Completed Date</span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((action: App.ActivityDetail) => (
                                <TableRow key={action._id}>
                                    <TableCell>{action._current_context[0].Name}</TableCell>
                                    <TableCell><Link to={'/instance-details/' + action._kissflow_id}>{action.firmName}</Link></TableCell>
                                    <TableCell>{action._last_action_performed_by.Name}</TableCell>
                                    <TableCell className="hide-on-mobile">{moment(action._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={actions.length}
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