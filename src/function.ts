export const maskIdNumber = (idNumber: string) => {
    return idNumber?.slice(0, 6) + "-" + idNumber[6] + "******";
};
export const removeSpace = (str: string) => {
    return str.replace(/\s/g, "");
};
export const formatTime = (time: string) => {
    const hours = time?.substring(0, 2);
    const minutes = time?.substring(2, 4);

    return `${hours}:${minutes}`;
};

export const formatDate = () => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    return `${yy}.${mm}.${dd} ${hh}:${min}`;
};
export const getFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
};
export const getCurrentTimeHHMM = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}${minutes}`;
};
// 키오스크에 등록된 의사 찾기
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
