export async function addBakhshnamehLog(Object, Token) {
    const url = window.apiAddress + "/BakhshnamehLog/addBakhshnamehLog"
    const response = await fetch(
        url,
        {
            method: "POST",
            body: JSON.stringify(Object),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
        }
    );
    const result = await response.json();
    if (result.status == "Success") {
        console.log('RESULT OF ADD NEW Bakhshnameh Log=' + JSON.stringify(result.data));
        return result.data;
    }
    return null;
}

export async function searchBakhshnamehLogByUserId(bakhshnamehId, userId, Token) {
    const url = window.apiAddress + "/BakhshnamehLog/searchBakhshnamehLogByUserId?bakhshnamehId=" + bakhshnamehId + "&userId=" + userId
    const response = await fetch(
        url,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
        }
    );
    const result = await response.json();
    if (result.status == "Success") {
        console.log('RESULT OF Bakhshnameh Log=' + JSON.stringify(result.data));
        return result.data;
    }
    return null;
}