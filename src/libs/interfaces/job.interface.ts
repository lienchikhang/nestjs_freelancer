export interface IJobsCondition {
    id: {
        gt: number
    },
    job_name: {
        contains: string,
    },
    AND: [
        {
            sub_id: number,
        }
    ]
    isDeleted: boolean,
}

export interface IJobsPageCondition {
    job_name: {
        contains: string,
    },
    AND: [
        {
            sub_id: number,
        }
    ]
    isDeleted: boolean,
}

export interface IJobOrder {
    id?: 'asc' | 'desc',
    createdAt?: 'string',
}