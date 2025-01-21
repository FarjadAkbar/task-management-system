import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="text-center bg-black text-white">
            <div className="py-4">
                &copy; 2024
                <Link href="https://www.dolcefrutti.com/" className=" px-1 hover:text-yellow-400">
                    Dolce Frutti LLC
                </Link>
            </div>
        </footer>
    )
}

export default Footer
