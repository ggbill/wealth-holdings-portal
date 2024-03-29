declare module App {
    interface ActivitySummary {
        name: string,
        link: string,
        totalCount: number,
        greenCount: number,
        amberCount: number,
        redCount: number,
        greyCount: number   
    }
    // interface ActivitySummary {
    //     name: string,
    //     link: string,
    //     redSla: number,
    //     amberSla: number,
    //     totalCount: number,
    //     greenCount: number,
    //     amberCount: number,
    //     redCount: number
    // }

    interface TableFilters {
        currentActivity: string,
        assignedBdm: string,
        ragStatus: string,
        representing: string,
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
        buyer: string,
        seller: string,
        isSimplyBizDeal: boolean,
        fcaNumber: string,
        companyType: string, 
        isSimplyBizMember: boolean,
        representing: string,
        isCloseCase: boolean,
        closeCaseReason: string,
        closeCaseDescription: string,
        isReEngage: boolean,
        reEngageDate: Date,
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
        introducerFee: number,
        simplyBizFee: number,
        completionDate: Date,
        purchaseType: string,
        paymentSchedule: any[],
        prospectiveOffers: any[],
        finalTransactionReference: string,
        officeAddress: string,
        operatingRegionList: string[],
        officeLocation: string,
        currentStatus: string,
        confidence: string,
        activityAction: string,
        completeActivityAction: string,
        fundsAvailable: number
    }

    interface Setting{
        _id: string,
        orderNumber: number,
        activityName: string,
        process: string,
        amberSla: number,
        redSla: number
    } 

}

