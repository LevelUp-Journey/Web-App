export interface ChallengeResponse {
    id: string;
    teacherId: string;
    name: string;
    description: string;
    experiencePoints: number;
    status: string;
    tags: ChallengeTag[];
}

export interface ChallengeTag {
    id: string;
    name: string;
    color: string;
    iconUrl: string;
}
