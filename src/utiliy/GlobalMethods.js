import exportFromJSON from "export-from-json";
import jwtdecode from "jwt-decode";
import { DateObject } from "react-multi-date-picker";
import gregorian_fa from "react-date-object/locales/gregorian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import moment from "jalali-moment";

export function Gfn_ExportToExcel(data, file_name) {
  if (data !== null) {
    let fileName = file_name;
    let exportType = "xls";
    exportFromJSON({ data, fileName, exportType });
  } else alert("اطلاعاتی برای خروجی به اکسل وجود ندارد.");
}

export function Gfn_DT2StringSql(dt) {
  let year = dt.getFullYear().toString();
  let month = (dt.getMonth() + 1).toString();
  let day = dt.getDate().toString();
  let hour = dt.getHours().toString();
  let min = dt.getMinutes().toString();
  let sec = dt.getSeconds();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (min.length < 2) min = "0" + min;
  var time = year + "-" + month + "-" + day + " " + hour + ":" + min;
  return time;
}

export function Gfn_BuildValueComboMulti(data) {
  const IDS = data.toString().split(",");
  let temp = [];
  for (let i = 0; i < IDS.length; i++) {
    let obj = { Id: parseInt(IDS[i]) };
    temp.push(obj);
  }
  return temp;
}

export function Gfn_ConvertComboForAll(e, data) {
  const IDS = e.toString().split(",");
  let converting = e;
  if (IDS.includes("0")) {
    let tempIds = [];
    for (let i = 0; i < data.length; i++) tempIds.push(data[i].id);
    converting = tempIds;
  }
  return converting;
}

export function Gfn_BuildValueComboSelectAll(data) {
  const TEMP = data == null ? [] : data;
  let tempPush = [];
  for (let i = 0; i < TEMP.length; i++) {
    let obj = { Id: TEMP[i].id };
    tempPush.push(obj);
  }
  return tempPush;
}

//----------Convert All UniCode Number to English UniCode Number----------
export function Gfn_convertENunicode(number) {
  let str = number;
  str = str
    .toString()
    .replace(String.fromCharCode(1776), String.fromCharCode(48));
  str = str
    .toString()
    .replace(String.fromCharCode(1777), String.fromCharCode(49));
  str = str
    .toString()
    .replace(String.fromCharCode(1778), String.fromCharCode(50));
  str = str
    .toString()
    .replace(String.fromCharCode(1779), String.fromCharCode(51));
  str = str
    .toString()
    .replace(String.fromCharCode(1780), String.fromCharCode(52));
  str = str
    .toString()
    .replace(String.fromCharCode(1781), String.fromCharCode(53));
  str = str
    .toString()
    .replace(String.fromCharCode(1782), String.fromCharCode(54));
  str = str
    .toString()
    .replace(String.fromCharCode(1783), String.fromCharCode(55));
  str = str
    .toString()
    .replace(String.fromCharCode(1784), String.fromCharCode(56));
  str = str
    .toString()
    .replace(String.fromCharCode(1785), String.fromCharCode(57));
  str = str
    .toString()
    .replace(String.fromCharCode(1632), String.fromCharCode(48));
  str = str
    .toString()
    .replace(String.fromCharCode(1633), String.fromCharCode(49));
  str = str
    .toString()
    .replace(String.fromCharCode(1634), String.fromCharCode(50));
  str = str
    .toString()
    .replace(String.fromCharCode(1635), String.fromCharCode(51));
  str = str
    .toString()
    .replace(String.fromCharCode(1636), String.fromCharCode(52));
  str = str
    .toString()
    .replace(String.fromCharCode(1637), String.fromCharCode(53));
  str = str
    .toString()
    .replace(String.fromCharCode(1638), String.fromCharCode(54));
  str = str
    .toString()
    .replace(String.fromCharCode(1639), String.fromCharCode(55));
  str = str
    .toString()
    .replace(String.fromCharCode(1640), String.fromCharCode(56));
  str = str
    .toString()
    .replace(String.fromCharCode(1641), String.fromCharCode(57));
  return str;
}

