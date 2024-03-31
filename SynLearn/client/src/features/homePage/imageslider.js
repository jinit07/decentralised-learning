
import React from 'react';
import './ImageSlider.css'; // Import the CSS file with styles

const ImageSlider = () => {
    const imageUrl = "./images-homePage/img8.png"; // Keep only img8.png

    return (
        <div className="image-container">
            <img
                src={imageUrl}
                alt="Image"
                className="active" // Add the "active" class to show the image
            />
        </div>
    );
};

export default ImageSlider;