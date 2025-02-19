import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeamState, TeamMember } from "../types/teamTypes";

const initialState: TeamState = {
    teamMembers: JSON.parse(localStorage.getItem("teamMembers") || "[]"),
};

const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        addMember: (state, action: PayloadAction<TeamMember>) => {
            state.teamMembers.push(action.payload);
            localStorage.setItem("teamMembers", JSON.stringify(state.teamMembers));
        },
        removeMember: (state, action: PayloadAction<number>) => {
            state.teamMembers = state.teamMembers.filter((m) => m.id !== action.payload);
            localStorage.setItem("teamMembers", JSON.stringify(state.teamMembers));
        },
    },
});

export const { addMember, removeMember } = teamSlice.actions;
export default teamSlice.reducer;
