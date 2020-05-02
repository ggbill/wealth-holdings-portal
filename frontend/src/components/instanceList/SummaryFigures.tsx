import React, { useState } from 'react'
import './summaryFigures.scss';
import { Box, Card, CardActionArea, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom"

interface InputProps {
    activeCases: App.ActiveCase[]
}

interface SummaryFigure {
    name: string,
    value: number,
    isCurrency: boolean
}
const SummaryFigures = (props: InputProps) => {

    const [summaryFigures, setSummaryFigures] = useState<SummaryFigure[]>([])

    const populateSummaryFigures = (): void => {
        let tempSummaryFigures = [
            { name: "Total Firms", value: props.activeCases.length, isCurrency: false },
            { name: "AUM", value: 0, isCurrency: true },
            { name: "Recurring Fees", value: 0, isCurrency: true },
            { name: "Turnover", value: 0, isCurrency: true },
            { name: "EBITDA", value: 0, isCurrency: true },
            { name: "Planners", value: 0, isCurrency: false },
            { name: "Clients", value: 0, isCurrency: false },
            { name: "Customers", value: 0, isCurrency: false }
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
            <h2>Summary Figures</h2>
            <Box display="flex" flexDirection="row" flexWrap="wrap">
                {summaryFigures.map((summaryFigure: SummaryFigure, index: number) => (
                    <Card key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardActionArea component={Link} to={`/`}>
                            <CardContent>
                                <span>{summaryFigure.name}</span>
                                {
                                    summaryFigure.isCurrency ?
                                        <span className="value">{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'GBP', minimumFractionDigits: 0}).format(summaryFigure.value)}</span> :
                                        <span className="value">{summaryFigure.value}</span>
                                }

                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </div>
    )
}

export default SummaryFigures