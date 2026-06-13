"use client";

import React from "react";
import { Eye, KeyRound, Archive, Trash2 } from "lucide-react";
import { User } from "./types";
import { UserAvatar } from "./UserAvatar";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";

interface UserTableProps {
  users: User[];
  onView:    (u: User) => void;
  onChangePassword: (u: User) => void;
  onArchive: (id: string) => void;
  onDelete:  (id: string) => void;
}

export function UserTable({ users, onView, onChangePassword, onArchive, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="w-full bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] py-16 text-center text-[15px] font-medium text-text-muted">
        No users found. Click &quot;+ New User&quot; to add one.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto w-full no-scrollbar">
        <table className="w-full border-collapse text-left font-sans min-w-[700px]">
          <thead>
            <tr className="bg-[#EFE8DE] h-[44px] border-b border-[#D8CCBF]">
              <th className="px-6 py-2 text-[13px] font-bold text-text-heading select-none">Name</th>
              <th className="px-6 py-2 text-[13px] font-bold text-text-heading select-none">Email</th>
              <th className="px-6 py-2 text-[13px] font-bold text-text-heading select-none">Role</th>
              <th className="px-6 py-2 text-[13px] font-bold text-text-heading select-none">Status</th>
              <th className="px-6 py-2 text-[13px] font-bold text-text-heading select-none text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                className="h-[58px] border-b border-[#D8CCBF]/60 last:border-0 hover:bg-[#FAF6F1] transition-colors duration-150"
              >
                {/* Name + avatar */}
                <td className="px-6 py-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} color={user.avatarColor} size={34} fontSize={13} />
                    <span className="text-[15px] font-bold text-text-heading">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-2 text-[14px] font-medium text-text-body">{user.email}</td>

                {/* Role */}
                <td className="px-6 py-2"><RoleBadge role={user.role} /></td>

                {/* Status */}
                <td className="px-6 py-2"><StatusBadge status={user.status} /></td>

                {/* Actions */}
                <td className="px-6 py-2">
                  <div className="flex items-center justify-end gap-2">
                    {/* View */}
                    <button onClick={() => onView(user)} title="View"
                      className="w-[30px] h-[30px] rounded-full bg-[#EAF0FB] text-[#5B8FA8] hover:brightness-95 transition-all flex items-center justify-center cursor-pointer">
                      <Eye size={14} strokeWidth={2} />
                    </button>
                    {/* Change password */}
                    <button onClick={() => onChangePassword(user)} title="Change Password"
                      className="w-[30px] h-[30px] rounded-full bg-[#F3ECE3] text-[#9A846F] hover:brightness-95 transition-all flex items-center justify-center cursor-pointer">
                      <KeyRound size={14} strokeWidth={2} />
                    </button>
                    {/* Archive */}
                    <button onClick={() => onArchive(user.id)} title={user.status === "Archived" ? "Unarchive" : "Archive"}
                      className={`w-[30px] h-[30px] rounded-full transition-all flex items-center justify-center cursor-pointer ${
                        user.status === "Archived"
                          ? "bg-[#E7F3DD] text-[#7C9C57]"
                          : "bg-[#FAF2E1] text-[#D6A144] hover:brightness-95"
                      }`}>
                      <Archive size={14} strokeWidth={2} />
                    </button>
                    {/* Delete */}
                    <button onClick={() => onDelete(user.id)} title="Delete"
                      className="w-[30px] h-[30px] rounded-full bg-[#FBE7E3] text-[#D96052] hover:brightness-95 transition-all flex items-center justify-center cursor-pointer">
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
