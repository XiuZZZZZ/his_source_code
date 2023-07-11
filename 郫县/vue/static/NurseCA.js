/**
 * @author Songchao  
 * @description  封装调用电子病历CA方法的js
 * @name  NurseCA.js
*/
(function () {
    /**
     * @description  获取用户列表 并填充到证书列表 (电子病历接口)
     */

    function nurUserList() {
        var caList = [];
        var listStr = GetUserList();
        var userList = listStr.split('&&&');
        for (var i = 0; i < userList.length; i++) {
            if (userList[i] == "") continue;
            var caObj = {};
            var userInfo = userList[i].split('||');
            caObj.userName = userInfo[0];
            caObj.userID = userInfo[1];
            caList.push(caObj);
        }
        return caList;
    }
    /**
     * @description CASession初始化服务调用
     * @param {any} runServerMethod 
     * @returns 
    */
    function caInitData(runServerMethod) {
        return runServerMethod("web.DHCNurCASignVerify", "CASessionDataInit");
    }

    /**
     * @description 判断UKey与当前his登录用户是否一致.
     * @param {*} runServerMethod
     * @param {*} strContainerName  证书id
     * @param {*} hisUserID         his当前登录用户ID
     */
    function matchLoginUserCert(CAInit, runServerMethod, strContainerName, session) {
        CAInit = String(CAInit).replace(/(\r\n)|(\n)|(\s)/g, "")
        if (CAInit != "") {
            var strCA = CAInit.split("@");
            var strServerRan = strCA[0];
            var strClientSignedData = SignedData(strServerRan, strContainerName);  // 调用电子病历封装方法对随机数进行签名
            var varCert = GetSignCert(strContainerName);			 // 调用电子病历封装方法获取证书标识符
            var varCertCode = GetUniqueID(varCert);  //2013-04-07  	//调用电子病历封装方法放置用户证书唯一标识
            var certificateNo = GetCertNo(strContainerName);  //2013-04-07 						//调用电子病历封装方法根据证书名获取证书编号
            var strPicData = GetPicBase64Data(strContainerName);									//调用电子病历封装方法获取签名图片
            return runServerMethod("web.DHCNurCASignVerify", "CAServiceVerify", strContainerName, varCert, strServerRan,
                strClientSignedData, strPicData, varCertCode, certificateNo, session.USER.USERID);
        }

    }
    /**
     * @description 电子病历方法验证证书口令
     * @param {*} certid
     * @param {*} pwd
     * @returns
     */
    function checkUser(certid, pwd) {
        var result = "";
        if (SOF_Login(certid, pwd)) {
            result = "0";
        } else {
            var retryCount = SOF_GetPinRetryCount(certid);
            if (retryCount > 0) {
                result = "校验证书密码失败!您还有" + retryCount + "次机会重试!";
            } else if (retryCount == 0) {
                result = "您的证书密码已被锁死,请联系BJCA进行解锁!";
            } else {
                result = "登录失败!";
            }
        }
        return result;
    }
    /**
     * @description 对执行记录进行CA签名
     * @param {*} runServerMethod 
     * @param {*} vueComponent 组件
     * @param {*} execID 执行记录ID
     * @param {*} skinBatch 皮试批号
     * @param {*} queryTypeCode 单据code
     * @param {*} exedate  执行日期
     * @param {*} exetime  执行时间
     * @param {*} strContainerName  证书id
     * @param {*} session session
     */
    function signOrd(runServerMethod, vueComponent, execID, skinBatch, queryTypeCode, exedate, exetime, strContainerName, session) {
        var $message = vueComponent.$message;
        var username = session.USER.USERNAME;
        var execInfo = "已执行^" + skinBatch + "^" + exedate + "^" + exetime + "^" + username + "^" + queryTypeCode;
        runServerMethod("web.DHCNurSignVerify", "GetOEOREItemXML", execID, execInfo, 1).then(function (OEOREItemXML) {
            var ordHashStr = HashData(OEOREItemXML);     //调用电子病历封装方法将医嘱信息xml串转换成Hash码
            var signedOrdStr = SignedData(ordHashStr, strContainerName);     //调用电子病历封装方法对生成的hash码做签名处理
            var varCert = GetSignCert(strContainerName);				//调用电子病历封装方法获取证书标识符
            var varCertCode = GetUniqueID(varCert);
            if ((execID != "") && (ordHashStr != "") && (signedOrdStr != "")) {						//调用电子病历封装方法放置用户证书唯一标识
                const userID = session.USER.USERID;
                runServerMethod("web.DHCNurSignVerify", "InsertBatchSignRecord", execID, userID, 1, ordHashStr, varCertCode, signedOrdStr, "").then(function (ret) {
                    if (ret != "0") {
                        $message({
                            message: "数字签名没成功:" + execID + ordHashStr + signedOrdStr,
                            duration: 5000,
                            showClose: true,
                            type: "error",
                        });
                    }
                });
            }
        });
    }

    function testCA() {
        testCAOther();
        var list = GetUserList();
        return list;
    }
    var NurseCA = {
        caInitData: caInitData,
        matchLoginUserCert: matchLoginUserCert,
        nurUserList: nurUserList,
        checkUser: checkUser,
        signOrd: signOrd,
        testCA: testCA
    };
    window.NurseCA = NurseCA;
})()