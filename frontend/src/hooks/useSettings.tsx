import { useEffect, useRef, useState } from "react";
import useFetch from "./useFetch"
import moment from 'moment'

const useSettings = () => {
    // const [settings, setSettings] = useState([]);
    const [buyerOnboardingSettings, setBuyerOnboardingSettings] = useState<App.Setting[]>([])
    const [marriageBureauSettings, setMarriageBureauSettings] = useState<App.Setting[]>([])
    const isCancelled = useRef(false)
    const settingsApi = useFetch("settings")
    // const [loading, setLoading] = useState<boolean>(false)
    // const [error, setError] = useState<string>("")

    const getSettings = async () => {
        console.log("getsettings")
        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    setBuyerOnboardingSettings(data.filter(result => result.process === "buyer-onboarding").sort((a, b) => a.orderNumber - b.orderNumber))
                    setMarriageBureauSettings(data.filter(result => result.process === "marriage-bureau").sort((a, b) => a.orderNumber - b.orderNumber))
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                }
            })
    }

    const saveSettings = async (settings) => {
        settingsApi.post(settings)
            .then((data) => {
                if (!isCancelled.current) {
                    return (data)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                }
            })
    }


    const calculateMarriageBureauActivitySummaries = async (activeCases: App.ActivityDetail[]) => {

        let activitySummaries: App.ActivitySummary[] = []

        console.log("go")

        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    console.log("should be showing data")
                    console.log(data)

                    data.filter(result => result.process === "marriage-bureau").sort((a, b) => a.orderNumber - b.orderNumber).forEach(setting => {
                        // console.log({setting})
                        activitySummaries.push({
                            name: setting.activityName,
                            link: "",
                            amberSla: setting.amberSla,
                            redSla: setting.redSla,
                            greenCount: 0,
                            amberCount: 0,
                            redCount: 0,
                            totalCount: 0
                        })
                    });

                    console.log(activitySummaries)

                    activeCases.forEach(activeCase => {
                        let isActivityNameFound = false
                        activitySummaries.forEach(activitySummary => {
                            if (activeCase._current_step === activitySummary.name) {
                                isActivityNameFound = true
                                activitySummary.totalCount++
                                if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                                    moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isAfter(moment())
                                ) {
                                    activitySummary.greenCount++
                                } else if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                                    moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isBefore(moment())
                                ) {
                                    activitySummary.amberCount++
                                } else {
                                    activitySummary.redCount++
                                }
                            }
                        });

                        if (!isActivityNameFound) {
                            console.log(`Activity name not found: ${activeCase._current_step}`)
                        }
                    });


                    return activitySummaries
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                }
            })
    }

    const calculateBuyerOnboardingActivitySummaries = (activeCases: App.ActivityDetail[]): App.ActivitySummary[] => {

        getSettings().then((data) => {
            console.log(data)
            console.log(buyerOnboardingSettings)
        })

        let activitySummaries: App.ActivitySummary[] = [
            { name: "Introductory Call", link: "buyer-onboarding/introductory-call", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Director Follow Up", link: "buyer-onboarding/director-follow-up", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Buyer Due Diligence", link: "buyer-onboarding/buyer-due-diligence", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Buyer's Pack", link: "buyer-onboarding/buyers-pack", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        ]

        activeCases.forEach(activeCase => {
            let isActivityNameFound = false
            activitySummaries.forEach(activitySummary => {
                if (activeCase._current_step === activitySummary.name) {
                    isActivityNameFound = true
                    activitySummary.totalCount++
                    if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                        moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isAfter(moment())
                    ) {
                        activitySummary.greenCount++
                    } else if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                        moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isBefore(moment())
                    ) {
                        activitySummary.amberCount++
                    } else {
                        activitySummary.redCount++
                    }
                }
            });

            if (!isActivityNameFound) {
                console.log(`Activity name not found: ${activeCase._current_step}`)
            }
        });

        return activitySummaries
    }

    useEffect(() => {
        getSettings()
        return () => {
            isCancelled.current = true;
        };
    }, []);

    return {
        buyerOnboardingSettings,
        setBuyerOnboardingSettings,
        marriageBureauSettings,
        setMarriageBureauSettings,
        saveSettings,
        getSettings,
        calculateMarriageBureauActivitySummaries,
        calculateBuyerOnboardingActivitySummaries
    }
}

export default useSettings;