"use client"
import EmployeeGuidelines from '@/components/dashboard/team/EmployeeGuidelines'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter();

    const cards = [
        { title: "Tools", description: "All Tools credentials", path: "/tools" },
        { title: "Tasks", description: "See All Tasks", path: "/projects/67dfb82f97615f9768c9824f/board" },
        { title: "Meetings", description: "See All Meetings", path: "/event" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-1">
            <div className="max-w-7xl w-full bg-white shadow-xl rounded-lg py-4 sm:p-10 p-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">Graphic Designer</h1>
                <p className="sm:text-lg text-sm text-gray-600 text-center mt-2">Employee Guidelines & Responsibilities</p>

                <div className="mt-6 border-t border-gray-300 pt-6">
                    <EmployeeGuidelines />
                </div>

                {/* Role-Specific Guidelines Section */}
                <section className="mt-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 text-center">Video Editing/3D Animation Standards for Web and Social Media</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                        <li>
                            Keep the logo style, positioning, intro, and outro consistent for every video, unless specified otherwise.
                        </li>
                        <li>
                            Maintain subtle and natural transitions to align with the brand's understated aesthetic.
                        </li>
                        <li>
                            Use only approved voiceovers from ElevenLabs.io (Josha and Lucy). Alternate between voices for each paragraph to add variation and maintain engagement.
                        </li>
                        <li>
                            Keep each frame between 1-3 seconds for a fast-paced, engaging experience.
                        </li>
                        <li>
                            Ensure each frame reflects the voiceover’s tone and content.
                        </li>
                        <li>
                            Follow the naming format: DF_(Reel/Video) (Order #) (Runtime) (Revision Version) (Date of Render). Example: DF_Reel_7_1:40Secs_Rev2_09-06-2024.mp4. For videos less than 1 minute in portrait format for social media, name as Reel. For videos more than 1 minute in landscape format, name as Video (for Product Description Page or Informational Videos)
                        </li>
                        <li>
                            After completing a task, upload source files, supporting files, and final output in a new, dedicated folder within the assigned Google Drive directory
                        </li>
                        <li>
                            For infographic videos, minimize stock footage or imagery. Use flowcharts, diagrams, and icons aligned with the brand’s aesthetic, with limited background but focused themes.
                        </li>
                        <li>
                            Ensure videos for platforms like Amazon, Walmart, and eBay comply with platform guidelines (e.g., no CTAs in the video if the video tile doesn’t redirect to shop page on click).
                        </li>
                        <li>
                            For Product Description Videos and long-form content, use 1920x1080 FHD resolution, 60 fps in landscape format. For Short Reels (30-60 seconds), use standard portrait format (ideal for social media viewing).
                        </li>
                        <li>
                            Product Description Videos should include the following sections: Introduction, Characteristics and Morphology, Variants, Packing and Shipping. No CTA (Call to Action) to be added.
                        </li>
                        <li>
                            Only use approved raw videos and images from the G-drive folder provided by Dolce Frutti. Request access if needed.
                        </li>
                        <li>
                            Use minimal on-screen text (approved pop-up text, not complete voiceover as subtitle). Ensure text is clear, concise, and adds to the message without overpowering it.
                        </li>
                        <li>
                            Follow the theme’s standard fonts (Arial), font sizes, and colors(Black, Golden Yellow and White). Use background and foreground colors that complement the Dolce Frutti brand.
                        </li>
                        <li>
                            All text, including button, header, and footer text, should be in lowercase with no italics or capital letters, maintaining the brand’s clean and organic feel.
                        </li>
                        <li>
                            Avoid flashy designs, animations, or shiny elements. Avoid harsh lighting or overly dramatic shadows.
                        </li>
                        <li>
                            Design should reflect clarity, subtlety, and elegance to keep the focus on the product’s natural appeal.
                        </li>
                        <li>
                            Avoid overuse of effects; keep visuals clean and polished.
                        </li>
                        <li>
                            Opt for seamless, fluid animations. Transitions between scenes should feel smooth, mimicking a gentle, natural flow rather than abrupt cuts or complex effects.
                        </li>
                        <li>
                            For any 3D renderings of products, use realistic textures and lighting that mirror the natural appearance of fruits and packaging. Avoid overly glossy or artificial textures.
                        </li>
                        <li>
                            Incorporate slow-motion shots or close-ups for details that highlight product quality, such as texture, ripeness, or organic packaging materials.
                        </li>
                        <li>
                            Use light background sounds (like orchard ambiance or soft wind) where applicable to create an immersive feel, keeping volume low to avoid distraction from the main content.
                        </li>
                        <li>
                            Apply a subtle color grade to maintain a consistent look across all videos. Keep tones earthy, warm, and natural to highlight the freshness and organic quality of Dolce Frutti products.
                        </li>
                        <li>
                            Ensure scenes have a sense of depth. Use gentle camera movements to introduce products from various angles, providing a lifelike perspective.
                        </li>
                        <li>
                            Avoid crowding the screen with too many elements. Keep 3D animations minimalistic and directly related to the product’s core message, focusing only on necessary visuals.
                        </li>
                        <li>
                            Display the Call to Action (CTA) briefly at the end of Reels with soft animations, encouraging viewer response without rushing or overly emphasizing it. Do not include CTAs in Product Description Videos.
                        </li>
                        <li>
                            Background music will be provided for each category of video(Short Reels or Long Videos), do not use new background music for every single video. Keep the music volume set to minimum level so that the voiceover can be heard effortlessly. Use soft, ambient sound effects that complement the natural, calm brand aesthetic. Avoid loud, energetic sound effects to keep the focus on the product's quality and organic nature.
                        </li>
                    </ul>
                </section>

                {/* API Section */}
                <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cards.map(({ title, description, path }) => (
                        <div
                            key={title}
                            className="border border-gray-300 shadow-md rounded-lg p-2 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-black hover:bg-gold text-gold hover:text-black"
                            onClick={() => router.push(path)}
                        >
                            <h3 className="text-xl">{title}</h3>
                            <p className="text-sm mt-1">{description}</p>
                        </div>
                    ))}
                </section>
            </div >
        </div >
    )
}

export default page
