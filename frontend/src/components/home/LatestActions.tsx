import React, { useState, useRef, useEffect } from 'react'
import "./latestActions.scss"
import { Table, TableBody, TableCell, TableHead, TableRow, Card, Button, CardActions, CardContent} from "@material-ui/core"
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'
import moment from 'moment'

interface InputProps {
    activeCases: App.ActiveCase[]
}

const LatestActions = (props: InputProps) => {

    const isCancelled = useRef(false)
    const [latestActiveCases, setLatestActiveCases] = useState<App.ActiveCase[]>([])

    const filterLatestActivities = () => {
        props.activeCases.sort((a,b)=>new Date(b._last_action_performed_at).getTime() - new Date(a._last_action_performed_at).getTime());
        setLatestActiveCases(props.activeCases.slice(0,5))
    }

    React.useEffect(() => {
        filterLatestActivities();
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    return (
        <div className="latest-activities">
            <h3>Latest Actions</h3>
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
                        {latestActiveCases.map((activeCase: App.ActiveCase) => (
                            <TableRow key={activeCase._id}>
                                <TableCell>{activeCase.previousStep.Name}</TableCell>
                                <TableCell><Link to={'/instance-details/' + activeCase._id}>{activeCase.firmName}</Link></TableCell>
                                <TableCell>{activeCase.assignedBdm.Name}</TableCell>
                                <TableCell>{moment(activeCase._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
                <CardActions>
                    <Button component={Link} to="/action-log">Action Log <NavigateNextIcon /></Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default LatestActions