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
            { header: 'Assignee', key: 'assignee', width: 20 }
        ];

        worksheet.getRow(1).font = { bold: true }

        activeCases.forEach((activeCase: App.ActivityDetail, index: number) => {
            worksheet.addRow([
                activeCase.firmName,
                activeCase.fcaNumber,
                activeCase._current_step,
                moment(activeCase._last_action_performed_at).format("HH:mm DD/MM/YYYY"),
                commonFunctions.determineBuyerOnboardingRAGStatus(activeCase),
                activeCase._current_assigned_to.Name
            ]);
        })

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Buyer Onboarding - Active Pipeline ${moment().format("DDMMYY")}.xlsx`);
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
            instanceDetails[0]._kissflow_id,
            instanceDetails[0]._current_assigned_to[0].Name,
            moment(instanceDetails[0]._created_at).format("HH:mm DD/MM/YYYY"),
            instanceDetails[0].enquirySource,
            instanceDetails[0].enquiryMethod
        ]);

        let instanceHistoryWorksheet = workbook.addWorksheet('Instance History');

        let columns = [
            { header: 'Activity Name', key: 'activityName', width: 30 },
            { header: 'Completed', key: 'completed', width: 30 },
            { header: 'Primary Contact', key: 'primaryContact', width: 30 },
            { header: 'Preferred Email', key: 'preferredEmail', width: 30 },
            { header: 'Preferred Phone', key: 'preferredPhone', width: 20 },
        ];

        instanceHistoryWorksheet.columns = columns

        instanceHistoryWorksheet.getRow(1).font = { bold: true }

        instanceDetails.forEach((instanceDetail: App.ActivityDetail, index: number) => {

            let row = [
                instanceDetail._current_context[0].Name,
                moment(instanceDetail._last_action_performed_at).format("HH:mm DD/MM/YYYY"),
                instanceDetail.primaryContact,
                instanceDetail.preferredEmail,
                instanceDetail.preferredPhone
            ]

            instanceHistoryWorksheet.addRow(row);
        })

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Wealth Holdings - Buyer Onboarding - ${instanceDetails[0].firmName} - Instance Details ${moment().format("DDMMYY")}.xlsx`);
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
            fs.saveAs(blob, `Wealth Holdings - Buyer Onboarding - Action Log ${moment().format("DDMMYY")}.xlsx`);
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
            fs.saveAs(blob, `Wealth Holdings - Buyer Onboarding - Completed Cases ${moment().format("DDMMYY")}.xlsx`);
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
            fs.saveAs(blob, `Wealth Holdings - Buyer Onboarding - Closed Cases ${moment().format("DDMMYY")}.xlsx`);
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