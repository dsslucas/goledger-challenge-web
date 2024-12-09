import { SectionInterface } from "./Interface";

const Section: React.FC<SectionInterface> = (props: SectionInterface) => {
    var className = "";

    if (props.flex) className += "flex ";
    if (props.flex1) className += "flex-1 ";
    //if (props.flexCol) className += "flex-col ";
    if (props.flexRowMobile) className += "xs:flex-row ";  
    if (props.flexRowTablet) className += "md:flex-row ";  
    if (props.flexRowDesktop) className += "xl:flex-row ";  
    
    if (props.flexColMobile) className += "xs:flex-col ";
    if (props.flexColTablet) className += "md:flex-col ";
    if (props.flexColDesktop) className += "xl:flex-col ";
    if (props.itemsCenter) className += "items-center ";
    if (props.justifyCenter) className += "justify-center ";
    if (props.justifyBetween) className += "justify-between ";
    if (props.textCenter) className += "text-center ";
    if (props.sectionInfos) className += "border border-solid border-gray-400 rounded px-2 py-1 shadow-md";
    if (props.gap) className += "gap-2 ";
    if (props.backgroundColor) className += `bg-[${props.backgroundColor}] `;
    if (props.textWhite) className += "text-white ";
    if (props.paddingY2) className += `py-2 `;
    if (props.widthOneFiveDesktop) className += "xl:w-1/5 ";

    return (
        <>
            <section className={className.trim()}>
                {props.children}
            </section>
        </>
    );
}

export default Section;