import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../store/teamSlice";
import { RootState } from "../store/store";
import { TeamMember } from "../types/teamTypes";
import TeamMemberCard from "./TeamMemberCard";
import Select from "react-select";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import moment from "moment-timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZones = moment.tz.names().map((tz) => ({
  label: tz,
  value: tz,
}));

const TeamDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const teamMembers = useSelector((state: RootState) => state.team.teamMembers);

  const [name, setName] = useState("");
  const [timeZone, setTimeZone] = useState<{ label: string; value: string } | null>(null);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  const handleAddMember = () => {
    if (!name || !timeZone) return;
    const newMember: TeamMember = {
      id: Date.now(),
      name,
      timeZone: timeZone.value,
      workingHours: { start, end },
      avatar,
    };
    console.log(newMember);
    dispatch(addMember(newMember));
    setName("");
    setTimeZone(null);
  };

  // **Sorting & Grouping by Time Zone**
  const groupedMembers: Record<string, TeamMember[]> = {};
  teamMembers
    // .sort((a, b) => a.timeZone.localeCompare(b.timeZone)) // Sort alphabetically
    .forEach((member) => {
      if (!groupedMembers[member.timeZone]) {
        groupedMembers[member.timeZone] = [];
      }
      groupedMembers[member.timeZone].push(member);
    });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Team Time Zone Dashboard</h1>

      <div className="flex gap-4 my-4 items-center">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border py-[6px] px-2 rounded border-gray-300"
        />
        <Select
          options={timeZones}
          value={timeZone}
          onChange={setTimeZone}
          placeholder="Select Time Zone"
          className="w-[200px]"
        />
        <label className="flex items-center">
          <div>
            {
              avatar ? "Change Avatar" : "Upload Avatar"
            }
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        {avatar && <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full ml-2" />}
      </div>
      <div className="flex gap-4 my-4 items-center">
        <label>
          Start Time
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} title="Start Time"
            className="border p-[6px] rounded border-gray-300 ml-2"
          />
        </label>
        <label>
          End Time
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} title="End Time"
            className="border p-[6px] rounded border-gray-300 ml-2"
          />
        </label>
        <button onClick={handleAddMember} className={`bg-blue-500 text-white py-[6px] px-2 rounded ${!name || !timeZone ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!name || !timeZone}>
          Add Member
        </button>
      </div>

      {/* Render grouped members */}
      <div className="mt-6">
        {Object.keys(groupedMembers)
          .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
          .map((timeZone) => (
            <div key={timeZone} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{timeZone}</h2>
              <div className="grid gap-4">
                {groupedMembers[timeZone].map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TeamDashboard;
