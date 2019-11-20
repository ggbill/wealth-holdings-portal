import React, { useState, useEffect } from "react"
import { ReactComponent as PacManSVG } from '../../images/Pacman.svg'

const Loading = () => {

    const [isDisplayLoading, setIsDisplayLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => enableLoading(), 500);

        //same as componentWillUnmount
        return () => {
            clearTimeout(timer);
        };
    }, []);

    const enableLoading = () => {
        setIsDisplayLoading(true)
    }

    return (

        isDisplayLoading ?
            <div className="loading-wrapper content">
                < PacManSVG />
                <h2>Loading...</h2>
            </div > : null
        
    )
}

export default Loading