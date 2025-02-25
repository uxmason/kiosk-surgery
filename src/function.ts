export const maskIdNumber = (idNumber: string) => {
    return idNumber?.slice(0, 6) + "-" + idNumber[6] + "******";
};
