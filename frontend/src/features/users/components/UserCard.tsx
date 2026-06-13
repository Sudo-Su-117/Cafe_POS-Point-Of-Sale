"use client";

import React from "react";
import { Eye, KeyRound, Archive, Trash2, Mail, Calendar } from "lucide-react";
import { User } from "./types";
import { UserAvatar } from "./UserAvatar";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";

interface UserCardProps {
  user: User;
  onView:    (u: User) => void;
  onChangePassword: (u: User) => void;
  onArchive: (id: string) => void;
  onDelete:  (id: string) => void;
}

export function UserCard({ user, onView, onChangePassword, onArchive, onDelete }: UserCardProps) {
  return (
    <div className="bg-white border border-[#D9CDC1] rounded-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.03)] hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-[250ms] flex flex-col">

      {/* Card top — avatar + name + role */}
      <div className="flex flex-col items-center pt-6 pb-4 px-5 gap-3 border-b border-[#EDE6DC]">
        <UserAvatar name={user.name} color={user.avatarColor} size={60} fontSize={22} />
        <div className="text-center">
          <h3 className="text-[16px] font-bold text-text-heading">{user.name}</h3>
          <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
            <RoleBadge  role={user.role} />
            <StatusBadge status={user.status} />
          </div>
        </div>
      </div>

      {/* Card body — email + joined */}
      <div className="px-5 py-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-[13px] text-text-body font-medium">
          <Mail size={13} className="text-text-muted shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-muted font-medium">
          <Calendar size={13} className="shrink-0" />
          <span>Joined {user.joinedAt}</span>
        </div>
      </div>

      {/* Card footer — actions */}
      <div className="px-5 pb-4 pt-2 border-t border-[#EDE6DC] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => onView(user)} title="View"
            className="w-[30px] h-[30px] rounded-full bg-[#EAF0FB] text-[#5B8FA8] hover:brightness-95 transition-all flex items-center justify-center">
            <Eye size={14} strokeWidth={2} />
          </button>
          <button onClick={() => onChangePassword(user)} title="Change Password"
            className="w-[30px] h-[30px] rounded-full bg-[#F3ECE3] text-[#9A846F] hover:brightness-95 transition-all flex items-center justify-center">
            <KeyRound size={14} strokeWidth={2} />
          </button>
          <button onClick={() => onArchive(user.id)} title={user.status === "Archived" ? "Unarchive" : "Archive"}
            className={`w-[30px] h-[30px] rounded-full transition-all flex items-center justify-center ${
              user.status === "Archived"
                ? "bg-[#E7F3DD] text-[#7C9C57]"
                : "bg-[#FAF2E1] text-[#D6A144] hover:brightness-95"
            }`}>
            <Archive size={14} strokeWidth={2} />
          </button>
        </div>
        <button onClick={() => onDelete(user.id)} title="Delete"
          className="w-[30px] h-[30px] rounded-full bg-[#FBE7E3] text-[#D96052] hover:brightness-95 transition-all flex items-center justify-center">
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
