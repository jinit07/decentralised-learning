import React from 'react';
import "./About.css";
import { LINK_GITHUB, LINK_LINKEDIN, LINK_INSTAGRAM, ORCID_ID, PHONE_NUMBER, UNIV_ANNABA } from "../../config";

function About() {
    return (
        <div className={"about"}>
            <div className="about__contacts">
                <div className="about__contacts__contact">
                    <img src={"about/phone.png"} alt={""} className={"about__contacts__contact__img"} />
                    <p className="about__contacts__contact__text">{PHONE_NUMBER}</p>
                </div>
                <div className="about__contacts__contact">
                <img src={"about/univ-annaba.png"} alt={""} className={"about__contacts__contact__img"} style={{ width: "800px", height: "500px" }} />
                    <p className="about__contacts__contact__text">{UNIV_ANNABA}</p>
                </div>
                <div className="about__contacts__contact">
                    <img src={"about/orcid.png"} alt={""} className={"about__contacts__contact__img"} />
                    <p className="about__contacts__contact__text">{ORCID_ID}</p>
                </div>
            </div>
            <div className="about__links">
                <div className="about__links__link" onClick={() => window.open(LINK_LINKEDIN)}>
                    <img src={"about/linkedin.png"} alt={""} className={"about__links__link__img"} />
                </div>
                <div className="about__links__link" onClick={() => window.open(LINK_INSTAGRAM)}>
                    <img src={"about/instagram.png"} alt={""} className={"about__links__link__img"} />
                </div>
                <div className="about__links__link" onClick={() => window.open(LINK_GITHUB)}>
                    <img src={"about/github.png"} alt={""} className={"about__links__link__img"} />
                </div>
            </div>
        </div>
    );
}

export default About;
