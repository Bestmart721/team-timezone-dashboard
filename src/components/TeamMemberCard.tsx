import React from "react";
import { useDispatch } from "react-redux";
import { removeMember } from "../store/teamSlice";
import { TeamMember } from "../types/teamTypes";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TeamMemberProps {
    member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ member }) => {
    const dispatch = useDispatch();
    const now = dayjs().tz(member.timeZone);
    const startTime = dayjs.tz(`${now.format("YYYY-MM-DD")} ${member.workingHours.start}`, member.timeZone);
    const endTime = dayjs.tz(`${now.format("YYYY-MM-DD")} ${member.workingHours.end}`, member.timeZone);

    const isWorking = now.isAfter(startTime) && now.isBefore(endTime);

    return (
        <div className={`p-4 border border-gray-200 rounded-md ${isWorking ? "bg-green-100" : "bg-gray-100"}`}>
            <h2 className="font-bold flex items-center gap-2">
                {member.avatar && (
                    <img src={member.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                )}
                {member.name}
                <button onClick={() => dispatch(removeMember(member.id))} className="bg-red-500 text-white px-2 py-1- mt-2 rounded ms-auto">
                    Remove
                </button>
            </h2>
            <p>Time Zone: {member.timeZone}</p>
            <p>Current Time: {now.format("hh:mm A")}</p>
            <p>Working Hours: {member.workingHours.start} - {member.workingHours.end}</p>
            <div className="mt-2">
                <p className="font-bold">Working Hours Overlap:</p>
                <div className="relative h-4 bg-gray-200 rounded">
                    <div
                        className="absolute h-4 bg-green-500 rounded"
                        style={{
                            left: `${(startTime.hour() * 60 + startTime.minute()) / 14.4}%`,
                            width: `${(endTime.diff(startTime, "minute")) / 14.4}%`,
                        }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                    <span>12 AM</span>
                    <span>12 PM</span>
                    <span>12 AM</span>
                </div>
            </div>
        </div>
    );
};

export default TeamMemberCard;
