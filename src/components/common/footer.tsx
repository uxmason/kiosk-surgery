interface Props {
    isOther?: boolean;
}
const Footer = ({ isOther }: Props) => {
    return (
        <div
            className={`absolute w-full
        ${isOther ? "mb-[52px] bottom-0" : "mt-[1820px]"}
        `}
        >
            <p className="text-white whitespace-pre-line text-center font-normal leading-6">
                문의 및 안내:{" "}
                <span className="underline underline-offset-2">HOBIT</span> Lab.
                정명화 과장
                <br />ⓒ 365mc. 2025
            </p>
        </div>
    );
};
export default Footer;
