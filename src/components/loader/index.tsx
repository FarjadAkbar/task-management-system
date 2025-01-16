import Image from "next/image";

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={`flex h-screen justify-center items-center ${className}`}>
      <Image
        src="/loading.gif"
        width={30}
        height={30}
        alt="Loading animation"
        loading="lazy"
        className="block mx-auto"
      />
    </div>
  );
}
