// import axios from 'axios';
import { runServerMethod } from './runServerMethod';
// import session from './session';

const className = 'Nur.IP.TemperatureMeasureRule';
const findRule = 'findRule';
const findType = 'findType';
const getID = 'getID';
const save = 'save';
const deleteRule = 'delete';
export default {
  className,
  findRule,
  findType,
  getID(code) {
    return runServerMethod(className, getID, code);
  },
  save(valueObject) {
    return runServerMethod(className, save, JSON.stringify(valueObject));
  },
  deleteRule(ID) {
    return runServerMethod(className, deleteRule, ID);
  },
};
