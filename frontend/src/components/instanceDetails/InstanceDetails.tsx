import React, { useState, useRef, useEffect } from 'react'
import "./instanceDetails.scss"
import useFetch from "../../hooks/useFetch"
import { TextField, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core"
import moment from 'moment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


const InstanceDetails = ({ match }) => {

    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [instanceDetails, setInstanceDetails] = useState<App.ActivityDetail[]>([])
    const [lastestActivityDetail, setLatestActivityDetail] = useState<App.ActivityDetail>(Object)

    const getInstanceDetails = (): void => {
        setLoading(true)
        kissflowApi.get(`getInstanceDetails/${match.params.id}`)
            .then(data => {
                if (!isCancelled.current) {
                    setInstanceDetails(data)
                    setLatestActivityDetail(data[data.length - 1])
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    setError(err.message)
                }
            })
    }

    const isShowOfferDetails = (activityName): boolean => {
        if (
            activityName === "Heads of Terms" ||
            activityName === "Detailed Due Diligence" ||
            activityName === "Formal Offer" ||
            activityName === "Transaction Agreement" ||
            activityName === "Final Fee Payment"
        ) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        getInstanceDetails();

        return () => {
            isCancelled.current = true;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    return (
        <div className="instance-details">
            <Link className="clickable-icon" to={'/all-instances'}>
                <ArrowBackIosIcon />
                <span>Back to list</span>
            </Link>
            <h1>Instance Details</h1>
            <h2>Overview</h2>
            {lastestActivityDetail &&
                <div className="summary-details-wrapper">

                    <TextField
                        id="firmName"
                        label="Firm Name"
                        value={lastestActivityDetail.firmName || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                    <TextField
                        id="companyType"
                        label="Company Type"
                        value={lastestActivityDetail.companyType || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                    <TextField
                        id="SimplyBizMember"
                        label="SimplyBiz Member Firm"
                        value={lastestActivityDetail.isSimplyBizMember || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                    <TextField
                        id="processId"
                        label="Process ID"
                        value={lastestActivityDetail._kissflow_id || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                    {lastestActivityDetail._current_assigned_to &&
                        <TextField
                            id="assignedBdm"
                            label="Assigned BDM"
                            value={lastestActivityDetail._current_assigned_to[0].Name || ''}
                            InputProps={{
                                disabled: true
                            }}
                        />
                    }
                    <TextField
                        id="createdAt"
                        label="Enquiry Logged"
                        value={moment(lastestActivityDetail._created_at).format("HH:mm DD/MM/YYYY") || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                    <TextField
                        id="enquirySource"
                        label="Enquiry Source"
                        value={lastestActivityDetail.enquirySource || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                    <TextField
                        id="enquiryMethod"
                        label="Enquiry Method"
                        value={lastestActivityDetail.enquiryMethod || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                </div>
            }

            {/* <p>{JSON.stringify(lastestActivityDetail)}</p> */}
            <h2>Instance History</h2>
            {instanceDetails.map((activityDetail: App.ActivityDetail) => (
                <>
                    {activityDetail._current_context[0].Name !== "Start" &&
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <span className="panel-header-activity-name">{activityDetail._current_context[0].Name}</span>
                                {/* <span className="panel-header-activity-name">{activityDetail._current_step}</span> */}
                                <span className="panel-header-completed-label">Completed:</span>
                                <span className="panel-header-completed-date">{moment(activityDetail._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</span>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                {/* <p>{JSON.stringify(activityDetail)}</p> */}
                                <div className="data-section">
                                    <h4>Selling Firm Contact Details</h4>
                                    <TextField
                                        id="primaryContact"
                                        label="Primary Contact"
                                        value={activityDetail.primaryContact || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                    <TextField
                                        id="preferredEmail"
                                        label="Preferred Email"
                                        value={activityDetail.preferredEmail || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                    <TextField
                                        id="preferredPhone"
                                        label="Preferred Phone"
                                        value={activityDetail.preferredPhone || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                </div>
                                <div className="data-section">
                                    <h4>Selling Firm Key Metrics</h4>
                                    <TextField
                                        id="aum"
                                        label="AUM"
                                        value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.aum) || ''}
                                        InputProps={{
                                            disabled: true,

                                        }}
                                    />
                                    <TextField
                                        id="recurringFees"
                                        label="Recurring Fees"
                                        value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.recurringFees) || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                    <TextField
                                        id="turnover"
                                        label="Turnover"
                                        value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.turnover) || ''}
                                        InputProps={{
                                            disabled: true
                                        }}

                                    />
                                    <TextField
                                        id="ebitda"
                                        label="EBITDA"
                                        value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.ebitda) || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                    <TextField
                                        id="planners"
                                        label="Planners"
                                        value={new Intl.NumberFormat().format(activityDetail.planners) || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                    <TextField
                                        id="customers"
                                        label="Customers"
                                        value={new Intl.NumberFormat().format(activityDetail.customers) || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                    <TextField
                                        id="clients"
                                        label="Clients"
                                        value={new Intl.NumberFormat().format(activityDetail.clients) || ''}
                                        InputProps={{
                                            disabled: true
                                        }}
                                    />
                                </div>
                                {isShowOfferDetails(activityDetail._current_step) &&
                                    <div className="data-section">
                                        <h4>Offer Details</h4>
                                        <TextField
                                            id="host"
                                            label="Purchasing Host"
                                            value={activityDetail.purchasingHub || ''}
                                            InputProps={{
                                                disabled: true
                                            }}
                                        />
                                        <TextField
                                            id="valuation"
                                            label="Valuation"
                                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.valuation) || ''}
                                            InputProps={{
                                                disabled: true
                                            }}
                                        />
                                        <TextField
                                            id="fee"
                                            label="Wealth Holdings Fee"
                                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.wealthHoldingsFee) || ''}
                                            InputProps={{
                                                disabled: true
                                            }}
                                        />
                                        <TextField
                                            id="completionDate"
                                            label="Completion Date"
                                            value={moment(lastestActivityDetail.completionDate).format("HH:mm DD/MM/YYYY") || ''}
                                            InputProps={{
                                                disabled: true
                                            }}
                                        />
                                        <TextField
                                            id="purchaseType"
                                            label="Purchase Type"
                                            value={activityDetail.purchaseType || ''}
                                            InputProps={{
                                                disabled: true
                                            }}
                                        />
                                    </div>
                                }
                                {isShowOfferDetails(activityDetail._current_step) &&
                                    <div className="data-section">
                                        <h4>Payment Schedule</h4>
                                        <Paper>
                                            <Table className="payment-schedule-table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <span>Months Post Completion</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span>Amount</span>
                                                        </TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {activityDetail.paymentSchedule.map((paymentStep, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{new Intl.NumberFormat().format(paymentStep.Months_Post_Completion)}</TableCell>
                                                            {paymentStep.Payment &&
                                                                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(paymentStep.Payment.split(" ")[0])}</TableCell>
                                                            }
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </div>
                                }
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    }
                </>
            ))}
        </div>
    )
}

export default InstanceDetails