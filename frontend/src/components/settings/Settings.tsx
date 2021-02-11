import React, { useState } from 'react'
import "./settings.scss"
import { Card, CardContent, TextField, Button } from '@material-ui/core'
import NotificationDialog from '../shared/NotificationDialog'
import RagIndicator from '../shared/RagIndicator'
import useSettings from '../../hooks/useSettings'

const Settings = () => {

    const { buyerOnboardingSettings, setBuyerOnboardingSettings, sellerOnboardingSettings, setSellerOnboardingSettings, marriageBureauSettings, setMarriageBureauSettings, saveSettings } = useSettings()
    const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState<boolean>(false)
    const [dialogType, setDialogType] = useState<string>("")
    const [dialogTitle, setDialogTitle] = useState<string>("")
    const [dialogBody, setDialogBody] = useState<string>("")

    const checkAndSaveSettings = (): void => {

        let isAllValuesComplete = true

        marriageBureauSettings.concat(buyerOnboardingSettings).concat(sellerOnboardingSettings).forEach(element => {
            if (String(element.amberSla) === "" || String(element.redSla) === "" || String(element.amberSla) === "0" || String(element.redSla) === "0") {
                handleErrorDialogOpen("Values Not Complete", "Please ensure all values are complete and greater than 0.")
                isAllValuesComplete = false
            }
        });

        if (isAllValuesComplete) {
            saveSettings(marriageBureauSettings.concat(buyerOnboardingSettings).concat(sellerOnboardingSettings)).then((data) => {
                handleSuccessDialogOpen("Save Complete", "The new settings were saved successfully.")
            }).catch((err: Error) => {
                // setError(err.message)
                handleErrorDialogOpen("Error Saving", err.message)
            })
        }
    }

    const handleErrorDialogOpen = (title: string, body: string) => {
        setDialogType("error")
        setIsNotificationDialogOpen(true)
        setDialogTitle(title)
        setDialogBody(body)
    };

    const handleSuccessDialogOpen = (title: string, body: string) => {
        setDialogType("success")
        setIsNotificationDialogOpen(true)
        setDialogTitle(title)
        setDialogBody(body)
    };

    const handleNotificationDialogClose = () => {
        setIsNotificationDialogOpen(false)
    };

    const handleChange = (process, event, index) => {
        const { name, value } = event.target

        if (process === "buyer-onboarding") {
            const old = buyerOnboardingSettings[index];
            const updated = { ...old, [name]: value }
            const clone = [...buyerOnboardingSettings];
            clone[index] = updated;
            setBuyerOnboardingSettings(clone);
        } else if (process === "marriage-bureau") {
            const old = marriageBureauSettings[index];
            const updated = { ...old, [name]: value }
            const clone = [...marriageBureauSettings];
            clone[index] = updated;
            setMarriageBureauSettings(clone);
        } else if (process === "seller-onboarding") {
            const old = sellerOnboardingSettings[index];
            const updated = { ...old, [name]: value }
            const clone = [...sellerOnboardingSettings];
            clone[index] = updated;
            setSellerOnboardingSettings(clone);
        } else {
            console.log("unknown process")
        }
    }

    return (
        <div className="settings">
            <h2>Buyer Onboarding Settings</h2>
            {buyerOnboardingSettings.map((setting, index) => (
                <Card key={setting._id}>
                    <CardContent>
                        <span className="activity-name">{setting.activityName}</span>
                        <div className="sla-wrapper">
                            <div className="amber-wrapper">
                                <RagIndicator ragStatus="Amber" widthPx={45} />
                                <TextField
                                    id={`${setting._id} - amber`}
                                    name="amberSla"
                                    type="number"
                                    label="Amber SLA Threshold"
                                    value={setting.amberSla}
                                    onChange={event => handleChange("buyer-onboarding", event, index)}
                                    helperText="days"
                                />
                            </div>
                            <div className="amber-wrapper">
                                <RagIndicator ragStatus="Red" widthPx={45} />
                                <TextField
                                    id={`${setting._id} - red`}
                                    name="redSla"
                                    type="number"
                                    label="Red SLA Threshold"
                                    value={setting.redSla}
                                    onChange={event => handleChange("buyer-onboarding", event, index)}
                                    helperText="days"
                                />
                            </div>
                        </div>

                    </CardContent>
                </Card>
            ))}

            <h2>Seller Onboarding Settings</h2>
            {sellerOnboardingSettings.map((setting, index) => (
                <Card key={setting._id}>
                    <CardContent>
                        <span className="activity-name">{setting.activityName}</span>
                        <div className="sla-wrapper">
                            <div className="amber-wrapper">
                                <RagIndicator ragStatus="Amber" widthPx={45} />
                                <TextField
                                    id={`${setting._id} - amber`}
                                    name="amberSla"
                                    type="number"
                                    label="Amber SLA Threshold"
                                    value={setting.amberSla}
                                    onChange={event => handleChange("seller-onboarding", event, index)}
                                    helperText="days"
                                />
                            </div>
                            <div className="amber-wrapper">
                                <RagIndicator ragStatus="Red" widthPx={45} />
                                <TextField
                                    id={`${setting._id} - red`}
                                    name="redSla"
                                    type="number"
                                    label="Red SLA Threshold"
                                    value={setting.redSla}
                                    onChange={event => handleChange("seller-onboarding", event, index)}
                                    helperText="days"
                                />
                            </div>
                        </div>

                    </CardContent>
                </Card>
            ))}

            <h2>Marriage Bureau Settings</h2>
            {marriageBureauSettings.map((setting, index) => (
                <Card key={setting._id}>
                    <CardContent>
                        <span className="activity-name">{setting.activityName}</span>
                        <div className="sla-wrapper">
                            <div className="amber-wrapper">
                                <RagIndicator ragStatus="Amber" widthPx={45} />
                                <TextField
                                    id={`${setting._id} - amber`}
                                    name="amberSla"
                                    type="number"
                                    label="Amber SLA Threshold"
                                    value={setting.amberSla}
                                    onChange={event => handleChange("marriage-bureau", event, index)}
                                    helperText="days"
                                />
                            </div>

                            <div className="red-wrapper">
                                <RagIndicator ragStatus="Red" widthPx={45} />
                                <TextField
                                    id={`${setting._id} - red`}
                                    name="redSla"
                                    type="number"
                                    label="Red SLA Threshold"
                                    value={setting.redSla}
                                    onChange={event => handleChange("marriage-bureau", event, index)}
                                    helperText="days"
                                />
                            </div>
                        </div>

                    </CardContent>
                </Card>
            ))}
            <div className="button-container">
                <Button className="wh-button" variant="contained" onClick={() => checkAndSaveSettings()}>Save</Button>
            </div>

            <NotificationDialog
                isDialogOpen={isNotificationDialogOpen}
                handleClose={handleNotificationDialogClose}
                type={dialogType}
                title={dialogTitle}
                body={dialogBody}
            />
        </div>
    )
}

export default Settings