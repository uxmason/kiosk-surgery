export const maskIdNumber = (idNumber: string) => {
    return idNumber?.slice(0, 6) + "-" + idNumber[6] + "******";
};
export const removeSpace = (str: string) => {
    return str.replace(/\s/g, "");
};
