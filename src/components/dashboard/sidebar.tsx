import React from 'react'

const SideBar: React.FC = () => {

    return (
        <aside className="p-6">
            <ul className="space-y-4">
                <li className="font-bold border-l-4 border-black pl-2">Profile</li>
                <li className="hover:font-bold cursor-pointer pl-2">Password</li>
            </ul>
        </aside>
    );
};

export default SideBar
