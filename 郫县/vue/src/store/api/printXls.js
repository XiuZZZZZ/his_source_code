/**
 * @description excel打印方法 --songchao
 *
 */
/* eslint-disable */
import Vue from 'vue';
import printApi from './print';

var printXls = {
    /**
      * @author songchao
      * @description 多人生命体征打印
      * @returns 
      */
    printByExcel(templatePath, tHeader, patitents, searchDate, searchTime) {
        var fileName = `${templatePath}/NurTemp.xls`.replace('\r\n', '');
        var xlsExcel = new ActiveXObject("Excel.Application");
        try {
            var xlsBook = xlsExcel.Workbooks.Add(fileName);
            var xlsSheet = xlsBook.ActiveSheet;
            // xlsSheet.Cells(1, 1).Value = "测量时间：";
            // xlsSheet.Cells(1, 2).Value = searchDate;
            // xlsSheet.Cells(1, 3).Value = searchTime;
            xlsSheet.Range("A1:C1").MergeCells = true;
            xlsSheet.Cells(1, 1).Value = `测量时间：${searchDate} ${searchTime}`;
            let col = 1;
            tHeader.forEach(headStr => {
                xlsSheet.Cells(2, col).Value = headStr;
                col = col + 1;
            });
            let row = 3;
            patitents.forEach(patitent => {
                xlsSheet.Cells(row, 1).Value = patitent.bedCode;
                xlsSheet.Cells(row, 2).Value = patitent.name;
                row = row + 1;
            });
            for (let r = 2; r < row; r += 1) {
                for (let c = 1; c < col; c += 1) {
                    xlsSheet.Cells(r, c).Borders.ColorIndex = 1;
                }
            }
            xlsSheet.PrintOut;
            xlsSheet = null;
            // xlsBook.Close((savechanges = false));
            xlsBook = null;
            // xlsExcel.Quit();
            xlsExcel = null;
        } catch (e) {
            this.$message.error("注意", "没有找到打印模板!");
            xlsExcel.Quit();
            xlsExcel = null;
        }
    },
};

export default printXls;