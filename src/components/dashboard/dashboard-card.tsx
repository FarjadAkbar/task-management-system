import Link from "next/link"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

type DashboardCardProps = {
  title: string
  icon: LucideIcon
  href: string
  className?: string
  description?: string
}

export function DashboardCard({ title, icon: Icon, href, className, description }: DashboardCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-8 h-8" />
            </div>
          </div>
          <div className="w-full">
            <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

