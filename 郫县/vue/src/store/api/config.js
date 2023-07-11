export default {
  proxyTable: {
    RESTFull: "/imedical/web/csp/nurseserver",
    ".csp": "/imedical/web/csp"
  },
  cacheInfo: {
    CacheUserName: "dhsyslogin",
    CachePassword: "1q2w3e4r%T6y7u8i9o0p",
    CacheNoRedirect: 1
  },
  loginInfo: {
    // 本地的环境
    // userID: 100211,
    // locID: 151,
    // groupID: 23,
    // episodeID: 680

    // 郫县重症环境
    // userID: 11,
    // locID: 212,
    // groupID: 23,
    // episodeID: 2

    // 郫县产科环境
    userID: 10211,
    locID: 151,
    episodeID: 637,
    groupID: 23

    // 郫县市门特环境
    // userID: 3,
    // locID: 366,
    // groupID: 292,
    // episodeID: 6304

    // userID: 11,
    // locID: 212,
    // groupID: 23,
    // episodeID: 680
    // 消化内一登录用户的SS_User ID
    // userID: 10260,
    // locID: 150,
    // 消化内二登录用户的SS_User ID
    // userID: 4687,
    // locID: 200,
    // episodeID: 44,
    // 内分泌科录用户的SS_User ID

    // specifySheetCode: 'DefaultSee',
    // groupID: 276,
    // allPatientChecked: true,
    // episodeID: 1719,
    // userID: 5390,
    // 产科1
    // locID: 236,
    // 产科2
    // userID: 5390,
    // locID: 453,
    // 血液内科
    // userID: 5468,
    // locID: 198,
    // specifySheetCode: 'WZX',
    // allPatientChecked: true,
    // 呼吸内科三四护理单元
    // userID: 5414,
    // locID: 194,
    // 胃肠外科
    // userID: 4852,
    // locID: 221,
    // 风湿免疫用户的SS_User ID
    // userID: 4770,
    // locID: 199,
  }
};
