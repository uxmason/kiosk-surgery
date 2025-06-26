import { ErrorMessageDataType } from "./type";

export const maskIdNumber = (idNumber: string) => {
    return idNumber?.slice(0, 6) + "-" + idNumber[6] + "******";
};
export const removeSpace = (str: string) => {
    return str.replace(/\s/g, "");
};
export const returnDoubleFormatNumber = (num: number) => {
    if (num > 9) {
        return num.toString();
    } else {
        return "0" + num;
    }
};
export const formatTime = (time: string) => {
    const hours = time?.substring(0, 2);
    const minutes = time?.substring(2, 4);

    return `${hours}:${minutes}`;
};
export const formatDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Seoul",
        hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat("ko-KR", options)
        .format(now)
        .replace(/\./g, ".")
        .replace(/\s/g, " ")
        .replace(/,/g, "");

    return formattedDate;
};
export const getFormattedDate = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const [{ value: year }, , { value: month }, , { value: day }] =
        formatter.formatToParts(now);

    return `${year}${month}${day}`;
};
export const getCurrentTimeHHMM = () => {
    const now = new Date();
    const koreaTime = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(now);

    return koreaTime.replace(":", "");
};
// 키오스크의 고유번호의 유효성&등록된 의사 정보
export const handleSelectDoctor = async (deviceId: string) => {
    try {
        const response = await fetch(
            `/api/kiosk-surgery/check-device?deviceId=${deviceId}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
// 에러 메세지 등록
export const updateErrorMessage = async (data: ErrorMessageDataType) => {
    const url = "/api/kiosk-surgery/log/error/";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error("API 호출 실패", response.status);
        }
    } catch (error) {
        console.error("에러 발생", error);
    }
};
export const handleBirthToAge = (rrn: string | undefined) => {
    if (!rrn) return;
    if (!/^\d{13}$/.test(rrn)) {
        throw new Error("올바른 주민등록번호 형식이 아닙니다. (13자리 숫자)");
    }

    let birthYear: number = parseInt(rrn.substring(0, 2), 10);
    const birthMonth: number = parseInt(rrn.substring(2, 4), 10);
    const birthDay: number = parseInt(rrn.substring(4, 6), 10);
    const firstDigit: number = parseInt(rrn.charAt(6), 10);

    if ([1, 2, 5, 6].includes(firstDigit)) {
        birthYear += 1900;
    } else if ([3, 4, 7, 8].includes(firstDigit)) {
        birthYear += 2000;
    } else if ([9, 0].includes(firstDigit)) {
        birthYear += 1800;
    } else {
        throw new Error("유효하지 않은 주민등록번호입니다.");
    }

    const birthDate: Date = new Date(birthYear, birthMonth - 1, birthDay);
    const today: Date = new Date();

    const ageInMilliseconds: number = today.getTime() - birthDate.getTime();
    const ageInYears: number =
        ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    return ageInYears.toFixed(1);
};
export const getKoreanAge = (rrn: string) => {
    if (!rrn) return;

    let birthYear = parseInt(rrn.substring(0, 2), 10);
    const firstDigit = parseInt(rrn.charAt(6), 10);

    if (
        firstDigit === 1 ||
        firstDigit === 2 ||
        firstDigit === 5 ||
        firstDigit === 6
    ) {
        birthYear += 1900;
    } else if (
        firstDigit === 3 ||
        firstDigit === 4 ||
        firstDigit === 7 ||
        firstDigit === 8
    ) {
        birthYear += 2000;
    } else if (firstDigit === 9 || firstDigit === 0) {
        birthYear += 1800;
    } else {
        throw new Error("유효하지 않은 주민등록번호입니다.");
    }

    const today = new Date();
    today.setHours(today.getHours() + 9);
    const currentYear = today.getFullYear();

    const koreanAge = currentYear - birthYear + 1;

    return koreanAge;
};
export const formatDateToYYMMDD = (date: string) => {
    const yy = date.slice(2, 4);
    const mm = date.slice(5, 7);
    const dd = date.slice(8, 10);
    return `${yy}.${mm}.${dd}`;
};
