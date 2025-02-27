export const maskIdNumber = (idNumber: string) => {
    return idNumber?.slice(0, 6) + "-" + idNumber[6] + "******";
};
export const removeSpace = (str: string) => {
    return str.replace(/\s/g, "");
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
