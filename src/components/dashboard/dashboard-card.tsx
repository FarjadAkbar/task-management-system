import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type DashboardCardProps = {
  title: string
  src: string
  href: string
  className?: string
}

export function DashboardCard({ title, src, href, className }: DashboardCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1">
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={src || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="w-full text-center">
            <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-gold dark:group-hover:text-gold transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  )
}

