import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import useCommonFunctions from './useCommonFunctions'
import moment from 'moment'

const useExcelFunctions = () => {

    const numFmtStr = '_("£"* #,##0.00_);_("£"* (#,##0.00);_("£"* "-"??_);_(@_)';
    const commonFunctions = useCommonFunctions()

    const generateInstanceList = (activeCases: App.ActivityDetail[], activitySummaries): void => {

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Active Pipeline');

        worksheet.columns = [
            { header: 'Buyer', key: 'buyer', width: 30 },
            { header: 'Seller', key: 'seller', width: 30 },
            { header: 'Process Start Date', key: 'processStartDate', width: 20 },
            { header: 'RAG Status', key: 'ragStatus', width: 20 },
            { header: 'Current Status', key: 'currentStatus', width: 60 },
            { header: 'Current Activity', key: 'currentActivity', width: 30 },
            { header: 'Activity Start Date', key: 'activityStartDate', width: 20 },
            { header: 'Assignee', key: 'assignee', width: 20 },
            { header: 'Wealth Holdings Fee', key: 'whFee', width: 20 },
            { header: 'SimplyBiz Fee', key: 'sbFee', width: 20 },
            { header: 'Introducer Fee', key: 'introducerFee', width: 20 },
            { header: 'Target Completion Date', key: 'targetCompletionDate', width: 20 },
            { header: 'AUM', key: 'aum', width: 20 },
            { header: 'Recurring Fees', key: 'recurringFees', width: 20 },
            { header: 'Turnover', key: 'turnover', width: 20 },
            { header: 'EBITDA', key: 'ebitda', width: 20 },
            { header: 'Planners', key: 'planners', width: 10 },
            { header: 'Clients', key: 'clients', width: 10 },
            { header: 'Customers', key: 'customers', width: 10 },
            { header: 'Valuation', key: 'valuation', width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true }

        activeCases.forEach((activeCase: App.ActivityDetail, index: number) => {
            worksheet.addRow([
                activeCase.buyer,
                activeCase.seller,
                moment(activeCase._submitted_at).format("HH:mm DD/MM/YYYY"),
                commonFunctions.determineRAGStatus(activeCase, activitySummaries),
                activeCase.currentStatus,
                activeCase._current_step,
                moment(activeCase._last_action_performed_at).format("HH:mm DD/MM/YYYY"),
                activeCase._current_assigned_to.Name,
                activeCase.wealthHoldingsFee,
                activeCase.simplyBizFee,
                activeCase.introducerFee,
                moment(activeCase.completionDate).format("HH:mm DD/MM/YYYY"),
                activeCase.aum,
                activeCase.recurringFees,
                activeCase.turnover,
                activeCase.ebitda,
                activeCase.planners,
                activeCase.clients,
                activeCase.customers,
                activeCase.valuation
            ]);
        })

        worksheet.getColumn('aum').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        worksheet.getColumn('recurringFees').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        worksheet.getColumn('turnover').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        worksheet.getColumn('ebitda').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        worksheet.getColumn('whFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        worksheet.getColumn('sbFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        worksheet.getColumn('introducerFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        worksheet.getColumn('valuation').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        // Dynamically colour the RAG stauses
        worksheet.getColumn('ragStatus').eachCell(function (cell, cellNumber) {
            if (cellNumber > 1) {
                if (cell.value === "Green") {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '0057ab6e' }
                    }
                    cell.font = { color: { argb: "FFFFFF" }, bold: true }
                } else if (cell.value === "Amber") {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '00FF8C42' }
                    }
                    cell.font = { color: { argb: "FFFFFF" }, bold: true }
                } else if (cell.value === "Red") {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '00EE6055' }
                    }
                    cell.font = { color: { argb: "FFFFFF" }, bold: true }
                }
            }
        })

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Marriage Bureau - Active Pipeline ${moment().format("DDMMYY")}.xlsx`);
        })
    }

    const generateInstanceDetails = (instanceDetails: App.ActivityDetail[]): void => {
        console.log(instanceDetails)

        //Create workbook and worksheet
        let workbook = new Workbook();
        let instanceOverviewWorksheet = workbook.addWorksheet('Instance Overview');

        instanceOverviewWorksheet.columns = [
            { header: 'Buyer', key: 'buyer', width: 30 },
            { header: 'Seller', key: 'seller', width: 30 },
            { header: 'Process ID', key: 'processId', width: 20 },
            { header: 'Enquiry Logged', key: 'enquiryLogged', width: 20 },
        ];

        instanceOverviewWorksheet.getRow(1).font = { bold: true }

        instanceOverviewWorksheet.addRow([
            instanceDetails[0].buyer,
            instanceDetails[0].seller,
            instanceDetails[0]._kissflow_id,
            moment(instanceDetails[0]._created_at).format("HH:mm DD/MM/YYYY"),
        ]);

        let instanceHistoryWorksheet = workbook.addWorksheet('Instance History');

        let columns = [
            { header: 'Activity Name', key: 'activityName', width: 30 },
            { header: 'Completed By', key: 'completedBy', width: 30 }, 
            { header: 'Completed Date', key: 'completedDate', width: 30 }, 
            { header: 'AUM', key: 'aum', width: 20 },
            { header: 'Recurring Fees', key: 'recurringFees', width: 20 },
            { header: 'Turnover', key: 'turnover', width: 20 },
            { header: 'EBITDA', key: 'ebitda', width: 20 },
            { header: 'Planners', key: 'planners', width: 20 },
            { header: 'Customers', key: 'customers', width: 20 },
            { header: 'Clients', key: 'clients', width: 20 },
            { header: 'Valuation', key: 'valuation', width: 20 },
            { header: 'Wealth Holdings Fee', key: 'whFee', width: 20 },
            { header: 'SimplyBiz Fee', key: 'sbFee', width: 20 },
            { header: 'Introducer Fee', key: 'introducerFee', width: 20 },
            { header: 'Completion Date', key: 'completionDate', width: 20 },
            { header: 'Purchase Type', key: 'purchaseType', width: 20 },
        ];

        instanceHistoryWorksheet.columns = columns

        instanceHistoryWorksheet.getRow(1).font = { bold: true }

        instanceDetails.forEach((instanceDetail: App.ActivityDetail, index: number) => {

            let completionDate;

            if (instanceDetail.completionDate) {
                completionDate = moment(instanceDetail.completionDate).format("DD/MM/YYYY")
            } else {
                completionDate = null
            }

            let row = [
                instanceDetail._current_context[0].Name,
                instanceDetail._last_action_performed_by.Name,
                moment(instanceDetail._last_action_performed_at).format("HH:mm DD/MM/YYYY"),
                instanceDetail.aum,
                instanceDetail.recurringFees,
                instanceDetail.turnover,
                instanceDetail.ebitda,
                instanceDetail.planners,
                instanceDetail.customers,
                instanceDetail.clients,
                instanceDetail.valuation,
                instanceDetail.wealthHoldingsFee,
                instanceDetail.simplyBizFee,
                instanceDetail.introducerFee,
                completionDate,
                instanceDetail.purchaseType,
            ]

            instanceHistoryWorksheet.addRow(row);
        })

        instanceHistoryWorksheet.getColumn('aum').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });


        instanceHistoryWorksheet.getColumn('recurringFees').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        instanceHistoryWorksheet.getColumn('turnover').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        instanceHistoryWorksheet.getColumn('ebitda').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        instanceHistoryWorksheet.getColumn('valuation').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        instanceHistoryWorksheet.getColumn('whFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        instanceHistoryWorksheet.getColumn('sbFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        instanceHistoryWorksheet.getColumn('introducerFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Marriage Bureau - ${instanceDetails[0].firmName} - Instance Details ${moment().format("DDMMYY")}.xlsx`);
        })
    }

    const generateActionLog = (actions: App.ActivityDetail[]): void => {

        //Create workbook and worksheet
        let workbook = new Workbook();
        let actionLogWorksheet = workbook.addWorksheet('Action Log');

        actionLogWorksheet.columns = [
            { header: 'Completed Activity', key: 'completedActivity', width: 30 },
            { header: 'Buyer', key: 'buyer', width: 30 },
            { header: 'Seller', key: 'seller', width: 30 },
            { header: 'Assignee', key: 'startDate', width: 20 },
            { header: 'Completed Date', key: 'completedDate', width: 20 },
        ];

        actionLogWorksheet.getRow(1).font = { bold: true }

        actions.forEach((action: App.ActivityDetail, index: number) => {
            actionLogWorksheet.addRow([
                action._current_context[0].Name,
                action.buyer,
                action.seller,
                action._last_action_performed_by.Name,
                moment(action._last_action_performed_at).format("HH:mm DD/MM/YYYY")
            ]);
        })

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Marriage Bureau - Action Log ${moment().format("DDMMYY")}.xlsx`);
        })
    }

    const generateCompletedInstances = (completedInstances: App.ActivityDetail[]): void => {

        //Create workbook and worksheet
        let workbook = new Workbook();
        let completedWorksheet = workbook.addWorksheet('Completed Cases');

        completedWorksheet.columns = [
            { header: 'Buyer', key: 'buyer', width: 30 },
            { header: 'Seller', key: 'seller', width: 30 },
            { header: 'Completed Date', key: 'completedDate', width: 30 },
            { header: 'Total Duration (Days)', key: 'totalDuration', width: 30 },
            { header: 'Wealth Holdings Fee', key: 'whFee', width: 20 },
            { header: 'SimplyBiz Fee', key: 'sbFee', width: 20 },
            { header: 'Introducer Fee', key: 'introducerFee', width: 20 },
        ];

        completedWorksheet.getRow(1).font = { bold: true }

        completedInstances.forEach((completedInstance: App.ActivityDetail, index: number) => {
            completedWorksheet.addRow([
                completedInstance.buyer,
                completedInstance.seller,
                moment(completedInstance._last_action_performed_at).format("HH:mm DD/MM/YYYY"),
                moment.duration(moment(completedInstance._last_action_performed_at).diff(moment(completedInstance._created_at))).asDays().toFixed(1),
                completedInstance.wealthHoldingsFee,
                completedInstance.simplyBizFee,
                completedInstance.introducerFee
            ]);
        })

        completedWorksheet.getColumn('whFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        completedWorksheet.getColumn('sbFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        completedWorksheet.getColumn('introducerFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Marriage Bureau - Completed Cases ${moment().format("DDMMYY")}.xlsx`);
        })
    }

    const generateClosedInstances = (closedInstances: App.ActivityDetail[]): void => {

        //Create workbook and worksheet
        let workbook = new Workbook();
        let closedWorksheet = workbook.addWorksheet('Closed Cases');

        closedWorksheet.columns = [
            { header: 'Buyer', key: 'buyer', width: 30 },
            { header: 'Seller', key: 'seller', width: 30 },
            { header: 'Wealth Holdings Fee', key: 'whFee', width: 20 },
            { header: 'SimplyBiz Fee', key: 'sbFee', width: 20 },
            { header: 'Introducer Fee', key: 'introducerFee', width: 20 },
            { header: 'Reason', key: 'reason', width: 40 },
            { header: 'Description', key: 'description', width: 40 }
        ];

        closedWorksheet.getRow(1).font = { bold: true }

        closedInstances.forEach((closedInstance: App.ActivityDetail, index: number) => {
            closedWorksheet.addRow([
                closedInstance.buyer,
                closedInstance.seller,
                closedInstance.wealthHoldingsFee,
                closedInstance.simplyBizFee,
                closedInstance.introducerFee,
                closedInstance.closeCaseReason,
                closedInstance.closeCaseDescription,
            ]);
        })

        closedWorksheet.getColumn('whFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        closedWorksheet.getColumn('sbFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        closedWorksheet.getColumn('introducerFee').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Marriage Bureau - Closed Cases ${moment().format("DDMMYY")}.xlsx`);
        })
    }

    return {
        generateInstanceList,
        generateInstanceDetails,
        generateActionLog,
        generateCompletedInstances,
        generateClosedInstances
    };
};
export default useExcelFunctions;