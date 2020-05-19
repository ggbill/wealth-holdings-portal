import React from "react"
import "./ragIndicator.scss"

interface InputProps {
    ragStatus: string
    widthPx: number
}

const RagIndicator = (props: InputProps) => {

    console.log(props.widthPx)

    if (props.ragStatus === "Green"){
        return (
            <div style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}} className="rag-circle green"></div>
        )
    }else if (props.ragStatus === "Amber"){
        return (
            <div style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}}  className="rag-circle amber"></div>
        )
    }else{
        return (
            <div style={{width: `${props.widthPx}px`, height: `${props.widthPx}px`}} className="rag-circle red"></div>
        )
    }

    
}

export default RagIndicator