import React, { useState, useRef } from 'react'
import "./latestActions.scss"
import { Table, TableBody, TableCell, TableHead, TableRow, Card, Button, CardActions, CardContent } from "@material-ui/core"
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'
import moment from 'moment'

interface InputProps {
    actions: App.ActivityDetail[]
    pathname: string
}

const LatestActions = (props: InputProps) => {

    const isCancelled = useRef(false)
    const [latestActions, setLatestActions] = useState<App.ActivityDetail[]>([])

    const filterLatestActions = () => {
        props.actions.sort((a, b) => new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime());
        setLatestActions(props.actions.slice(0, 5))
    }

    React.useEffect(() => {
        filterLatestActions();
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [props]);

    return (
        <div className="latest-actions">
            <h3>Latest Actions</h3>
            <Card>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <span> Activity</span>
                                </TableCell>
                                <TableCell>
                                    <span> Action</span>
                                </TableCell>
                                <TableCell>
                                    <span>Firm Name</span>
                                </TableCell>
                                <TableCell>
                                    <span className="hide-on-mobile">Actioned By</span>
                                </TableCell>
                                <TableCell className="hide-on-mobile">
                                    <span>Action Date</span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {latestActions.map((action: App.ActivityDetail) => (
                                <TableRow key={action._id}>
                                    <TableCell>{action._current_context[0].Name}</TableCell>
                                    <TableCell>{action.activityAction}</TableCell>
                                    {props.pathname === "marriage-bureau" ?
                                        <TableCell><Link to={'/marriage-bureau/instance-details/' + action._kissflow_id}>{action.firmName}</Link></TableCell> :
                                        <TableCell><Link to={'/buyer-onboarding/instance-details/' + action._kissflow_id}>{action.firmName}</Link></TableCell>
                                    }
                                    <TableCell className="hide-on-mobile">{action._last_action_performed_by.Name}</TableCell>
                                    <TableCell className="hide-on-mobile">{moment(action._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardActions>
                    {props.pathname === "marriage-bureau" && <Button component={Link} to="/marriage-bureau/action-log">Action Log <NavigateNextIcon /></Button>}
                    {props.pathname === "seller-onboarding" && <Button component={Link} to="/seller-onboarding/action-log">Action Log <NavigateNextIcon /></Button>}
                    {props.pathname === "buyer-onboarding" && <Button component={Link} to="/buyer-onboarding/action-log">Action Log <NavigateNextIcon /></Button>}
                </CardActions>
            </Card>
        </div>
    )
}

export default LatestActions