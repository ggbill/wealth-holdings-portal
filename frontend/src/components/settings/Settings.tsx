import React, { useState, useRef } from 'react'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import "./settings.scss"
import { Card, CardContent, TextField, Button } from '@material-ui/core'

const Settings = () => {

    const isCancelled = useRef(false)
    const settingsApi = useFetch("settings")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const [buyerOnboardingSettings, setBuyerOnboardingSettings] = useState<App.Setting[]>([])
    const [marriageBureauSettings, setMarriageBureauSettings] = useState<App.Setting[]>([])


    const getSettings = (): void => {
        setLoading(true)
        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    console.log(data)
                    setBuyerOnboardingSettings(data.filter(result => result.process === "buyer-onboarding").sort((a, b) => a.orderNumber - b.orderNumber))
                    setMarriageBureauSettings(data.filter(result => result.process === "marriage-bureau").sort((a, b) => a.orderNumber - b.orderNumber))
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

    const saveSettings = (): void => {

        let isAllValuesComplete = true

        marriageBureauSettings.concat(buyerOnboardingSettings).forEach(element => {
            // console.log(`${element.activityName} amberSLA: ${element.amberSla}`)
            if (String(element.amberSla) === "" || String(element.redSla) === "" || String(element.amberSla) === "0" || String(element.redSla) === "0") {
                // console.log("**************Plese ensure all values are complete")
                isAllValuesComplete = false
            }
        });

        if (isAllValuesComplete) {
            setLoading(true)
            settingsApi.post(marriageBureauSettings.concat(buyerOnboardingSettings))
                .then((data) => {
                    if (!isCancelled.current) {
                        console.log(data)
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
    }



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
        } else {
            console.log("unknown process")
        }




        // setSeason({ ...season, [name]: value } as ComponentState)
    }

    React.useEffect(() => {
        getSettings()

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
        <div className="settings">
            <h2>Buyer Onboarding Settings</h2>
            {buyerOnboardingSettings.map((setting, index) => (
                <Card key={setting._id}>
                    <CardContent>
                        <span className="activity-name">{setting.activityName}</span>
                        <div className="sla-wrapper">
                            <TextField
                                id={`${setting._id} - amber`}
                                name="amberSla"
                                label="Amber SLA"
                                value={setting.amberSla}
                                onChange={event => handleChange("buyer-onboarding", event, index)}
                            />
                            <TextField
                                id={`${setting._id} - red`}
                                name="redSla"
                                label="Red SLA"
                                value={setting.redSla}
                                onChange={event => handleChange("buyer-onboarding", event, index)}
                            />
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
                            <TextField
                                id={`${setting._id} - amber`}
                                name="amberSla"
                                label="Amber SLA"
                                value={setting.amberSla}
                                onChange={event => handleChange("marriage-bureau", event, index)}
                            />
                            <TextField
                                id={`${setting._id} - red`}
                                name="redSla"
                                label="Red SLA"
                                value={setting.redSla}
                                onChange={event => handleChange("marriage-bureau", event, index)}
                            />
                        </div>

                    </CardContent>
                </Card>
            ))}
            <div className="button-container">
                <Button className="wh-button" variant="contained" onClick={() => saveSettings()}>Save</Button>
            </div>
        </div>
    )
}

export default Settings