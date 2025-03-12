import EmployeeGuidelines from '@/components/dashboard/team/EmployeeGuidelines'
import React from 'react'


const page = () => {
    const data = [
        {
            category: "Promotional Posts",
            subcategory: "Promotional Posts",
            generalKnowledge: "Health Benefits: Educate your followers about the health advantages of the fruits and products you offer, such as nutritional content and health impacts.",
            locationCentric: "Farm Tours: Share videos or photo galleries that take followers on a virtual tour of your farm, showcasing the various processes and the beauty of the location.",
            upcomingEvents: "Holiday Promotions: Announce any special offers or products related to upcoming holidays like Christmas, Easter, or Thanksgiving.",
            didYouKnow: "Nutritional Facts: Fascinating details about the nutritional benefits of your products.",
            proTip: "Recipe Ideas: Simple and creative ways to use your fruits in everyday cooking.",
        },
        {
            category: "General Knowledge Posts",
            subcategory: "New Product Launches: Announcing new fruits, products, or services available in your store.",
            generalKnowledge: "Storage Tips: Provide advice on how to properly store different types of fruits to prolong freshness and flavor.",
            locationCentric: "Meet the Farmers: Introduce the team behind the produce with stories or interviews, highlighting their expertise and dedication.",
            upcomingEvents: "Local Markets: Share dates, times, and locations of farmers' markets or special events where your products will be featured.",
            didYouKnow: "Historical Uses: Interesting historical uses of your products, such as traditional remedies or ancient culinary uses.",
            proTip: "Preservation Tips: Advice on preserving freshness and extending the shelf life of your products.",
        },
        {
            category: "Location-centric Posts",
            subcategory: "Limited-Time Offers: Promotions that are available for a short period, encouraging quick action from your audience.",
            generalKnowledge: "Selection Guide: Teach how to select the best fruits at the market, identifying signs of ripeness and quality.",
            locationCentric: "Behind-the-Scenes: Reveal the day-to-day activities on the farm, such as planting, harvesting, and packaging processes.",
            upcomingEvents: "",
            didYouKnow: "Agricultural Techniques: Insightful facts about the unique agricultural techniques used in growing your produce.",
            proTip: "Preparation Techniques: Tips on how to properly cut, peel, or prepare your fruits for different dishes.",
        },
        {
            category: "Upcoming Special Events Posts",
            subcategory: "Seasonal Sales: Discounts and special offers tailored to specific seasons or holidays, like a summer sale or a Mother's Day special.",
            generalKnowledge: "Food Safety: Share information on safe handling practices for fresh produce to avoid contamination and ensure food safety.",
            locationCentric: "Sustainability Features: Detail your farm’s sustainable practices, such as water conservation methods, organic farming techniques, or renewable energy usage.",
            upcomingEvents: "",
            didYouKnow: "Global Varieties: Information about different varieties of your products from around the world.",
            proTip: "Serving Suggestions: Innovative serving suggestions to inspire your audience, such as using fruits in desserts, smoothies, or salads.",
        },
        {
            category: "Did You Know Posts",
            subcategory: "Bundle Deals: Offers where multiple products are combined at a discounted rate.",
            generalKnowledge: "Interesting Facts: Offer fun and lesser-known facts about the fruits you sell, like historical uses or unusual varieties.",
            locationCentric: "Seasonal Changes: Document how your farm changes with the seasons, showing planting in spring, growth in summer, harvest in fall, and preparation in winter.",
            upcomingEvents: "",
            didYouKnow: "Environmental Impact: Facts about how consuming more fresh produce can benefit the environment.",
            proTip: "Pairing Recommendations: Recommendations on pairing your fruits with other food items or drinks to enhance dining experiences.",
        },
        {
            category: "Pro Tip or Culinary Suggestion Post",
            subcategory: "Flash Sales: Very short-term sales that create urgency, often lasting only a few hours or a day.",
            generalKnowledge: "Sustainability Practices: Discuss your farming practices, highlighting any sustainable, organic, or eco-friendly methods you employ.",
            locationCentric: "Wildlife on the Farm: If applicable, post about the local wildlife that interacts with or benefits from the farm’s ecosystem.",
            upcomingEvents: "",
            didYouKnow: "Food Pairings: Uncommon knowledge about pairing your fruits with other foods or drinks for enhanced flavors.",
            proTip: "Health Tips: Suggestions on how to incorporate your fruits into a healthy diet effectively.",
        },
        {
            category: "",
            subcategory: "Loyalty Rewards: Promotions targeting repeat customers, such as discounts or special benefits for frequent shoppers.",
            generalKnowledge: "Seasonal Guides: Inform about the best times to buy certain fruits based on their peak seasons for optimal taste and value.",
            locationCentric: "Community Involvement: Highlight any local community events you participate in or contributions you make, showing your farm's role beyond just agriculture.",
            upcomingEvents: "",
            didYouKnow: "",
            proTip: "",
        },
        {
            category: "",
            subcategory: "Giveaways and Contests: Engaging your audience by offering a chance to win something if they interact with a post or series of posts.",
            generalKnowledge: "Cultural Significance: Explore the role different fruits play in cultural traditions, festivals, or cuisines around the world.",
            locationCentric: "Historical Insights: Share the history of your farm and any interesting stories about how it has evolved over the years.",
            upcomingEvents: "",
            didYouKnow: "",
            proTip: "",
        },
    ];
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto py-6">
                <h1 className="text-2xl font-semibold mb-6">SEO Content Writer</h1>
                <EmployeeGuidelines />
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border border-gray-200 text-sm text-gray-700">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="border px-2 py-2">Categories</th>
                                    <th className="border px-2 py-2">Subcategories</th>
                                    <th className="border px-2 py-2">General Knowledge Posts</th>
                                    <th className="border px-2 py-2">Location-centric Posts</th>
                                    <th className="border px-2 py-2">Upcoming Special Events Posts</th>
                                    <th className="border px-2 py-2">Did You Know Posts</th>
                                    <th className="border px-2 py-2">Pro Tip or Culinary Suggestion Post</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-gray-100`}
                                    >
                                        <td className="border px-1 py-2 font-semibold">
                                            {row.category}
                                        </td>
                                        <td className="border px-1 py-2">{row.subcategory}</td>
                                        <td className="border px-1 py-2">{row.generalKnowledge}</td>
                                        <td className="border px-1 py-2">{row.locationCentric}</td>
                                        <td className="border px-1 py-2">{row.upcomingEvents}</td>
                                        <td className="border px-1 py-2">{row.didYouKnow}</td>
                                        <td className="border px-1 py-2">{row.proTip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default page
