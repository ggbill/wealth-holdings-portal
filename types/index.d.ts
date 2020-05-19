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

    interface TableFilters {
        currentActivity: string,
        assignedBdm: string,
        ragStatus: string
    }

    interface ActivityDetail {
        _last_action: string,
        _last_action_performed_by: any,
        _last_action_performed_at: Date,
        _flow_id: string,
        _current_context: any[],
        _id: string,
        _created_by: any,
        _modified_by: any,
        _created_at: Date,
        _modified_at: Date,
        _flow_name: string,
        _current_step: string,
        _current_assigned_to: any,
        _status: string,
        _stage: number,
        _root_process_instance: string,
        _submitted_at: Date,
        _request_number: number,
        _counter: number,
        _last_completed_step: string,
        _progress: number,
        _kissflow_id: string,
        enquiryMethod: string,
        enquirySource: string,
        primaryContact: string,
        preferredEmail: string,
        preferredPhone: string,
        firmName: string,
        companyType: string, 
        isSimplyBizMember: string,
        closeCase: boolean,
        reEngage: boolean,
        initialTransactionReference: string,
        aum: number,
        recurringFees: number,
        turnover: number,
        ebitda: number,
        planners: number,
        clients: number,
        customers: number,
        purchasingHub: string,
        valuation: number,
        wealthHoldingsFee: number,
        completionDate: Date,
        purchaseType: string,
        paymentSchedule: any[],
        finalTransactionReference: string
    }

}

