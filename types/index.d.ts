declare module App {

    interface ActiveCase {
        _id: string,
        firmName: string,
        maxProgress: number,
        assignedBdm: any,
        _current_step: string,
        _created_at: Date,
        aum: number,
        recurringFees: number,
        turnover: number,
        ebitda: number,
        planners: number,
        clients: number,
        customers: number,
        // SLA_Initial_Fee_Payment: number,
        // SLA_HLDD: number,
        // SLA_Heads_Of_Terms: number,
        // SLA_DDD: number,
        // SLA_Formal_Offer: number,
        // SLA_Transaction_Agreement: number,
        // SLA_Final_Fee_Payment: number,
        // SLA_Onboard_Lead: number
    }

    interface ActivitySummary {
        name: string,
        link: string,
        redSla: number,
        amberSla: number,
        totalCount: number,
        greenCount: number,
        amberCount: number,
        redCount: number

    }

}

