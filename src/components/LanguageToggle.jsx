import React from 'react'

const LanguageToggle = () => {
  return (
    <div></div>
  )
}

export default LanguageToggle



// import React, { useEffect, useState } from "react";
// import { FiGlobe } from "react-icons/fi";
// import "./LanguageToggle.css";

// /**
//  * - يخزّن اللغة في localStorage تحت المفتاح: "lang"
//  * - يضيف/يزيل dir و lang على <html>
//  */
// export default function LanguageToggle() {
//   const [lang, setLang] = useState("en"); // "en" | "ar"

//   useEffect(() => {
//     const saved = localStorage.getItem("lang");
//     const initial = saved === "ar" ? "ar" : "en";
//     setLang(initial);

//     // apply to <html>
//     document.documentElement.lang = initial;
//     document.documentElement.dir = initial === "ar" ? "rtl" : "ltr";
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("lang", lang);
//     document.documentElement.lang = lang;
//     document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
//   }, [lang]);

//   function toggle() {
//     setLang((l) => (l === "ar" ? "en" : "ar"));
//   }

//   const isAr = lang === "ar";

//   return (
//     <button
//       type="button"
//       className={`langToggle ${isAr ? "isAr" : ""}`}
//       onClick={toggle}
//       aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
//       title={isAr ? "English" : "العربية"}
//     >
//       <span className="ltIcon" aria-hidden="true">
//         <FiGlobe />
//       </span>

//       <span className="ltText">
//         {/* <span className="ltMain">{isAr ? "AR" : "EN"}</span> */}
//         {/* <span className="ltSub">{isAr ? "العربية" : "English"}</span> */}
//       </span>

//       {/* <span className="ltPill" aria-hidden="true">
//         {isAr ? "EN" : "AR"}
//       </span> */}
//     </button>
//   );
// }
