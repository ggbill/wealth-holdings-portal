import React, { useState, useRef, useEffect } from 'react'
import "./instanceDetails.scss"
import useFetch from "../../hooks/useFetch"
import { TextField, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@material-ui/core"
import moment from 'moment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useMarriageBureauExcelFunctions from "../../hooks/useMarriageBureauExcelFunctions"
import useBuyerOnboardingExcelFunctions from "../../hooks/useBuyerOnboardingExcelFunctions"
import useSellerOnboardingExcelFunctions from "../../hooks/useSellerOnboardingExcelFunctions"
import Loading from '../shared/Loading'
import { useLocation } from 'react-router-dom'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

const InstanceDetails = ({ match }) => {

    const isCancelled = useRef(false)
    const marriageBureauApi = useFetch("marriage-bureau")
    const buyerOnboardingApi = useFetch("buyer-onboarding")
    const sellerOnboardingApi = useFetch("seller-onboarding")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [instanceDetails, setInstanceDetails] = useState<App.ActivityDetail[]>([])
    const [lastestActivityDetail, setLatestActivityDetail] = useState<App.ActivityDetail>(Object)

    const marriageBureauExcelFunctions = useMarriageBureauExcelFunctions();
    const buyerOnboardingExcelFunctions = useBuyerOnboardingExcelFunctions();
    const sellerOnboardingExcelFunctions = useSellerOnboardingExcelFunctions();
    let location = useLocation();

    const getMarriageBureauInstanceDetails = (): void => {
        setLoading(true)
        marriageBureauApi.get(`getInstanceDetails/${match.params.id}`)
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

    const getBuyerOnboardingInstanceDetails = (): void => {
        setLoading(true)
        buyerOnboardingApi.get(`getInstanceDetails/${match.params.id}`)
            .then(data => {
                if (!isCancelled.current) {
                    // console.log(data)
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

    const getSellerOnboardingInstanceDetails = (): void => {
        setLoading(true)
        sellerOnboardingApi.get(`getInstanceDetails/${match.params.id}`)
            .then(data => {
                if (!isCancelled.current) {
                    // console.log(data)
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

    useEffect(() => {
        if (location.pathname.split("/")[1] === "marriage-bureau") {
            getMarriageBureauInstanceDetails()
        } else if (location.pathname.split("/")[1] === "buyer-onboarding") {
            getBuyerOnboardingInstanceDetails()
        } else if (location.pathname.split("/")[1] === "seller-onboarding") {
            getSellerOnboardingInstanceDetails()
        } else {
            setError("Unknown url")
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
        <div className="instance-details">
            <h2>Overview</h2>
            {lastestActivityDetail && location.pathname.split("/")[1] !== "marriage-bureau" &&
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
                        id="fcaNumber"
                        label="FCA Number"
                        value={lastestActivityDetail.fcaNumber || ''}
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
                        value={String(lastestActivityDetail.isSimplyBizMember) || ''}
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
                    <TextField
                        id="officeLocation"
                        label="Office Location"
                        value={lastestActivityDetail.officeLocation || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                </div>
            }

            {lastestActivityDetail && location.pathname.split("/")[1] === "marriage-bureau" &&
                <div className="summary-details-wrapper">
                    <TextField
                        id="buyer"
                        label="Buyer"
                        value={lastestActivityDetail.buyer || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                    <TextField
                        id="seller"
                        label="Seller"
                        value={lastestActivityDetail.seller || ''}
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
                    <TextField
                        id="createdAt"
                        label="Enquiry Logged"
                        value={moment(lastestActivityDetail._created_at).format("HH:mm DD/MM/YYYY") || ''}
                        InputProps={{
                            disabled: true
                        }}
                    />
                </div>
            }

            {lastestActivityDetail.currentStatus && <div className="summary-details-wrapper">
                <TextField
                    id="currentStatus"
                    className="current-status"
                    label="Current Status"
                    value={lastestActivityDetail.currentStatus || ''}
                    multiline
                    InputProps={{
                        disabled: true
                    }}
                />
            </div>}



            {/* <p>{JSON.stringify(instanceDetails)}</p> */}
            {(instanceDetails.length > 1) && <>
                <h2>Instance History</h2>
                {instanceDetails.map((activityDetail: App.ActivityDetail) => (
                    <>
                        {/* {activityDetail._current_context[0].Name !== "Start" && */}
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    {/* If showing complete step then look for the completeActivityAction rather than activityAction */}
                                    {activityDetail._current_context[0].Name === "Complete" ?
                                        <div className="activity-name-wrapper">
                                            {activityDetail.completeActivityAction === "Close Case" && <HighlightOffIcon className="red" />}
                                            {activityDetail.completeActivityAction === "Save & Publish" && <SaveAltIcon className="blue" />}
                                            <span className="panel-header-activity-name">{activityDetail._current_context[0].Name}</span>
                                        </div>
                                        :
                                        <div className="activity-name-wrapper">
                                            {activityDetail.activityAction === "Complete Activity" && <CheckCircleOutlineIcon className="green" />}
                                            {!activityDetail.activityAction && <CheckCircleOutlineIcon className="green" />}
                                            {activityDetail.activityAction === "Close Case" && <HighlightOffIcon className="red" />}
                                            {activityDetail.activityAction === "Save & Publish" && <SaveAltIcon className="blue" />}
                                            <span className="panel-header-activity-name">{activityDetail._current_context[0].Name}</span>
                                        </div>

                                    }
                                    <div className="desktop-action-summary-wrapper">
                                        <span className="panel-header-completed-label">Action:</span>
                                        {activityDetail._current_context[0].Name === "Complete" ?
                                            <span className="panel-header-completed-value">{activityDetail.completeActivityAction}</span> :
                                            !activityDetail.activityAction ? <span className="panel-header-completed-value">Complete Activity</span> : <span className="panel-header-completed-value">{activityDetail.activityAction}</span>
                                        }
                                        <span className="panel-header-completed-label">Completed By:</span>
                                        <span className="panel-header-completed-value">{activityDetail._last_action_performed_by.Name}</span>
                                        <span className="panel-header-completed-label">Completed Date:</span>
                                        <span className="panel-header-completed-value">{moment(activityDetail._last_action_performed_at).format("HH:mm DD/MM/YYYY")}</span>
                                    </div>

                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {activityDetail.activityAction !== "Close Case" &&
                                        <>
                                            <div className="completion-details">
                                                <div className="data-section">
                                                    <TextField
                                                        id="action"
                                                        label="Action"
                                                        value={activityDetail.activityAction || ''}
                                                        InputProps={{
                                                            disabled: true
                                                        }}
                                                    />
                                                    <TextField
                                                        id="completedBy"
                                                        label="Completed By"
                                                        value={activityDetail._last_action_performed_by.Name || ''}
                                                        InputProps={{
                                                            disabled: true
                                                        }}
                                                    />
                                                    <TextField
                                                        id="completedDate"
                                                        label="Completed Date"
                                                        value={moment(activityDetail._last_action_performed_at).format("HH:mm DD/MM/YYYY") || ''}
                                                        InputProps={{
                                                            disabled: true
                                                        }}
                                                    />
                                                </div>
                                            </div>





                                            {location.pathname.split("/")[1] !== "marriage-bureau" &&
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
                                            }

                                            <div className="data-section">
                                                <TextField
                                                    id="currentStatus"
                                                    className="current-status"
                                                    label="Current Status"
                                                    value={activityDetail.currentStatus || ''}
                                                    multiline
                                                    InputProps={{
                                                        disabled: true
                                                    }}
                                                />
                                            </div>

                                            {location.pathname.split("/")[1] === "marriage-bureau" &&
                                                <>
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
                                                    <div className="data-section">
                                                        <h4>Offer Details</h4>
                                                        <TextField
                                                            id="valuation"
                                                            label="Valuation"
                                                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.valuation) || ''}
                                                            InputProps={{
                                                                disabled: true
                                                            }}
                                                        />
                                                        <TextField
                                                            id="whFee"
                                                            label="Wealth Holdings Fee"
                                                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.wealthHoldingsFee) || ''}
                                                            InputProps={{
                                                                disabled: true
                                                            }}
                                                        />
                                                        <TextField
                                                            id="sbFee"
                                                            label="SimplyBiz Fee"
                                                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.simplyBizFee) || ''}
                                                            InputProps={{
                                                                disabled: true
                                                            }}
                                                        />
                                                        <TextField
                                                            id="introducerFee"
                                                            label="Introducer Fee"
                                                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(activityDetail.introducerFee) || ''}
                                                            InputProps={{
                                                                disabled: true
                                                            }}
                                                        />
                                                        <TextField
                                                            id="completionDate"
                                                            label="Completion Date"
                                                            value={moment(lastestActivityDetail.completionDate).format("DD/MM/YYYY") || ''}
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
                                                </>
                                            }
                                        </>
                                    }
                                    {activityDetail.activityAction === "Close Case" &&
                                        <>
                                            <div className="data-section">
                                                <TextField
                                                    id="reason"
                                                    label="Reason"
                                                    value={activityDetail.closeCaseReason || ''}
                                                    InputProps={{
                                                        disabled: true
                                                    }}
                                                    className="full-width"
                                                />
                                                <TextField
                                                    id="description"
                                                    label="Description"
                                                    value={activityDetail.closeCaseDescription || ''}
                                                    InputProps={{
                                                        disabled: true
                                                    }}
                                                    className="full-width"
                                                />
                                                <TextField
                                                    id="isReEngage"
                                                    label="Re-Engage in Future?"
                                                    value={String(activityDetail.isReEngage) || ''}
                                                    InputProps={{
                                                        disabled: true
                                                    }}
                                                />
                                                <TextField
                                                    id="reEngageDate"
                                                    label="Re-engage Date Date"
                                                    value={moment(activityDetail.reEngageDate).format("DD/MM/YYYY") || ''}
                                                    InputProps={{
                                                        disabled: true
                                                    }}
                                                />
                                            </div>
                                        </>
                                    }
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        {/* } */}
                    </>
                ))}
            </>}
            <div className="button-container">
                {location.pathname.split("/")[1] === "marriage-bureau" && <Button className="wh-button" variant="contained" onClick={() => marriageBureauExcelFunctions.generateInstanceDetails(instanceDetails)}>Export</Button>}
                {location.pathname.split("/")[1] === "seller-onboarding" && <Button className="wh-button" variant="contained" onClick={() => sellerOnboardingExcelFunctions.generateInstanceDetails(instanceDetails)}>Export</Button>}
                {location.pathname.split("/")[1] === "buyer-onboarding" && <Button className="wh-button" variant="contained" onClick={() => buyerOnboardingExcelFunctions.generateInstanceDetails(instanceDetails)}>Export</Button>}
            </div>
        </div>
    )
}

export default InstanceDetails