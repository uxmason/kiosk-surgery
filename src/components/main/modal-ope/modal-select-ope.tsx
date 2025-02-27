"use client";
import { useState } from "react";
import { CustomModal } from "../../common";
import { ModalError} from ".";
// import _ from "lodash";
// import { useDoctorIdStore } from "@/store";

interface SurgeryItem {
    지점코드: string;
    지점명: string;
    시작시간: string;
    종료시간: string;
    고객번호: string;
    수술코드: string;
    담당의ID: string;
    담당의명: string;
    수술부위: string;
    예상시간: number;
    고객명: string;
    주민번호: string;
    추가시간: number | null;
    state: string | null;
}
interface DoctorItem {
    doctorId: string;
    surgeries: SurgeryItem[];
}
  
interface DataAllOpeItem {
    branch: string;
    doctor: DoctorItem[];
}

interface Props {
    isOpen: boolean;
    setOpeOpen: (v: boolean) => void;
    dataAllOpe: DataAllOpeItem[];
}

const ModalSelecOpe = ({ isOpen, setOpeOpen, dataAllOpe }: Props) => {
    // const { doctorId, branch } = useDoctorIdStore();
    const [hospitalIndex, setHospitalIndex] = useState(0);
    const [doctorIndex, setDoctorIndex] = useState(0);
    const [isErrorMessage, setIsErrorMessage] = useState(false);

    // const groupedByBranch = _.groupBy(dataAllOpe, "지점");
    // const finalGroupedData = Object.entries(groupedByBranch).map(
    //     ([branch, branchData]) => ({
    //         branch,
    //         doctors: Object.entries(_.groupBy(branchData, "담당의ID")),
    //     })
    // );

    return (
        <>
            <CustomModal isOpen={isOpen} onClose={() => {setOpeOpen(false)}}>
                <div className="flex flex-col w-full items-center">
                    <p className="text-white text-[54px] font-bold leading-[54px] mt-20">
                        수술 고객 선택
                    </p>
                    <div className="flex w-full pt-[66px] gap-x-5">
                        <div className="relative w-full max-w-[580px] min-h-[1200px] h-full bg-[rgba(58,62,89,0.25)] rounded-[15px] pl-5 pr-[25px]">
                            <div className="absolute w-full h-full max-h-[1200px] mt-[45px]">
                            {Array.from({ length: 12 }, (_, i) => {
                                const time = i + 9;
                                const formatTime = i === 0 ? `0${time}:00` : `${time}:00`;
                                return (
                                    <div key={time} className={`relative flex w-[530px] ${i==11 ? 'h-[50px]' : 'h-[100px]'}`}>
                                        <p className="text-white/50 text-[13px] font-bold leading-[13px] w-10">
                                            {formatTime}
                                        </p>
                                        <div className="w-full ml-[10px] mt-[5px] border-t-[1px] border-[white]/20 border-dashed" />
                                    </div>
                                );
                            })}
                            </div>
                            {(dataAllOpe?.[hospitalIndex]?.doctor?.[doctorIndex]?.surgeries ?? []).map((item, index) => {
                                return (
                                    <div key={index}
                                        className={`absolute p-[20px] bg-[#ffffff05] text-white rounded-[15px] left-[75px] w-[470px]`} style={{top: 60 + (Number(item.시작시간.substring(0,2))-9)*100 + Number(item.시작시간.substring(2,4))/60*100+'px', height: Number(item.예상시간)*100-20 +'px'}}>
                                        {item.시작시간} {Number(item.예상시간)*100} 
                                    </div>)
                                }
                            )}
                        </div>
                        <div className="flex flex-col w-full max-w-[300px] gap-y-5">
                            <div className={`flex flex-col w-full gap-y-[10px] transition-all duration-300 bg-[rgba(58,62,89,0.25)] rounded-[15px] px-[15px] py-[15px]`}>
                                {dataAllOpe.map((item, index) => (
                                    <div key={index}
                                        className={`flex items-center w-[270px] h-[70px] transition-all duration-300 rounded-[10px] py-5 cursor-pointer ${index == hospitalIndex ? 'border-solid border-[4px] border-[#15CF8F] bg-[#3A3E59] px-[21px]' : 'bg-[rgba(58,62,89,.25)] px-[25px]'} z-1`}
                                        onClick={() => {
                                            setHospitalIndex(index);
                                        }}>
                                        <p className="text-white text-[22px] font-bold leading-[30px]">{item?.['branch']}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className={`flex flex-col w-full h-full gap-y-[10px] px-[15px] py-[15px] transition-all duration-300 bg-[rgba(58,62,89,0.25)] rounded-[15px]`}>
                                {(dataAllOpe[hospitalIndex]?.doctor ?? []).map((item, index) => {
                                    return (
                                        <div key={index}
                                            className={`flex relative box-border w-[270px] h-[100px] text-white  rounded-[10px] transition-all duration-300 cursor-pointer ${doctorIndex == index ? 'border-solid border-[4px] border-[#15CF8F] bg-[#3A3E59] pt-[6px] px-[6px]' : 'bg-[rgba(58,62,89,.25)] pt-[10px] px-[10px]'}`}
                                            onClick={() => {
                                                setDoctorIndex(index);
                                            }}>
                                            <div className="flex flex-col pl-[85px] pt-[15px] gap-y-[13px]">
                                                <p className="text-[22px] font-bold leading-[22px]">
                                                    {item.surgeries[0].담당의명} <span className="font-[250]">원장</span>
                                                </p>
                                                <p className="text-[14px] font-light leading-[14px]">
                                                    오늘 수술: <span className="text-[16px] font-bold mx-1">
                                                        {item.surgeries.length}
                                                    </span>건
                                                </p>
                                            </div>
                                        </div>
                                    )})
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </CustomModal>
            <ModalError
                isErrorOpen={isErrorMessage}
                setIsErrorOpen={setIsErrorMessage}
            />
        </>
    );
};

export default ModalSelecOpe;