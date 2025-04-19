"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { User } from "next-auth"

interface InfoSidebarProps {
    room: { id: string; name: string | null; isGroup: boolean } | null
    userList: User[]
    onClose: () => void
}

export function InfoSidebar({ room, userList, onClose }: InfoSidebarProps) {
    return (
        <div className="fixed inset-0 z-50 bg-[#f0f2f5] flex flex-col md:max-w-sm md:right-0">
            <div className="bg-black text-gold p-4 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gold">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-lg font-semibold">{room?.isGroup ? "Group Info" : "Contact Info"}</h2>
            </div>
            <div className="p-4 flex-1 overflow-auto">
                <div className="mb-6 flex items-center gap-4">
                    {room?.isGroup ? (
                        <Avatar className="h-16 w-16">
                            <AvatarFallback>{room.name?.substring(0, 2) || "GR"}</AvatarFallback>
                        </Avatar>
                    ) : (
                        userList[0]?.id && (
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={userList[0].avatar ?? "/placeholder.svg"} />
                                <AvatarFallback>
                                    {userList[0].name?.substring(0, 2) || "DM"}
                                </AvatarFallback>
                            </Avatar>
                        )
                    )}
                    <div>
                        <h3 className="text-lg font-medium">{room?.name || "N/A"}</h3>
                        <p className="text-sm text-muted-foreground">Room ID: {room?.id || "N/A"}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-medium mb-3">Participants ({userList.length})</h3>
                    <div className="space-y-3">
                        {userList.map((user) =>
                            user?.id ? (
                                <div key={user.id} className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar ?? "/placeholder.svg"} />
                                        <AvatarFallback>
                                            {user.name?.substring(0, 2) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{user.name || "Unknown"}</span>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}