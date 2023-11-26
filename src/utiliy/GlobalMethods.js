import exportFromJSON from 'export-from-json'


export function Gfn_ExportToExcel (data,file_name)  {       
    if (data!==null) {
        let fileName = file_name
        let exportType = 'xls'
        exportFromJSON({ data, fileName, exportType })
    }
    else
        alert('اطلاعاتی برای خروجی به اکسل وجود ندارد.')    

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
    var time =
        year + "-" + month + "-" + day + " " + hour + ":" + min ;
    return time
}

export function Gfn_BuildValueComboMulti(data){
    const IDS=data.toString().split(',');    
    let temp=[];
    for(let i=0;i<IDS.length;i++){
        let obj={ Id: parseInt(IDS[i])}
        temp.push(obj);
    }
    return temp;
}


export function Gfn_ConvertComboForAll(e,data){
    const IDS = e.toString().split(",");   
    let converting=e;
    if(IDS.includes('0')){
      let tempIds=[];
      for(let i=0;i<data.length;i++)
        tempIds.push(data[i].id)      
      converting=tempIds
    }  
    return converting;
}

export function Gfn_BuildValueComboSelectAll(data){
    const TEMP=data==null ? [] : data;
    let tempPush=[]    
    for(let i=0;i<TEMP.length;i++){        
        let obj={ Id: TEMP[i].id}
        tempPush.push(obj);
    }
    return tempPush;
    
}

//----------Convert All UniCode Number to English UniCode Number----------
export function Gfn_convertENunicode(number){
    let str=number;
    str=str.replace(String.fromCharCode(1776),String.fromCharCode(48));
    str=str.replace(String.fromCharCode(1777),String.fromCharCode(49));
    str=str.replace(String.fromCharCode(1778),String.fromCharCode(50));
    str=str.replace(String.fromCharCode(1779),String.fromCharCode(51));
    str=str.replace(String.fromCharCode(1780),String.fromCharCode(52));
    str=str.replace(String.fromCharCode(1781),String.fromCharCode(53));
    str=str.replace(String.fromCharCode(1782),String.fromCharCode(54));
    str=str.replace(String.fromCharCode(1783),String.fromCharCode(55));
    str=str.replace(String.fromCharCode(1784),String.fromCharCode(56));
    str=str.replace(String.fromCharCode(1785),String.fromCharCode(57));
    str=str.replace(String.fromCharCode(1632),String.fromCharCode(48));
    str=str.replace(String.fromCharCode(1633),String.fromCharCode(49));
    str=str.replace(String.fromCharCode(1634),String.fromCharCode(50));
    str=str.replace(String.fromCharCode(1635),String.fromCharCode(51));
    str=str.replace(String.fromCharCode(1636),String.fromCharCode(52));
    str=str.replace(String.fromCharCode(1637),String.fromCharCode(53));
    str=str.replace(String.fromCharCode(1638),String.fromCharCode(54));
    str=str.replace(String.fromCharCode(1639),String.fromCharCode(55));
    str=str.replace(String.fromCharCode(1640),String.fromCharCode(56));
    str=str.replace(String.fromCharCode(1641),String.fromCharCode(57));
    return str
}

//----------Convert 4Point To Defference Meter----------
export function Gfn_convertToMeter(lat1, lon1, lat2, lon2){  
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

//----------Comma Seperator for Numbers----------
export function Gfn_num3Seperator(customString,every){ 
    customString=customString.toString();                                   
    var result = [], counter = every;
    for (var i = counter; counter <= customString.length; counter += every) {
        result.unshift(customString.substr(customString.length - counter, every))
    }
    var diff = counter - customString.length;
    var remainder = every - diff;
    if(remainder > 0) 
        { result.unshift(customString.substr(0, remainder)) }        
    return result.toString();
} 

//----------Convert Arabic letter to Persian Letter----------
export function Gfn_ConvertToPersian(str){           
    str=str.replace(/ي/g,"ی");
    str=str.replace(/ك/g,"ک")
    return str;
}

//----------Number Detect----------
export function Gfn_NumberDetect(number){
    let flag=false;
    if(number !=null){
        let str=number;        
        for(let i=0;i<str.length;i++)
            if(str.charCodeAt(i)>=48 || str.charCodeAt(i)<=57)
                flag=true;
    }
    return flag;
}