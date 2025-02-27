interface Props {
    isOther?: boolean;
}
const Footer = ({ isOther }: Props) => {
    return (
        <div
            className={`absolute flex justify-center w-full
        ${isOther ? "mt-[400px] pb-[52px]" : "mt-[1820px]"}
        `}
        >
            <p className="text-white whitespace-pre-line text-center font-normal leading-6 text-[14px]">
                문의 및 안내:{" "}
                <span className="underline underline-offset-2">HOBIT</span> Lab.
                정명화 과장
                <br />ⓒ 365mc. 2025
            </p>
        </div>
    );
};
export default Footer;
