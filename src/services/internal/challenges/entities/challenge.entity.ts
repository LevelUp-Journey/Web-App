export interface Challenge {
    id: string;
    teacherId: string;
    name: string;
    description: string; // This is Markdown formatted text
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
