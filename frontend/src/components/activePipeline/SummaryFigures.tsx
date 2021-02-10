import React, { useState } from 'react'
import './summaryFigures.scss';
import { Box, Card, CardContent } from "@material-ui/core";

interface InputProps {
    activeCases: App.ActivityDetail[]
    isFilterApplied: () => boolean
    clearAllFilters: () => void
    pathname: string
    title: string
}

interface SummaryFigure {
    name: string,
    value: number,
    isCurrency: boolean,
    isDisplay: boolean
}
const SummaryFigures = (props: InputProps) => {

    let isDisplayWHFee, isDisplaySBFee, isDisplayIntroducerFee, isDisplayTotalFee, isDisplayAum,
        isDisplayRecurringFees, isDisplayTurnover, isDisplayEbitda, isDisplayPlanners, isDisplayClients, isDisplayCustomers, isDisplayValution,
        isDisplayFundsAvailable = false

    if (props.pathname === "marriage-bureau") {
        isDisplayWHFee = true
        isDisplaySBFee = true
        isDisplayIntroducerFee = true
        isDisplayTotalFee = true
        isDisplayAum = true
        isDisplayRecurringFees = true
        isDisplayTurnover = true
        isDisplayEbitda = true
        isDisplayPlanners = true
        isDisplayClients = true
        isDisplayCustomers = true
        isDisplayValution = true
    } else if (props.pathname === "buyer-onboarding") {
        isDisplayFundsAvailable = true
    }

    const [summaryFigures, setSummaryFigures] = useState<SummaryFigure[]>([])

    const populateSummaryFigures = (): void => {
        let tempSummaryFigures = [
            { name: "Total Firms", value: props.activeCases.length, isCurrency: false, isDisplay: true },
            { name: "Funds Available", value: 0, isCurrency: true, isDisplay: isDisplayFundsAvailable },
            { name: "Wealth Holdings Fees", value: 0, isCurrency: true, isDisplay: isDisplayWHFee },
            { name: "SimplyBiz Fees", value: 0, isCurrency: true, isDisplay: isDisplaySBFee },
            { name: "Introducer Fees", value: 0, isCurrency: true, isDisplay: isDisplayIntroducerFee },
            { name: "Total Fees", value: 0, isCurrency: true, isDisplay: isDisplayTotalFee },
            { name: "AUM", value: 0, isCurrency: true, isDisplay: isDisplayAum },
            { name: "Recurring Fees", value: 0, isCurrency: true, isDisplay: isDisplayRecurringFees },
            { name: "Turnover", value: 0, isCurrency: true, isDisplay: isDisplayTurnover },
            { name: "EBITDA", value: 0, isCurrency: true, isDisplay: isDisplayEbitda },
            { name: "Planners", value: 0, isCurrency: false, isDisplay: isDisplayPlanners },
            { name: "Clients", value: 0, isCurrency: false, isDisplay: isDisplayClients },
            { name: "Customers", value: 0, isCurrency: false, isDisplay: isDisplayCustomers },
            { name: "Valuation", value: 0, isCurrency: true, isDisplay: isDisplayValution },

        ]
        props.activeCases.forEach(activeCase => {
            tempSummaryFigures.forEach(tempSummaryFigure => {
                if (tempSummaryFigure.name === "Wealth Holdings Fees") {
                    tempSummaryFigure.value += activeCase.wealthHoldingsFee
                } else if (tempSummaryFigure.name === "Funds Available") {
                    tempSummaryFigure.value += activeCase.fundsAvailable
                }else if (tempSummaryFigure.name === "Introducer Fees") {
                    tempSummaryFigure.value += activeCase.introducerFee
                } else if (tempSummaryFigure.name === "SimplyBiz Fees") {
                    tempSummaryFigure.value += activeCase.simplyBizFee
                } else if (tempSummaryFigure.name === "Total Fees") {
                    tempSummaryFigure.value += (activeCase.simplyBizFee + activeCase.introducerFee + activeCase.wealthHoldingsFee)
                } else if (tempSummaryFigure.name === "AUM") {
                    tempSummaryFigure.value += activeCase.aum
                } else if (tempSummaryFigure.name === "Recurring Fees") {
                    tempSummaryFigure.value += activeCase.recurringFees
                } else if (tempSummaryFigure.name === "Turnover") {
                    tempSummaryFigure.value += activeCase.turnover
                } else if (tempSummaryFigure.name === "EBITDA") {
                    tempSummaryFigure.value += activeCase.ebitda
                } else if (tempSummaryFigure.name === "Planners") {
                    tempSummaryFigure.value += activeCase.planners
                } else if (tempSummaryFigure.name === "Clients") {
                    tempSummaryFigure.value += activeCase.clients
                } else if (tempSummaryFigure.name === "Customers") {
                    tempSummaryFigure.value += activeCase.customers
                } else if (tempSummaryFigure.name === "Valuation") {
                    tempSummaryFigure.value += activeCase.valuation
                } 
            });
        });
        setSummaryFigures(tempSummaryFigures)
    }

    React.useEffect(() => {
        populateSummaryFigures();
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [props.activeCases]);

    return (
        <div className="summary-figures">
            <h3>{props.title} {props.isFilterApplied() && <>(Filtered)<span className="clear-filters" onClick={() => props.clearAllFilters()}>Clear</span></>}</h3>
            <Box display="flex" flexDirection="row" flexWrap="wrap">
                {summaryFigures.map((summaryFigure: SummaryFigure, index: number) => (
                    summaryFigure.isDisplay &&
                    <Card key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent>
                            <span>{summaryFigure.name}</span>
                            {
                                summaryFigure.isCurrency ?
                                    <span className="value">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(summaryFigure.value)}</span> :
                                    <span className="value">{new Intl.NumberFormat().format(summaryFigure.value)}</span>
                            }
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </div>
    )
}

export default SummaryFigures