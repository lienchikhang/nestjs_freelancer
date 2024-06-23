export interface IJobsCondition {
    id: {
        gt: number
    },
    job_name: {
        contains: string,
    },
    // AND: [
    //     {
    //         sub_id: number,
    //         Services: {
    //             some: {
    //                 delivery_date: number,
    //             }
    //         }
    //     }
    // ]
    sub_id: number,
    Services: {
        some: {
            delivery_date?: number,
            price?: {
                lte: number,
            }
        }
    },
    isDeleted: boolean,
}

export interface IJobsPageCondition {
    job_name: {
        contains: string,
    },
    // AND: [
    //     {
    //         sub_id: number,
    //     }
    // ]
    sub_id: number,
    Services: {
        some: {
            delivery_date?: number,
            price?: {
                lte: number,
            }
        }
    },
    isDeleted: boolean,
}

export interface IJobOrder {
    id?: 'asc' | 'desc',
    createdAt?: 'string',
}