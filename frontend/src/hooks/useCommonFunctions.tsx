const useCommonFunctions = () => {
    const formatConfidenceStatus = (confidenceStatus): string => {
        if (confidenceStatus === "HIGH"){
            return "High Confidence"
        } else if (confidenceStatus === "MEDIUM"){
            return "Medium Confidence"
        } else if (confidenceStatus === "LOW"){
            return "Low Confidence"
        } else if (confidenceStatus === "HOLD"){
            return "On Hold"
        } else{
            return ""
        }
    }

    return {
        formatConfidenceStatus
    };
};
export default useCommonFunctions;