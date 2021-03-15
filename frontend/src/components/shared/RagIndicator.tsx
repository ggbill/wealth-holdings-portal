import React from "react"
import "./ragIndicator.scss"

interface InputProps {
    ragStatus: string
    widthPx: number
}

const RagIndicator = (props: InputProps) => {
    if (props.ragStatus === "LOW"){
        return (
            <div title="Low Confidence" style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}} className="rag-circle red"></div>
        )
    }else if (props.ragStatus === "MEDIUM"){
        return (
            <div title="Medium Confidence" style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}}  className="rag-circle amber"></div>
        )
    }else if (props.ragStatus === "HOLD"){
        return (
            <div title="On Hold" style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}}  className="rag-circle grey"></div>
        )
    }else{
        //will return green if the ragStatus returns unknown or N/A so 'Complete' activity will always show green
        return (
            <div title="High Confidence" style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}} className="rag-circle green"></div>
        )
    }
}

export default RagIndicator