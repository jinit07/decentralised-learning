import React, {useEffect, useState} from 'react';
import "./Certificate.css";
import {useLocation} from "react-router-dom";
import {selectAddressAccount} from "../../authentication/authenticationSlice";
import {useSelector} from "react-redux";

function Certificate() {

    const location = useLocation();

    const  addressAccount = useSelector(selectAddressAccount)

    return (
        <div className={"certificate"}>
            <div className="certificate__background">
                <img src={"../../../../background-certificate.png"} alt={""} />
            </div>
            <div className="certificate__main">
                <p className="certificate__main__name">
                    {location.state.firstName} {location.state.familyName.toUpperCase()}
                </p>
                <p className="certificate__main__course">
                    {location.state.titleCourse}
                </p>
            </div>
            <div className="certificate__about">
                <p className="certificate__about__text1">Secured and Saved with blockchain technology</p>
                <p className="certificate__about__text2">By <i>walid.kheroub@univ-annaba.org</i></p>
            </div>
            <div className="certificate__addressAccount__top">
                {addressAccount}
            </div>
            <div className="certificate__addressAccount__bottom">
                {addressAccount}
            </div>
            <div className="certificate__logo__top">
                <img src={"../../../../logo-white.png"} alt={""} />
            </div>
            <div className="certificate__logo__bottom">
                <img src={"../../../../logo-white.png"} alt={""} />
            </div>
            {/*<p className={"certificate__title"}>*/}
            {/*    <span className={"certification__title__char"}>C</span>*/}
            {/*    <span className={"certification__title__char"}>E</span>*/}
            {/*    <span className={"certification__title__char"}>R</span>*/}
            {/*    <span className={"certification__title__char"}>T</span>*/}
            {/*    <span className={"certification__title__char"}>I</span>*/}
            {/*    <span className={"certification__title__char"}>F</span>*/}
            {/*    <span className={"certification__title__char"}>I</span>*/}
            {/*    <span className={"certification__title__char"}>C</span>*/}
            {/*    <span className={"certification__title__char"}>A</span>*/}
            {/*    <span className={"certification__title__char"}>T</span>*/}
            {/*    <span className={"certification__title__char"}>E</span>*/}
            {/*</p>*/}
            {/*<p className="certificate__text__I">*/}
            {/*    This document declares <strong><i>{location.state.firstName} {location.state.familyName.toUpperCase()}</i></strong> to be certified in <strong>{location.state.titleCourse}</strong>.*/}
            {/*</p>*/}
            {/*<p className="certificate__text__II">*/}
            {/*    The {platformName} platform guarantees the authenticity and validation of this certificate.*/}
            {/*</p>*/}
        </div>
    );
}

export default Certificate;