//----------Convert 4Point To Defference Meter----------
export function Gfn_convertToMeter(lat1, lon1, lat2, lon2) {
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

//----------Comma Seperator for Numbers----------
export function Gfn_numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function Gfn_num3Seperator(customString, every) {
  customString = customString.toString();
  var result = [],
    counter = every;
  for (var i = counter; counter <= customString.length; counter += every) {
    result.unshift(customString.substr(customString.length - counter, every));
  }
  var diff = counter - customString.length;
  var remainder = every - diff;
  if (remainder > 0) {
    result.unshift(customString.substr(0, remainder));
  }
  return result.toString();
}

//----------Convert Arabic letter to Persian Letter----------
export function Gfn_ConvertToPersian(str) {
  str = str.replace(/ي/g, "ی");
  str = str.replace(/ك/g, "ک");
  return str;
}

//----------Number Detect----------
export function Gfn_NumberDetect(number) {
  let flag = false;
  if (number != null) {
    let str = number;
    for (let i = 0; i < str.length; i++)
      if (str.charCodeAt(i) >= 48 || str.charCodeAt(i) <= 57) flag = true;
  }
  return flag;
}

//----------Format Number----------
export function Gfn_FormatNumber(value) {
  return value && value != 0
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "0";
}

//----------Check token expiration----------
export function checkTokenExpire(token) {
  let rtn = false;
  if (token != null) {
    rtn = true;
    const jwtToken = jwtdecode(token);
    if (jwtToken.exp * 1000 < Date.now()) {
      sessionStorage.clear();
      window.location.reload();
      rtn = false;
    }
  }
  return rtn;
}

export function Gfn_AddHours(date, hours, minutes) {
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

export default class StringHelpers {
  static convertNumbersToLatin(input) {
    if (!input) {
      return;
    }
    return input
      .replace(/۰/g, "0")
      .replace(/۱/g, "1")
      .replace(/۲/g, "2")
      .replace(/۳/g, "3")
      .replace(/۴/g, "4")
      .replace(/۵/g, "5")
      .replace(/۶/g, "6")
      .replace(/۷/g, "7")
      .replace(/۸/g, "8")
      .replace(/۹/g, "9")
      .replace(/٠/g, "0")
      .replace(/١/g, "1")
      .replace(/٢/g, "2")
      .replace(/٣/g, "3")
      .replace(/٤/g, "4")
      .replace(/٥/g, "5")
      .replace(/٦/g, "6")
      .replace(/٧/g, "7")
      .replace(/٨/g, "8")
      .replace(/٩/g, "9");
  }
  static formatNumber(value) {
    return value && value != 0
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "0";
  }
  static isNullOrWhitespace(input) {
    if (typeof input === "undefined" || input == null) return true;
    return input.replace(/\s/g, "").length < 1;
  }
  static unFormatMoney(separatedValue) {
    return separatedValue.toString().replaceAll(",", "");
  }
  static setComboBox(name, value, title, id) {
    return { [title]: name, [id]: value };
  }
  static fixErrorDesc(title) {
    // const fixTitle = title?.split("\n")
    if (!title?.includes("\\n\\r")) return title;
    const fixTitle = title?.split("\\n\\r");
    return fixTitle?.map((item) => (
      <div className="text-justify"> {item} </div>
    ));
  }
  static convertDateEn(date) {
    // const getDate = new DateObject();
    const fixDate = new DateObject(new Date(date));
    return fixDate?.format("YYYY-MM-DDTHH:mm:ss.SSS");
  }
  static convertDateEnWithoutTime(date) {
    // const getDate = new DateObject();
    const fixDate = new DateObject(new Date(date));
    return fixDate?.format("YYYY-MM-DD");
  }
  static convertJalaliDateToGregorian = (date) => {
    const fixDate = new DateObject(new Date(date));
    if (date) {
      const temp = moment
        .from(
          `${fixDate?.year}/${fixDate?.month}/${fixDate?.day}`,
          "fa",
          "YYYY/MM/DD"
        )
        .format("YYYY-MM-DDTHH:mm:ss.SSS");
      return temp;
    } else {
      return undefined;
    }
  };
  static fixComboListId(field, data) {
    console.log(field, data);
    const test = data?.some((item) => {
      return item?.id === 0;
    });
    console.log(test);
    if (test) {
      return data?.map((item) => item?.id);
    } else {
      return field?.map((item) => item?.id);
    }
  }
}
