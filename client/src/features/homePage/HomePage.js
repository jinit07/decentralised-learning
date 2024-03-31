
import React, { useEffect, useState } from 'react';
import "./HomePage.css";
import { imgPathArrayExported } from "../../config";
import { useDispatch } from "react-redux";
import { setIdMyInterval } from "../authentication/authenticationSlice";
import ImageSlider from './imageslider';

function HomePage() {
    const IMG_WIDTH = 400; // Modified image width
    const IMG_HEIGHT = 5000; // Added image height
    const [position, setPosition] = useState(0); // State for position
    const dispatch = useDispatch();
    const imgPathArray = imgPathArrayExported;

    useEffect(() => {
        let rightDirection = true; // Initialize the direction
        const idSetInterval = setInterval(() => {
            const newPosition = rightDirection ? (position + 1) % imgPathArray.length : (position - 1 + imgPathArray.length) % imgPathArray.length;
            setPosition(newPosition);
            rightDirection = newPosition === imgPathArray.length - 1 ? false : newPosition === 0 ? true : rightDirection; // Change direction if necessary
        }, 3000); // Interval between image switching is 3 seconds

        dispatch(setIdMyInterval(idSetInterval));
        return () => clearInterval(idSetInterval);
    }, [position, dispatch, imgPathArray.length]); // Added position and imgPathArray.length as dependencies

    return (
        <div className="homePage">
            <ImageSlider />
            
            <div className="homePage__logo">
                <img src={"Logo-black.png"} alt={""} className={"homePage__logo__img"} />
            </div>
            <div className="homePage__text">
                <strong>Syndicate</strong> is a learning platform,
                where Every Teacher Can upload their Knowledge,
                Where every Student will get Courses on affordable rate,
                you will obtain a certificate,
                And lots of Knowledge.
            </div>
        </div>
    );
}

export default HomePage;
