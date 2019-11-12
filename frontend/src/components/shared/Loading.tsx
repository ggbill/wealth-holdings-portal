import React, { useState, useEffect } from "react"
import { ReactComponent as PacmanSVG } from '../../images/Pacman.svg'

const Loading = () => {

    const [isDisplayLoading, setIsDisplayLoading] = useState(false)

    const timer = setTimeout(() => enableLoading(), 500);

    useEffect(() => {

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
                < PacmanSVG />
                <h2>Loading...</h2>
            </div > : null
        
    )
}

export default Loading