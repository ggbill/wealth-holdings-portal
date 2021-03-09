import React, { useState, useRef } from 'react'
import useFetch from "../../hooks/useFetch"
import { Link, useLocation } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Card, Button, CardContent, TablePagination, FormControlLabel, Switch } from "@material-ui/core"
import "./actionLog.scss"
import moment from 'moment'
import Loading from '../shared/Loading'
import useMarriageBureauExcelFunctions from "../../hooks/useMarriageBureauExcelFunctions"
import useBuyerOnboardingExcelFunctions from "../../hooks/useBuyerOnboardingExcelFunctions"
import useSellerOnboardingExcelFunctions from "../../hooks/useSellerOnboardingExcelFunctions"

const ActionLog = () => {

    const isCancelled = useRef(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [actions, setActions] = useState<App.ActivityDetail[]>([])
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const marriageBureauExcelFunctions = useMarriageBureauExcelFunctions()
    const buyerOnboardingExcelFunctions = useBuyerOnboardingExcelFunctions()
    const sellerOnboardingExcelFunctions = useSellerOnboardingExcelFunctions()
    const [isSimplyBizFilter, setIsSimplyBizFilter] = useState<boolean>(false)

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

    const getActions = (): void => {
        setLoading(true)
        processApi.get("getActions")
            .then(data => {
                if (!isCancelled.current) {
                    if (isSimplyBizFilter) {
                        if (location.pathname.split("/")[1] === "marriage-bureau") {
                            setActions(data.filter((activeCase) =>
                                activeCase.isSimplyBizDeal === true
                            ).sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
                        } else {
                            setActions(data.filter((activeCase) =>
                                (activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true")
                            ).sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
                        }
                    } else {
                        setActions(data.sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime()))
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    React.useEffect(() => {
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    React.useEffect(() => {
        getActions()
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
        <div className="action-log">

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

            

            <Card>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <span>Activity</span>
                                </TableCell>
                                <TableCell>
                                    <span>Action</span>
                                </TableCell>
                                <TableCell>
                                    <span>Instance Name</span>
                                </TableCell>
                                <TableCell className="hide-on-mobile">
                                    <span>Actioned By</span>
                                </TableCell>
                                <TableCell className="hide-on-mobile">
                                    <span>Action Date</span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((action: App.ActivityDetail) => (
                                <TableRow key={action._id}>
                                    <TableCell>{action._current_context[0].Name}</TableCell>
                                    {action._current_context[0].Name === "Complete" ?
                                        <TableCell>{action.completeActivityAction}</TableCell> : <TableCell>{action.activityAction}</TableCell>}
                                    {location.pathname.split("/")[1] === "marriage-bureau" && <TableCell><Link to={'/marriage-bureau/instance-details/' + action._kissflow_id}>{action.buyer} purchasing {action.seller}</Link></TableCell>}
                                    {location.pathname.split("/")[1] === "seller-onboarding" && <TableCell><Link to={'/seller-onboarding/instance-details/' + action._kissflow_id}>{action.firmName}</Link></TableCell>}
                                    {location.pathname.split("/")[1] === "buyer-onboarding" && <TableCell><Link to={'/buyer-onboarding/instance-details/' + action._kissflow_id}>{action.firmName}</Link></TableCell>}
                                    <TableCell className="hide-on-mobile">{action._last_action_performed_by.Name}</TableCell>
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

            <div className="button-container">
                {location.pathname.split("/")[1] === "marriage-bureau" && <Button className="wh-button" variant="contained" onClick={() => marriageBureauExcelFunctions.generateActionLog(actions)}>Export</Button>}
                {location.pathname.split("/")[1] === "seller-onboarding" && <Button className="wh-button" variant="contained" onClick={() => sellerOnboardingExcelFunctions.generateActionLog(actions)}>Export</Button>}
                {location.pathname.split("/")[1] === "buyer-onboarding" && <Button className="wh-button" variant="contained" onClick={() => buyerOnboardingExcelFunctions.generateActionLog(actions)}>Export</Button>}
            </div>
        </div>
    )
}

export default ActionLog