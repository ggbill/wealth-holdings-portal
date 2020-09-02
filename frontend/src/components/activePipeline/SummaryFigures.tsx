import React, { useState } from 'react'
import './summaryFigures.scss';
import { Box, Card, CardContent } from "@material-ui/core";

interface InputProps {
    activeCases: App.ActivityDetail[]
    isFilterApplied: () => boolean
    clearAllFilters: () => void
    pathname: string
}

interface SummaryFigure {
    name: string,
    value: number,
    isCurrency: boolean,
    isDisplay: boolean
}
const SummaryFigures = (props: InputProps) => {

    let isDisplay = false

    if (props.pathname === "marriage-bureau") {
        isDisplay = true
    }

    const [summaryFigures, setSummaryFigures] = useState<SummaryFigure[]>([])

    const populateSummaryFigures = (): void => {
        let tempSummaryFigures = [
            { name: "Total Firms", value: props.activeCases.length, isCurrency: false, isDisplay: true },
            { name: "AUM", value: 0, isCurrency: true, isDisplay: isDisplay },
            { name: "Recurring Fees", value: 0, isCurrency: true, isDisplay: isDisplay },
            { name: "Turnover", value: 0, isCurrency: true, isDisplay: isDisplay },
            { name: "EBITDA", value: 0, isCurrency: true, isDisplay: isDisplay },
            { name: "Planners", value: 0, isCurrency: false, isDisplay: isDisplay },
            { name: "Clients", value: 0, isCurrency: false, isDisplay: isDisplay },
            { name: "Customers", value: 0, isCurrency: false, isDisplay: isDisplay },
            { name: "Wealth Holdings Fee", value: 0, isCurrency: true, isDisplay: isDisplay },
            { name: "Valuation", value: 0, isCurrency: true, isDisplay: isDisplay },
        ]
        props.activeCases.forEach(activeCase => {
            tempSummaryFigures.forEach(tempSummaryFigure => {

                if (tempSummaryFigure.name === "AUM") {
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
                } else if (tempSummaryFigure.name === "Wealth Holdings Fee") {
                    tempSummaryFigure.value += activeCase.wealthHoldingsFee
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
            <h2>Summary Figures {props.isFilterApplied() && <>(Filtered)<span className="clear-filters" onClick={() => props.clearAllFilters()}>Clear</span></>}</h2>
            {props.pathname === "marriage-bureau" &&
                <p className="intro-text">N.B. 'Wealth Holdings Fee' and 'Valuation' figures are only entered into the system from the 'Heads of Terms' activity.</p>
            }
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