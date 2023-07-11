(function () {
    function readCard() {
        DHCACC_GetAccInfo7(CardNoKeyDownCallBack);
        return ""
    }
    function DHCACC_GetAccInfo7(callBackFun) {
        var obj = document.getElementById("ReadCardTypeEncrypt");
        if (obj) { var encmeth = obj.value; }
        if (encmeth != "") {
            var myrtn = cspRunServerMethod(encmeth, "GetCardTypeToHUIJson", "", "");
            myrtn = eval('(' + myrtn + ')');
            for (var k = 0; k < myrtn.length; k++) {
                var myoptval = myrtn[k]["id"];
                var myEquipDR = myoptval.split("^")[14];
                if ((myoptval.split("^")[16] == "Handle") || (myEquipDR == "")) continue;
                var CardTypeRowId = myoptval.split("^")[0];
                var myrtn = DHCACC_GetAccInfo(CardTypeRowId, myoptval);
                var myary = myrtn.split("^");
                var rtn = myary[0];
                if ((rtn == "0") || (rtn == "-201")) {
                    $("#CardTypeNew").val(myoptval.split("^")[2]);
                    eval('(' + callBackFun + ')')(myrtn);
                    break;
                } else if (rtn == "-200") {
                    //$.messager.alert("提示","卡无效!");
                    eval('(' + callBackFun + ')')(myrtn);
                    break;
                } else if (rtn == "-1") {
                    break;
                }
            }
        } else {
            $.messager.alert("提示", "请先添加隐藏元素ReadCardTypeEncrypt");
            return false;
        }
    }
    function CardNoKeyDownCallBack(myrtn) {
        var myary = myrtn.split("^");
        var rtn = myary[0];
        switch (rtn) {
            case "0":
                var PatientID = myary[4];
                var PatientNo = myary[5];
                var CardNo = myary[1];
                $('#RegNo').val(PatientNo);
                $("#CardNo").val(CardNo);
                IPBookQueryTabDataGridLoad();
                break;
            case "-200":
                $.messager.alert("提示", "卡无效!", "info", function () {
                    $("#CardTypeNew").val("");
                    $("#CardNo").focus();
                });
                break;
            case "-201":
                var PatientID = myary[4];
                var PatientNo = myary[5];
                var CardNo = myary[1];
                $('#RegNo').val(PatientNo);
                $("#CardNo").val(CardNo);
                IPBookQueryTabDataGridLoad();
                break;
            default:
                break;
        }
    }
    var myself = {
        readCard: readCard
    };
    window.myself = myself;
})()