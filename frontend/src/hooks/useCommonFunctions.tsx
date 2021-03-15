import moment from 'moment'

const useCommonFunctions = () => {

    const calculateActivitySummaries = (activeCases: App.ActivityDetail[], activitySummaries: App.ActivitySummary[]): App.ActivitySummary[] => {

        // activeCases.forEach(activeCase => {
        //     let isActivityNameFound = false
        //     activitySummaries.forEach(activitySummary => {
        //         if (activeCase._current_step === activitySummary.name) {
        //             isActivityNameFound = true
        //             activitySummary.totalCount++
        //             if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
        //                 moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isAfter(moment())
        //             ) {
        //                 activitySummary.greenCount++
        //             } else if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
        //                 moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isBefore(moment())
        //             ) {
        //                 activitySummary.amberCount++
        //             } else {
        //                 activitySummary.redCount++
        //             }
        //         }
        //     });

        //     if (!isActivityNameFound) {
        //         // console.log(`Activity name not found: ${activeCase._current_step}`)
        //     }
        // });

        // return activitySummaries
        return null
    }
    

    const determineRAGStatus = (activeCase: App.ActivityDetail, activitySummaries: App.ActivitySummary[]): string => {

        let ragStatus = "N/A"
        // activitySummaries.forEach(activitySummary => {
        //     if (activeCase._current_step === activitySummary.name) {
        //         if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
        //             moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isAfter(moment())
        //         ) {
        //             ragStatus = "Green"
        //         } else if (moment(activeCase._last_action_performed_at).add(activitySummary.redSla, "days").isAfter(moment()) &&
        //             moment(activeCase._last_action_performed_at).add(activitySummary.amberSla, "days").isBefore(moment())
        //         ) {
        //             ragStatus = "Amber"
        //         } else {
        //             ragStatus = "Red"
        //         }
        //     }
        // });

        return ragStatus
    }

    const formatConfidenceStatus = (confidenceStatus): string => {

        if (confidenceStatus === "HIGH"){
            return "High Confidence"
        } else if (confidenceStatus == "MEDIUM"){
            return "Medium Confidence"
        } else if (confidenceStatus == "LOW"){
            return "Low Confidence"
        } else if (confidenceStatus == "HOLD"){
            return "On Hold"
        } else{
            return ""
        }
        
    }

    return {
        // calculateMarriageBureauActivitySummaries,
        // determineMarriageBureauRAGStatus,
        // calculateBuyerOnboardingActivitySummaries,
        // determineBuyerOnboardingRAGStatus,
        calculateActivitySummaries,
        determineRAGStatus,
        formatConfidenceStatus
    };
};
export default useCommonFunctions;