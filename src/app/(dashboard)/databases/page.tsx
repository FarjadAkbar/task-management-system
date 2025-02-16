"use client";


export default function Databases() {


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shared Notes</h1>
      <a href="/databases/personal" className="block py-2 text-gray-600 hover:text-gray-900">
            Personal Notes
          </a>
          <a href="/databases/shared" className="block py-2 text-gray-600 hover:text-gray-900">
            Shared Notes
          </a>
    </div>
  );
}
