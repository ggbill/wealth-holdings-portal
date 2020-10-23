import React from "react"
import "./ragIndicator.scss"

interface InputProps {
    ragStatus: string
    widthPx: number
}

const RagIndicator = (props: InputProps) => {

    if (props.ragStatus === "Red"){
        return (
            <div style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}} className="rag-circle red"></div>
        )
    }else if (props.ragStatus === "Amber"){
        return (
            <div style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}}  className="rag-circle amber"></div>
        )
    }else{
        //will return green if the ragStatus returns unknown or N/A so 'Complete' activity will always show green
        return (
            <div style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}} className="rag-circle green"></div>
        )
    }

    
}

export default RagIndicator