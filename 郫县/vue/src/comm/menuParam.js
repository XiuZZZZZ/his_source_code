/**
 * @description 往页面菜单栏传值 songchao
 * 
 */

/* eslint-disable */
// import session from '../store/api/session';

var menuParam =
{
  selectBedToTMenu: function (episodeID, patientID, canGiveBirth) {
    var frm = parent.document.forms['fEPRMENU'];
    if (frm) {
      frm.EpisodeID.value = episodeID;
      frm.PatientID.value = patientID;
      frm.canGiveBirth.value = canGiveBirth;
    }
  }
}

export default menuParam;