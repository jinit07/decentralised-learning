import React, { useEffect, useState } from 'react';
import "./HomePage.css";
import { imgPathArrayExported } from "../../config";
import { useDispatch } from "react-redux";
import { setIdMyInterval } from "../authentication/authenticationSlice";

function HomePage() {
    const IMG_WIDTH = 1200; // Modified image width
    const [position, setPosition] = useState(0); // State for position
    const [rightDirection, setRightDirection] = useState(true); // State for direction
    const dispatch = useDispatch();
    const imgPathArray = imgPathArrayExported;

    useEffect(() => {
        const idSetInterval = setInterval(() => {
            const allSpan = document.querySelectorAll(".homePage__images__indicator span");
            if (rightDirection) {
                handleMoveRight(allSpan);
            } else {
                handleMoveLeft(allSpan);
            }
        }, 3000);
        dispatch(setIdMyInterval(idSetInterval));
        return () => clearInterval(idSetInterval);
    }, [dispatch, rightDirection]); // Added rightDirection as dependency

    const handleMoveRight = (allSpan) => {
        if (position === imgPathArray.length - 1) {
            setRightDirection(false);
        } else {
            setPosition(prevPosition => prevPosition + 1);
            updateStyles(allSpan);
        }
    };

    const handleMoveLeft = (allSpan) => {
        if (position === 0) {
            setRightDirection(true);
        } else {
            setPosition(prevPosition => prevPosition - 1);
            updateStyles(allSpan);
        }
    };

    const updateStyles = (allSpan) => {
        allSpan[position].style.backgroundColor = "transparent";
        document.querySelector(".homePage__images__wrapper").style.transform = `translateX(-${Math.abs(position * IMG_WIDTH)}px)`;
        allSpan[position].style.backgroundColor = "#fbfbfb";
    };

    return (
        <div className="homePage">
            <div className="homePage__images">
                <div className="homePage__images__wrapper">
                    {imgPathArray.map((imgPath, i) => (
                        <div key={i} className="homePage__images__wrapper__img">
                            <img src={imgPath} alt={imgPath} />
                        </div>
                    ))}
                </div>
                <div className="homePage__images__indicator">
                    {imgPathArray.map(imgPath => (<span key={imgPath}></span>))}
                </div>
            </div>
            <div className="homePage__text">
                <strong>Syndicate</strong> is a learning platform,
                where Every Teacher Can upload their Knowledge,
                Where every Student will get Courses on affordable rate,
                you will obtain a certificate,
                And lots of Knowledge.
            </div>
            <div className="homePage__logo">
                <img src={"Logo-black.png"} alt={""} className={"homePage__logo__img"} />
            </div>
        </div>
    );
}

export default HomePage;
