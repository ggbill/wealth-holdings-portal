import React, { useState, useEffect } from "react"
import "./loading.scss"

// interface InputProps {
//     breadcrumbs?: any
// }

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
        <div className="content">
            {isDisplayLoading ?
                <div className="loading-wrapper">
                    <img className="logo" alt="logo" src={require("../../images/dancing_minion.gif")} />
                    <h2>Loading...</h2>
                </div > : null
            }
        </div>

    )
}

export default Loading