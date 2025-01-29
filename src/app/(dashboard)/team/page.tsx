import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cardsData = [
    { src: "/images/webDeveloper.png", title: 'Web Developer', link: 'team/web-developer' },
    { src: "/images/graphicDesigner.png", title: 'Graphic Designer', link: 'team/graphic-designer' },
    { src: "/images/SEOContentWriter.png", title: 'SEO Content Writer', link: 'team/seo-content-writer' },
    { src: "/images/seoSpecialist.png", title: 'SEO Specialist', link: 'team/seo-specialist' },
    { src: "/images/delivery.png", title: 'Shipping and labels Handling', link: 'team/shipping' },
    { src: "/images/MarketPlace.png", title: 'MarketPlace', subtitle: 'Amazon ebay walmart', link: 'team/marketplace' },
];

const Ourteam = () => {
    return (
        <div className="bg-white min-h-screen">
            <main className="px-6 py-8 mt-0 m-16">
                <h1 className="text-xl font-semibold text-center md:text-left">Our Team</h1>
                <p className="text-center text-lg mt-4">
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
                                    width={144}
                                    height={200}
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

export default Ourteam;