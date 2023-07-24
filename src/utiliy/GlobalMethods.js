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
    var result = [], counter = every;
    for (var i = counter; counter <= customString.length; counter += every) {
        result.unshift(customString.substr(customString.length - counter, every))
    }
    var diff = counter - customString.length;
    var remainder = every - diff;
    if(remainder > 0) 
        { result.unshift(customString.substr(0, remainder)) }        
    return result;
} 

//----------Convert Arabic letter to Persian Letter----------
export function Gfn_ConvertToPersian(str){           
    str=str.replace(/ي/g,"ی");
    str=str.replace(/ك/g,"ک")
    return str;
}

//----------Number Detect----------
export function Gfn_NumberDetect(number){
    let str=number;
    let flag=true;
    for(let i=0;i<str.length;i++)
        if(str.charCodeAt(i)<48 || str.charCodeAt(i)>57)
            flag=false
    return flag;
}