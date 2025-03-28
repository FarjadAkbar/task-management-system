import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cardsData = [
    { src: "/images/webDeveloper.png", title: 'Web Developer', link: 'team/web-developer' },
    { src: "/images/graphicDesigner.png", title: 'Graphic Designer', link: 'team/graphic-designer' },
    { src: "/images/SEOContentWriter.png", title: 'SEO Content Writer', link: 'team/seo-content-writer' },
    { src: "/images/seoSpecialist.png", title: 'SEO Specialist', link: 'team/seo-specialist' },
    { src: "/images/delivery.png", title: 'Shipping and Labels Handling', link: 'team/shipping' },
    { src: "/images/MarketPlace.png", title: 'MarketPlace', subtitle: 'Amazon, eBay, Walmart', link: 'team/marketplace' },
];

const Ourteam = () => {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 sm:px-8 py-8">
            <main className="w-full max-w-6xl text-center">
                <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Meet Our Team</h1>
                <p className="text-lg text-gray-600 mt-2 font-medium sm:text-xl">Ayesha Khan - Marketing Manager</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-10">
                    {cardsData.map((card, index) => (
                        <Link key={index} href={card.link} className="group">
                            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transform transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full sm:max-w-sm mx-auto">
                                <Image
                                    src={card.src}
                                    alt={card.title}
                                    width={144}
                                    height={200}
                                    className="h-32 w-32 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
                                />
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 hover:gold">{card.title}</h2>
                                {/* {card.subtitle && (
                                    <p className="text-sm text-gray-600 mt-1 sm:text-base">{card.subtitle}</p>
                                )} */}
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Ourteam;
