/* eslint-disable */
var readCard = {
    read() {
        document.write("<script language='javascript' src='../scripts/DHCWeb.OPCommonManageCard.js'></script>");
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', `../scripts/DHCWeb.OPCommonManageCard.js`);
        document.body.appendChild(script);
    }
}
export default readCard;