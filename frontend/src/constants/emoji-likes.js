export const getEmoji = (likes) => {
    switch (true) {
        case likes >= 100:
            return "🔥";
        case likes >= 51:
            return "😱";
        case likes >= 11:
            return "😍";
        case likes >= 1:
            return "😊";
        default:
            return "👍";
    }
};
