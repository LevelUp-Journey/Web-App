export interface TotalUsersResponse {
    total_users: number;
}

export interface DailyKPI {
    date: string;
    total_executions?: number;
    total_users?: number;
    total_challenges?: number;
    [key: string]: any;
}

export interface LanguageKPI {
    language: string;
    total_executions?: number;
    avg_execution_time_ms?: number;
    success_rate?: number;
    [key: string]: any;
}

export interface StudentKPI {
    student_id: string;
    total_executions?: number;
    total_challenges_completed?: number;
    avg_execution_time_ms?: number;
    success_rate?: number;
    [key: string]: any;
}

export interface TopFailedChallenge {
    challenge_id: string;
    total_executions: number;
    success_rate: number;
    avg_execution_time_ms: number;
}

export interface AnalyticsKPIs {
    totalUsers: number;
    dailyKPIs: DailyKPI[];
    languageKPIs: LanguageKPI[];
    topFailedChallenges: TopFailedChallenge[];
}
