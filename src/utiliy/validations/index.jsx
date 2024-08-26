import StringHelpers from "../../utiliy/GlobalMethods";
// import moment from "jalali-moment";

const Validation = {
  required: (value, message = null) =>
    // alert("dddd"),
    value === 0 || !!value || message || "پرکردن این فیلد الزامی است",
  digits: (value, length) => {
    if (!value) {
      return true;
    }
    return value.length === length || ` یک مقدار عددی ${length} رقمی وارد کنید`;
  },
  decimal: (value, decimalLenght) => {
    if (!value) {
      return true;
    }
    // return (
    //   (value >= 0 &&
    //     (value * Math.pow(10, Number(decimalLenght))).toFixed(8) % 1 === 0) ||
    //   (decimalLenght === 0
    //     ? `عدد صحیح نامنفی وارد نمایید`
    //     : `عدد صحیح نامنفی یا اعشاری (تا ${decimalLenght} رقم اعشار) وارد نمایید.`)
    // );
    return (
      (value >= 0 &&
        !(value?.toString().split(".")[1]?.length > decimalLenght)) ||
      (decimalLenght === 0
        ? `عدد صحیح مثبت وارد نمایید`
        : `عدد نامنفی صحیح یا اعشاری (تا ${decimalLenght} رقم اعشار) وارد نمایید.`)
    );
  },
  newDecimal: (value, decimalLenght) => {
    if (!value) {
      return true;
    }
    return (
      (value >= 0 &&
        !(value?.toString().split(".")[1]?.length > decimalLenght)) ||
      // (value * Math.pow(10, Number(decimalLenght))).toFixed(8) % 1 === 0) ||
      (decimalLenght === 0
        ? `عدد صحیح نامنفی وارد نمایید`
        : `عدد نامنفی صحیح یا اعشاری (تا ${decimalLenght} رقم اعشار) وارد نمایید.`)
    );
  },
  minLength: (value, length) => {
    if (!value) {
      return true;
    }
    return (
      (value ? value.trim() : "").length >= length ||
      `حداقل ${length} کاراکتر وارد نمایید`
    );
  },
  maxLength: (value, length) => {
    if (!value) {
      return true;
    }
    return (
      (value ? value.trim() : "").length <= length ||
      `حداکثر ${length} کاراکتر وارد نمایید`
    );
  },
  maxValue: (value, maximumNumber, message = undefined) =>
    (Number(value) || 0) <= (Number(maximumNumber) || 0) ||
    (message ? message : ` مقدار مجاز کوچکتر از ${maximumNumber + 1} می باشد`),

  minValue: (value, mainimumNumber, message = undefined) =>
    (Number(value) || 0) >= (Number(mainimumNumber) || 0) ||
    (message ? message : `حداقل مقدار مجاز ${mainimumNumber} می باشد`),

  date: (value) =>
    RegExp(
      "^(?:(12|13|14)[0-9]{2})[/.](0[1-9]|1[012])[/.](0[1-9]|[12][0-9]|3[01])$"
    ).test(StringHelpers.convertNumbersToLatin(value)) ||
    "تاریخ وارد شده صحیح نمیباشد",

  year: (value) => {
    if (!value) {
      return true;
    }
    return (
      RegExp("^(?:(12|13|14)[0-9]{2})$").test(
        StringHelpers.convertNumbersToLatin(value)
      ) || "سال وارد شده صحیح نمیباشد"
    );
  },
  nationalCode: (value) => {
    const nationalCode = value
      ? StringHelpers.convertNumbersToLatin(value.trim())
      : "";

    if (nationalCode === "") {
      return true;
    }

    if (
      nationalCode === "" ||
      nationalCode.length !== 10 ||
      isNaN(parseInt(nationalCode, 10))
    ) {
      return "کد ملی وارد شده صحیح نمی باشد";
    }

    const allDigitsAreEqual = [
      "0000000000",
      "1111111111",
      "2222222222",
      "3333333333",
      "4444444444",
      "5555555555",
      "6666666666",
      "7777777777",
      "8888888888",
      "9999999999",
    ];

    if (allDigitsAreEqual.indexOf(nationalCode) >= 0) {
      return "کد ملی وارد شده صحیح نمی باشد";
    }

    const num0 = parseInt(nationalCode[0], 10) * 10;
    const num2 = parseInt(nationalCode[1], 10) * 9;
    const num3 = parseInt(nationalCode[2], 10) * 8;
    const num4 = parseInt(nationalCode[3], 10) * 7;
    const num5 = parseInt(nationalCode[4], 10) * 6;
    const num6 = parseInt(nationalCode[5], 10) * 5;
    const num7 = parseInt(nationalCode[6], 10) * 4;
    const num8 = parseInt(nationalCode[7], 10) * 3;
    const num9 = parseInt(nationalCode[8], 10) * 2;
    const a = parseInt(nationalCode[9], 10);

    const b = num0 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9;
    const c = b % 11;

    return (
      (c < 2 && a === c) ||
      (c >= 2 && 11 - c === a) ||
      "کد ملی وارد شده صحیح نمی باشد"
    );
  },

  fileSize: (value, maxFileSizeInKB) => {
    if (!value) {
      return true;
    }

    if (Array.isArray(value)) {
      for (const file of value) {
        if (file.size > maxFileSizeInKB * 1000) {
          return `حداکثر حجم فایل باید ${maxFileSizeInKB} کیلوبایت باشد`;
        }
      }
    } else if (value.size > maxFileSizeInKB * 1000) {
      return `حداکثر حجم فایل باید ${maxFileSizeInKB} کیلوبایت باشد`;
    }

    return true;
  },
  fileFormat: (file, formats, validformats) =>
    formats?.includes(file?.type) ||
    (file && file?.name?.endsWith(".rar")) ||
    (file && file?.name?.endsWith(".zip")) ||
    (file && file?.name?.endsWith(".7z")) ||
    (file && file?.name?.toLowerCase()?.endsWith(".yz")) ||
    ` فرمت مجاز ${validformats} میباشد`,

  postCode: (value) => {
    const postCode = value
      ? StringHelpers.convertNumbersToLatin(value.trim())
      : "";

    if (postCode === "") {
      return "کد پستی وارد شده صحیح نمی باشد";
    }

    if (postCode.length !== 10 || !RegExp(/^\d+$/).test(postCode)) {
      return "کد پستی وارد شده صحیح نمی باشد";
    }

    const firstFiveDigits = postCode.substring(0, 5);

    if (
      firstFiveDigits.indexOf("0") > -1 ||
      firstFiveDigits.indexOf("2") > -1 ||
      postCode[4] === "5" ||
      postCode[5] === "0" ||
      postCode.substring(6, 10) === "0000"
    ) {
      return "کد پستی وارد شده صحیح نمی باشد";
    }

    return true;
  },

  phoneNumber: (value) => {
    const phoneNumber = value
      ? StringHelpers.convertNumbersToLatin(value.trim())
      : "";

    if (phoneNumber === "") {
      return true;
    }

    if (
      phoneNumber.length !== 11 ||
      !RegExp(/^\d+$/).test(phoneNumber) ||
      phoneNumber[0] !== "0" ||
      phoneNumber[1] !== "9"
    ) {
      return "شماره تلفن همراه وارد شده صحیح نمی باشد";
    }

    return true;
  },

  isFileRequired: (value, fileName) => {
    if (!fileName && !!!value) {
      return "پرکردن این فیلد الزامی است";
    }
    return true;
  },

  email: (value) => {
    const email = value
      ? StringHelpers.convertNumbersToLatin(value.trim())
      : "";

    if (email === "") {
      return true;
    }

    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "ایمیل وارد شده صحیح نمیباشد";
  },
  serialNumber: (value) => {
    if (!value) {
      return true;
    }
    const pattern = /^(?=.{8,16}$)[0-9]{5}-[A-Za-z0-9_.]{2,10}$/;
    return pattern.test(value) || "سریال وارد شده صحیح نمیباشد";
  },
  legalNationalCode: (value) => {
    if (!value) {
      return true;
    }

    const L = value.length;

    if (L < 11 || parseInt(value, 10) === 0) {
      return "شناسه ملی وارد شده صحیح نمی باشد";
    }

    if (parseInt(value.substr(3, 6), 10) === 0) {
      return "شناسه ملی وارد شده صحیح نمی باشد";
    }

    const c = parseInt(value.substr(10, 1), 10);
    const d = parseInt(value.substr(9, 1), 10) + 2;
    const z = new Array(29, 27, 23, 19, 17);
    let s = 0;
    for (let i = 0; i < 10; i++) {
      s += (d + parseInt(value.substr(i, 1), 10)) * z[i % 5];
    }
    s = s % 11;
    if (s === 10) {
      s = 0;
    }
    return c === s;
  },
  legalNationalCodeOrNationalCode: (value) => {
    if (!value) {
      return true;
    }
    // شناسه ملی
    const c = parseInt(value.substr(10, 1), 10);
    const d = parseInt(value.substr(9, 1), 10) + 2;
    const z = new Array(29, 27, 23, 19, 17);
    let s = 0;
    for (let i = 0; i < 10; i++) {
      s += (d + parseInt(value.substr(i, 1), 10)) * z[i % 5];
    }
    s = s % 11;
    if (s === 10) {
      s = 0;
    }
    // کدملی
    const nationalCode = value
      ? StringHelpers.convertNumbersToLatin(value.trim())
      : "";
    const allDigitsAreEqual = [
      "0000000000",
      "1111111111",
      "2222222222",
      "3333333333",
      "4444444444",
      "5555555555",
      "6666666666",
      "7777777777",
      "8888888888",
      "9999999999",
    ];

    if (allDigitsAreEqual.indexOf(nationalCode) >= 0) {
      return "کد/شناسه ملی وارد شده صحیح نمیباشد";
    }
    const num0 = parseInt(nationalCode[0], 10) * 10;
    const num2 = parseInt(nationalCode[1], 10) * 9;
    const num3 = parseInt(nationalCode[2], 10) * 8;
    const num4 = parseInt(nationalCode[3], 10) * 7;
    const num5 = parseInt(nationalCode[4], 10) * 6;
    const num6 = parseInt(nationalCode[5], 10) * 5;
    const num7 = parseInt(nationalCode[6], 10) * 4;
    const num8 = parseInt(nationalCode[7], 10) * 3;
    const num9 = parseInt(nationalCode[8], 10) * 2;
    const a = parseInt(nationalCode[9], 10);

    const b = num0 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9;
    const cc = b % 11;

    return (
      c === s ||
      (cc < 2 && a === cc) ||
      (cc >= 2 && 11 - cc === a) ||
      "کد/شناسه ملی وارد شده صحیح نمیباشد"
    );
  },
  // minimumDate: (value, minDate) => {
  //   if (!value || !minDate) {
  //     return true;
  //   }
  //   const date1 = moment
  //     .from(`${value?.year}/${value?.month}/${value?.day}`, "fa", "YYYY/M/D ")
  //     .format("YYYY-MM-DD");
  //   const date2 = moment
  //     .from(
  //       `${minDate?.year}/${minDate?.month}/${minDate?.day}`,
  //       "fa",
  //       "YYYY/M/D "
  //     )
  //     .format("YYYY-MM-DD");
  //   return (
  //     date1 >= date2 ||
  //     `تاریخ انتخاب شده از ${minDate?.year}/${minDate?.month}/${minDate?.day} نمیتواند کوچکتر باشد`
  //   );
  // },
  // maximumDate: (value, maxDate) => {
  //   if (!value || !maxDate) {
  //     return true;
  //   }
  //   const date1 = moment
  //     .from(`${value?.year}/${value?.month}/${value?.day}`, "fa", "YYYY/M/D ")
  //     .format("YYYY-MM-DD");
  //   const date2 = moment
  //     .from(
  //       `${maxDate?.year}/${maxDate?.month}/${maxDate?.day}`,
  //       "fa",
  //       "YYYY/M/D "
  //     )
  //     .format("YYYY-MM-DD");
  //   return (
  //     date2 >= date1 ||
  //     `تاریخ انتخاب شده از ${maxDate?.year}/${maxDate?.month}/${maxDate?.day} نمیتواند بزرگتر باشد`
  //   );
  // },
  dateRange: (message) => message || "تاریخ در بازه‌ی قابل انتخاب نیست",
};

export default Validation;
