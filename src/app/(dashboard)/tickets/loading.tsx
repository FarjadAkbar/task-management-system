import SuspenseLoading from "@/components/loadings/suspense";

export default function loading() {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <SuspenseLoading />
    </div>
  );
}
