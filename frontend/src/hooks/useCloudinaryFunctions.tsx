const useCloudinaryFuctions = () => {

    const generateThumbnailUrl = (videoUrl: string): string => {
        return `${videoUrl.substring(0, videoUrl.lastIndexOf(".") + 1)}jpg`
    }

    const isAudioFormat = (format: string): boolean => {
        if (format === "aac" ||
            format === "aiff" ||
            format === "amr" ||
            format === "flac" ||
            format === "m4a" ||
            format === "mp3" ||
            format === "ogg" ||
            format === "opus" ||
            format === "wav") {
            return true
        } else {
            return false
        }
    }

    const isPDFFormat = (format: string): boolean => {
        if (format === "pdf") {
            return true
        } else {
            return false
        }
    }

    return {
        generateThumbnailUrl,
        isAudioFormat,
        isPDFFormat
    };
};
export default useCloudinaryFuctions;