class utils {
    constructor() { }

    lookup = async (from: string, localField: string, foreignField: string,) => {
        return {
            $lookup: {
                from: from,
                localField: localField,
                foreignField: foreignField,
                as: from
            }
        }
    }
}

export const Utils = new utils()