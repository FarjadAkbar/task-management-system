"use client"

import { useEffect, useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Download, Edit, Share2, Trash } from "lucide-react"

interface FileContextMenuProps {
  isAdmin: boolean
}

export function FileContextMenu({ isAdmin }: FileContextMenuProps) {
  const [mounted, setMounted] = useState(false)

  // Only render on client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ContextMenu>
      <ContextMenuTrigger className="hidden">
        {/* This is a hidden trigger, actual context menu is handled via JavaScript */}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <Download className="h-4 w-4 mr-2" />
          Open
        </ContextMenuItem>

        {isAdmin && (
          <>
            <ContextMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </ContextMenuItem>

            <ContextMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem className="text-destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

