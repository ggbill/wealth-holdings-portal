import moment from 'moment'

const useCommonFunctions = () => {

    const determineRAGStatus = (activeCase: App.ActiveCase): string => {
        if (activeCase._current_step === "Onboard Lead") {
            if (moment(activeCase._created_at).add(activeCase.SLA_Onboard_Lead, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Onboard_Lead, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_Onboard_Lead, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Onboard_Lead, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else if (activeCase._current_step === "Initial Fee Payment") {
            if (moment(activeCase._created_at).add(activeCase.SLA_Initial_Fee_Payment, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Initial_Fee_Payment, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_Initial_Fee_Payment, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Initial_Fee_Payment, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else if (activeCase._current_step === "High Level Due Diligence") {
            if (moment(activeCase._created_at).add(activeCase.SLA_HLDD, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_HLDD, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_HLDD, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_HLDD, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else if (activeCase._current_step === "Heads of Terms") {
            if (moment(activeCase._created_at).add(activeCase.SLA_Heads_Of_Terms, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Heads_Of_Terms, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_Heads_Of_Terms, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Heads_Of_Terms, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else if (activeCase._current_step === "Detailed Due Diligence") {
            if (moment(activeCase._created_at).add(activeCase.SLA_DDD, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_DDD, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_DDD, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_DDD, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else if (activeCase._current_step === "Formal Offer") {
            if (moment(activeCase._created_at).add(activeCase.SLA_Formal_Offer, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Formal_Offer, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_Formal_Offer, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Formal_Offer, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else if (activeCase._current_step === "Transaction Agreement") {
            if (moment(activeCase._created_at).add(activeCase.SLA_Transaction_Agreement, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Transaction_Agreement, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_Transaction_Agreement, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Transaction_Agreement, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else if (activeCase._current_step === "Final Fee Payment") {
            if (moment(activeCase._created_at).add(activeCase.SLA_Final_Fee_Payment, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Final_Fee_Payment, "days").subtract(1, "day").isAfter(moment())
            ) {
                return "GREEN"
            } else if (moment(activeCase._created_at).add(activeCase.SLA_Final_Fee_Payment, "days").isAfter(moment()) &&
                moment(activeCase._created_at).add(activeCase.SLA_Final_Fee_Payment, "days").subtract(1, "day").isBefore(moment())
            ) {
                return "AMBER"
            } else {
                return "RED"
            }
        } else{
            console.log("Unknown Step Name")
            return "UNKNOWN"
        }



    }

    return {
        determineRAGStatus,
    };
};
export default useCommonFunctions;