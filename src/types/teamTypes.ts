export interface WorkingHours {
    start: string;
    end: string;
}

export interface TeamMember {
    id: number;
    name: string;
    timeZone: string;
    workingHours: WorkingHours;
    avatar?: string;
}

export interface TeamState {
    teamMembers: TeamMember[];
}
