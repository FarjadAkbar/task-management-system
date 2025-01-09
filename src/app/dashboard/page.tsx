import React from 'react';
import Navbar from '@/components/Navbar';
import webdeveloper from '@/components/ui/images/webDeveloper.png';
import graphicDesigner from '@/components/ui/images/graphicDesigner.png';
import SEOContentWriter from '@/components/ui/images/SEOContentWriter.png';
import SEOSpecialist from '@/components/ui/images/seoSpecialist.png';
import Shipping from '@/components/ui/images/delivery.png';
import MarketPlace from '@/components/ui/images/MarketPlace.png';
import Image from 'next/image';
import Link from 'next/link';

const cardsData = [
    { src: webdeveloper, title: 'Web Developer', link: 'dashboard/web-developer' },
    { src: graphicDesigner, title: 'Graphic Designer', link: 'dashboard/graphic-designer' },
    { src: SEOContentWriter, title: 'SEO Content Writer', link: 'dashboard/seo-content-writer' },
    { src: SEOSpecialist, title: 'SEO Specialist', link: 'dashboard/seo-specialist' },
    { src: Shipping, title: 'Shipping and labels Handling', link: 'dashboard/shipping' },
    { src: MarketPlace, title: 'MarketPlace', subtitle: 'Amazon ebay walmart', link: 'dashboard/marketplace' },
];

const Dashboard = () => {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main className="px-6 py-8 mt-0 m-16">
                <h1 className="text-xl font-semibold text-center md:text-left">MY DASHBOARD</h1>
                <p className="text-center text-lg mt-4">
                    Employee Name and job title
                    <br />
                    <span className="font-bold">Ayesha Khan Marketing Manager</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-11 mt-8">
                    {cardsData.map((card, index) => (
                        <Link key={index} href={card.link}>
                            <div
                                className="flex flex-col items-center justify-center border-2 border-black p-4 hover:shadow-md"
                            >
                                <Image
                                    src={card.src}
                                    alt={card.title}
                                    className="h-32 w-32 object-contain mb-4"
                                />
                                <h2 className="text-center font-semibold text-lg">{card.title}</h2>
                                {/* {card.subtitle && (
                                    <p className="text-center text-sm mt-1">{card.subtitle}</p>
                                )} */}
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;