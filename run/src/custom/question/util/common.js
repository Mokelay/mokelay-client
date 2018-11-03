const Util = window._TY_Tool;
export function downLoadExcel(pageData, excelName, setLoading){
    getAnswerText(pageData, excelName, setLoading);
}
function getAnswerText(pageData, excelName, setLoading) {
    pageData.map((element, i1) => {
        switch (element.type) {
            case "open_question":
                element.dataArray.map((value, i2) => {
                    Util.get(window._TY_ContentPath + '/cms-page-question-answer', {
                        page: 1,
                        pageSize: 9999,
                        questionnaire_id: value.questionnaire_id,
                        question_id: value.question_id,
                        option_id: value.option_id,
                    }).then((response) => {
                        if (response.data.code == 200) {
                            let data = response.data.data;
                            pageData[i1]['dataArray'][i2]['contentList'] = data.page_data.currentRecords;
                        }
                    });
                });
                break;
            case "name_location_question":
                Util.get(window._TY_ContentPath + '/cms-page-question-answer', {
                    page: 1,
                    pageSize: 9999,
                    questionnaire_id: element.name.questionnaire_id,
                    question_id: element.name.question_id,
                    option_id: element.name.option_id,
                }).then((response) => {
                    if (response.data.code == 200) {
                        let data = response.data.data;
                        pageData[i1]['nameDataArray'] = data.page_data.currentRecords;
                    }
                });
                Util.get(window._TY_ContentPath + '/cms-page-question-answer', {
                    page: 1,
                    pageSize: 9999,
                    questionnaire_id: element.location.questionnaire_id,
                    question_id: element.location.question_id,
                    option_id: element.location.option_id,
                }).then((response) => {
                    if (response.data.code == 200) {
                        let data = response.data.data;
                        pageData[i1]['locationDataArray'] = data.page_data.currentRecords;
                    }
                });
                break;
            case "add_item_question":
                Util.get(window._TY_ContentPath + '/cms-page-question-answer', {
                    page: 1,
                    pageSize: 9999,
                    questionnaire_id: element.questionnaire_id,
                    question_id: element.question_id,
                    option_id: element.option_id,
                }).then((response) => {
                    if (response.data.code == 200) {
                        let data = response.data.data;
                        pageData[i1]['contentList'] = data.page_data.currentRecords;
                    }
                });
                break;
            case "mark_star_question":
                pageData[i1]['contentList'] = {};
                element.options.map((starValue, index)=>{
                    Util.get(window._TY_ContentPath + '/cms-page-question-answer', {
                        page: 1,
                        pageSize: 9999,
                        questionnaire_id: element.questionnaire_id,
                        question_id: element.question_id,
                        option_id: element.options[index]['option_id'],
                    }).then((response) => {
                        if (response.data.code == 200) {
                            let data = response.data.data;
                            pageData[i1]['contentList'][index] = data.page_data.currentRecords;
                        }
                    });
                })
                break;
            default: break;
        }
    });
    setTimeout(function(){createExcel1(pageData, excelName); setLoading();}, 5000);
}
function createExcel1(pageData, excelName){
    var excel = '', row = '';
    pageData.map((element)=>{
      switch(element.type){
        case "multiple_examination_question":
          excel += '<div>'+element.title+'</div><table>';
          excel += '<tr><td>选项</td>';
          excel += '<td>计数</td>';
          excel += '<td>占比</td>';
          excel += '</tr>';
          element.tableData.map((value)=>{
            excel += '<tr><td>'+value.timu+'</td><td>'+value.count+'</td><td>'+value.percent+'</td></tr>'
          });
          excel += '</table>';
          break;
        case "multiple_radio_question":
          excel += '<div>'+element.title+'</div>';
          element.tableData.map((value)=>{
            let list = [];
            excel += '<table><tr>';
            value.tColumn.map((value1)=>{
              excel += '<td>'+value1.label+'</td>';
              list.push(value1.prop);
            });
            excel += '</tr>';
            value.tData.map((value1)=>{
              excel += '<tr>';
              list.map((value2)=>{
                excel += '<td>'+value1[value2]+'</td>';
              });
              excel += '</tr>';
            });
            excel += '</table>';
          });
          break;
        case "compound_radio_question":
          excel += '<div>'+element.title+'</div>';
          element.tableList.map((value)=>{
            excel +='<div>'+value.title+'</div>';
            value.tlist.map((value1)=>{
              let list = [];
              excel += '<table><tr>';
              value1.tColumn.map((value2)=>{
                excel += '<td>'+value2.label+'</td>';
                list.push(value2.prop);
              });
              excel += '</tr>';
              value1.tData.map((value2)=>{
                excel += '<tr>';
                list.map((value3, index)=>{
                    excel += '<td>'+value2[value3]+'</td>';
                });
                excel += '</tr>';
              });
              excel += '</table>';
            })
          });
          break;
        case "open_question":
          excel += '<div>'+element.title+'</div>';
          element.dataArray.map((value)=>{
            excel += '<div>'+value.timu+'</div>';
            value.contentList.map((value1)=>{
              excel += '<div>'+value1.option_content+'</div>';              
            });
          });
          break;
        case "name_location_question":
          excel += '<div>'+element.title+'</div>';
          element.nameDataArray.map((value, index)=>{
              excel += '<div>'+value.option_content+'</div>';
              excel += '<div>'+element.locationDataArray[index] ? element.locationDataArray[index]['option_content'] : ''+'</div>'
          });
          break;
        case "add_item_question":
          excel += '<div>'+element.title+'</div>';
          element.contentList.map((value)=>{
              excel += '<div>'+value.option_content+'</div>';
          });
          break;
        case "mark_star_question":
          excel += '<div>'+element.title+'</div>';
          element.options.map((markValue, index)=>{
            let starData = {
              "timu": "选择数量（人）"
            };
            for(let i=0; i<=markValue.totalStar; i++){
              starData[i] = '0';
            }
            element.contentList[index].map((value, index1)=>{
              let key = value.option_content.length == 0 ? '0' : value.option_content;
              let m = starData[key];
              m = parseInt(m) + 1;
              starData[key] = m;
            });
            
            excel += '<table><tr><td></td>';
            for(let i=0; i<=markValue.totalStar; i++){
                excel += '<td>'+ i + '星</td>';
            }
            excel += '</tr><tr>';
            excel += '<td>' + starData.timu + '</td>';
            for(let j=0; j<=markValue.totalStar; j++){
                excel += '<td>' + starData[j] + '</td>';
            }
            excel += '</tr></table>';
          })
          break;
        default: break;
      }
    });
    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";


    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = excelName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
