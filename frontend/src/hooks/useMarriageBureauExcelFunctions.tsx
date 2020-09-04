import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import useCommonFunctions from './useCommonFunctions'
import moment from 'moment'

const useExcelFunctions = () => {

    const numFmtStr = '_("£"* #,##0.00_);_("£"* (#,##0.00);_("£"* "-"??_);_(@_)';
    const commonFunctions = useCommonFunctions()

    const generateInstanceList = (activeCases: App.ActivityDetail[]): void => {

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Active Pipeline');

        worksheet.columns = [
            { header: 'Firm Name', key: 'firmName', width: 30 },
            { header: 'FCA Number', key: 'fcaNumber', width: 20 },
            { header: 'Current Activity', key: 'currentActivity', width: 30 },
            { header: 'Activity Start Date', key: 'startDate', width: 20 },
            { header: 'RAG Status', key: 'ragStatus', width: 20 },
            { header: 'Assignee', key: 'assignee', width: 20 },
            { header: 'AUM', key: 'aum', width: 20 },
            { header: 'Recurring Fees', key: 'recurringFees', width: 20 },
            { header: 'Turnover', key: 'turnover', width: 20 },
            { header: 'EBITDA', key: 'ebitda', width: 20 },
            { header: 'Planners', key: 'planners', width: 10 },
            { header: 'Clients', key: 'clients', width: 10 },
            { header: 'Customers', key: 'customers', width: 10 },
            { header: 'Wealth Holdings Fee', key: 'whFee', width: 20 },
            { header: 'Valuation', key: 'valuation', width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true }

        activeCases.forEach((activeCase: App.ActivityDetail, index: number) => {
            worksheet.addRow([
                activeCase.firmName,
                activeCase.fcaNumber,
                activeCase._current_step,
                moment(activeCase._created_at).format("HH:mm DD/MM/YYYY"),
                commonFunctions.determineMarriageBureauRAGStatus(activeCase),
                activeCase._current_assigned_to.Name,
                activeCase.aum,
                activeCase.recurringFees,
                activeCase.turnover,
                activeCase.ebitda,
                activeCase.planners,
                activeCase.clients,
                activeCase.customers,
                activeCase.wealthHoldingsFee,
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

        worksheet.getColumn('valuation').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

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
            { header: 'Firm Name', key: 'firmName', width: 30 },
            { header: 'FCA Number', key: 'fcaNumber', width: 20 },
            { header: 'Company Type', key: 'companyType', width: 30 },
            { header: 'SB Member Firm?', key: 'sbMemberFirm', width: 20 },
            { header: 'WH Representing', key: 'whRepresenting', width: 20 },
            { header: 'Process ID', key: 'processId', width: 20 },
            { header: 'Assignee', key: 'assignee', width: 20 },
            { header: 'Enquiry Logged', key: 'enquiryLogged', width: 20 },
            { header: 'Enquiry Source', key: 'enquirySource', width: 20 },
            { header: 'Enquiry Method', key: 'enquiryMethod', width: 20 }
        ];

        instanceOverviewWorksheet.getRow(1).font = { bold: true }

        instanceOverviewWorksheet.addRow([
            instanceDetails[0].firmName,
            instanceDetails[0].fcaNumber,
            instanceDetails[0].companyType,
            instanceDetails[0].isSimplyBizMember,
            instanceDetails[0].representing,
            instanceDetails[0]._kissflow_id,
            instanceDetails[0]._current_assigned_to[0].Name,
            moment(instanceDetails[0]._created_at).format("HH:mm DD/MM/YYYY"),
            instanceDetails[0].enquirySource,
            instanceDetails[0].enquiryMethod
        ]);

        let instanceHistoryWorksheet = workbook.addWorksheet('Instance History');


        let maxPaymentScheduleEntries = 0
        let isProspectiveOffers = false
        instanceDetails.forEach((instanceDetail: App.ActivityDetail, index: number) => {
            //Check for payment schedule and record max number of columns required
            if (instanceDetail.paymentSchedule.length) {
                console.log(instanceDetail.paymentSchedule)
                if (instanceDetail.paymentSchedule.length > maxPaymentScheduleEntries) {
                    maxPaymentScheduleEntries = instanceDetail.paymentSchedule.length
                }
            }

            if (instanceDetail.prospectiveOffers.length) {
                isProspectiveOffers = true
            }
        })

        let columns = [
            { header: 'Activity Name', key: 'activityName', width: 30 },
            { header: 'Completed', key: 'completed', width: 30 },
            { header: 'Primary Contact', key: 'primaryContact', width: 30 },
            { header: 'Preferred Email', key: 'preferredEmail', width: 30 },
            { header: 'Preferred Phone', key: 'preferredPhone', width: 20 },
            { header: 'AUM', key: 'aum', width: 20 },
            { header: 'Recurring Fees', key: 'recurringFees', width: 20 },
            { header: 'Turnover', key: 'turnover', width: 20 },
            { header: 'EBITDA', key: 'ebitda', width: 20 },
            { header: 'Planners', key: 'planners', width: 20 },
            { header: 'Customers', key: 'customers', width: 20 },
            { header: 'Clients', key: 'clients', width: 20 },
            { header: 'Buyer', key: 'buyer', width: 30 },
            { header: 'Valuation', key: 'valuation', width: 20 },
            { header: 'WH Fee', key: 'whFee', width: 20 },
            { header: 'Completion Date', key: 'completionDate', width: 20 },
            { header: 'Purchase Type', key: 'purchaseType', width: 20 },
        ];

        for (let index = 0; index < maxPaymentScheduleEntries; index++) {
            columns.push(
                { header: `Payment Schedule - Months Post Completion ${index + 1}`, key: `monthsPostCompletion${index + 1}`, width: 50 }
            )
            columns.push(
                { header: `Payment Schedule - Amount ${index + 1}`, key: `amount${index + 1}`, width: 30 }
            )
        }

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
                moment(instanceDetail._last_action_performed_at).format("HH:mm DD/MM/YYYY"),
                instanceDetail.primaryContact,
                instanceDetail.preferredEmail,
                instanceDetail.preferredPhone,
                instanceDetail.aum,
                instanceDetail.recurringFees,
                instanceDetail.turnover,
                instanceDetail.ebitda,
                instanceDetail.planners,
                instanceDetail.customers,
                instanceDetail.clients,
                instanceDetail.purchasingHub,
                instanceDetail.valuation,
                instanceDetail.wealthHoldingsFee,
                completionDate,
                instanceDetail.purchaseType,
            ]

            instanceDetail.paymentSchedule.forEach(element => {
                row.push(Number(element.Months_Post_Completion))
                row.push(Number(element.Payment.split(" ")[0]))
            });

            instanceHistoryWorksheet.addRow(row);
        })

        instanceHistoryWorksheet.getColumn('aum').eachCell(cell => {
            cell.numFmt = numFmtStr;
        });

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

        for (let index = 0; index < maxPaymentScheduleEntries; index++) {
            instanceHistoryWorksheet.getColumn(`amount${index + 1}`).eachCell(cell => {
                console.log(cell.text)
                cell.numFmt = numFmtStr;
            });
        }

        if (isProspectiveOffers) {
            let prospectiveOffersWorksheet = workbook.addWorksheet('Prospective Offers');
            prospectiveOffersWorksheet.columns = [
                { header: 'Buyer', key: 'buyer', width: 20 },
                { header: 'Valuation', key: 'valuation', width: 20 },
                { header: 'WH Fee', key: 'whFee', width: 20 },
                { header: 'Completion Date', key: 'completionDate', width: 20 },
                { header: 'Purchase Type', key: 'purchaseType', width: 20 },
            ]

            prospectiveOffersWorksheet.getRow(1).font = { bold: true }

            instanceDetails.forEach((instanceDetail: App.ActivityDetail, index: number) => {
                if (instanceDetail.prospectiveOffers.length) {
                    instanceDetail.prospectiveOffers.forEach(prospectiveOffer => {
                        prospectiveOffersWorksheet.addRow([
                            prospectiveOffer.Buyer,
                            Number(prospectiveOffer.Valuation_1.split(" ")[0]),
                            Number(prospectiveOffer.Wealth_Holdings_Fee_1.split(" ")[0]),
                            moment(prospectiveOffer.Completion_Date_1).format("DD/MM/YYYY"),
                            prospectiveOffer.Purchase_Type_1
                        ])
                    });
                }
            })

            prospectiveOffersWorksheet.getColumn('valuation').eachCell(cell => {
                cell.numFmt = numFmtStr;
            });
    
            prospectiveOffersWorksheet.getColumn('whFee').eachCell(cell => {
                cell.numFmt = numFmtStr;
            });
        }
        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Marriage Bureau - ${instanceDetails[0].firmName} - Instance Details ${moment().format("DDMMYY")}.xlsx`);
        })
    }

    const generateActionLog = (actions: App.ActivityDetail[]): void => {

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Action Log');

        worksheet.columns = [
            { header: 'Completed Activity', key: 'completedActivity', width: 30 },
            { header: 'Firm Name', key: 'firmName', width: 30 },
            { header: 'FCA Number', key: 'fcaNumber', width: 20 },
            { header: 'Assignee', key: 'startDate', width: 20 },
            { header: 'Completed Date', key: 'completedDate', width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true }

        actions.forEach((action: App.ActivityDetail, index: number) => {
            worksheet.addRow([
                action._current_context[0].Name,
                action.firmName,
                action.fcaNumber,
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
        let worksheet = workbook.addWorksheet('Completed Cases');

        worksheet.columns = [
            { header: 'Firm Name', key: 'firmName', width: 30 },
            { header: 'FCA Number', key: 'fcaNumber', width: 20 },
            { header: 'Completed Date', key: 'completedDate', width: 30 },
        ];

        worksheet.getRow(1).font = { bold: true }

        completedInstances.forEach((completedInstance: App.ActivityDetail, index: number) => {
            worksheet.addRow([
                completedInstance.firmName,
                completedInstance.fcaNumber,
                moment(completedInstance._last_action_performed_at).format("HH:mm DD/MM/YYYY")
            ]);
        })

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Marriage Bureau - Completed Cases ${moment().format("DDMMYY")}.xlsx`);
        })
    }

    const generateClosedInstances = (closedInstances: App.ActivityDetail[]): void => {

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Closed Cases');

        worksheet.columns = [
            { header: 'Firm Name', key: 'firmName', width: 30 },
            { header: 'FCA Number', key: 'fcaNumber', width: 20 },
            { header: 'Reason', key: 'reason', width: 40 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Re-Engage In Future', key: 'reEngage', width: 20 },
            { header: 'Re-Engage Date', key: 'reEngageDate', width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true }

        closedInstances.forEach((closedInstance: App.ActivityDetail, index: number) => {
            worksheet.addRow([
                closedInstance.firmName,
                closedInstance.fcaNumber,
                closedInstance.closeCaseReason,
                closedInstance.closeCaseDescription,
                closedInstance.isReEngage,
                moment(closedInstance.reEngageDate).format("DD/MM/YYYY")
            ]);
        })

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