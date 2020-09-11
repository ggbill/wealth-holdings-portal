import moment from 'moment'

const useCommonFunctions = () => {

    const calculateMarriageBureauActivitySummaries = (activeCases: App.ActivityDetail[]): App.ActivitySummary[] => {

        let activitySummaries: App.ActivitySummary[] = [
            { name: "Onboard Lead", link: "marriage-bureau/onboard-lead", redSla: 2, amberSla: 1, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Initial Fee Payment", link: "marriage-bureau/initial-fee-payment", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "High Level Due Diligence", link: "marriage-bureau/high-level-due-diligence", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Heads of Terms", link: "marriage-bureau/heads-of-terms", redSla: 42, amberSla: 10, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Detailed Due Diligence", link: "marriage-bureau/detailed-due-diligence", redSla: 56, amberSla: 12, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Formal Offer", link: "marriage-bureau/formal-offer", redSla: 14, amberSla: 5, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Transaction Agreement", link: "marriage-bureau/transaction-agreement", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Final Fee Payment", link: "marriage-bureau/final-fee-payment", redSla: 30, amberSla: 2, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
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

    const determineMarriageBureauRAGStatus = (activeCase: App.ActivityDetail): string => {
        let activitySummaries: App.ActivitySummary[] = [
            { name: "Onboard Lead", link: "marriage-bureau/onboard-lead", redSla: 2, amberSla: 1, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Initial Fee Payment", link: "marriage-bureau/initial-fee-payment", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "High Level Due Diligence", link: "marriage-bureau/high-level-due-diligence", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Heads of Terms", link: "marriage-bureau/heads-of-terms", redSla: 42, amberSla: 10, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Detailed Due Diligence", link: "marriage-bureau/detailed-due-diligence", redSla: 56, amberSla: 12, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Formal Offer", link: "marriage-bureau/formal-offer", redSla: 14, amberSla: 5, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Transaction Agreement", link: "marriage-bureau/transaction-agreement", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Final Fee Payment", link: "marriage-bureau/final-fee-payment", redSla: 30, amberSla: 2, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
        ]

        let ragStatus = "N/A"
        activitySummaries.forEach(activitySummary => {
            if (activeCase._current_step === activitySummary.name) {
                if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                    moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isAfter(moment())
                ) {
                    ragStatus =  "Green"
                } else if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                    moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isBefore(moment())
                ) {
                    ragStatus =  "Amber"
                } else {
                    ragStatus =  "Red"
                }
            }
        });

        return ragStatus

    }

    const calculateBuyerOnboardingActivitySummaries = (activeCases: App.ActivityDetail[]): App.ActivitySummary[] => {

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

    const determineBuyerOnboardingRAGStatus = (activeCase: App.ActivityDetail): string => {
        let activitySummaries: App.ActivitySummary[] = [
            { name: "Introductory Call", link: "buyer-onboarding/introductory-call", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Director Follow Up", link: "buyer-onboarding/director-follow-up", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Buyer Due Diligence", link: "buyer-onboarding/buyer-due-diligence", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Buyer's Pack", link: "buyer-onboarding/buyers-pack", redSla: 14, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }  
        ]

        let ragStatus = "N/A"
        activitySummaries.forEach(activitySummary => {
            if (activeCase._current_step === activitySummary.name) {
                if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                    moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isAfter(moment())
                ) {
                    ragStatus =  "Green"
                } else if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
                    moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isBefore(moment())
                ) {
                    ragStatus =  "Amber"
                } else {
                    ragStatus =  "Red"
                }
            }
        });

        return ragStatus

    }

    return {
        calculateMarriageBureauActivitySummaries,
        determineMarriageBureauRAGStatus,
        calculateBuyerOnboardingActivitySummaries,
        determineBuyerOnboardingRAGStatus,
    };
};
export default useCommonFunctions;