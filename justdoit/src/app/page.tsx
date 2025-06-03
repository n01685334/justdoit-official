import Card from "@/components/Footer";
import Link from "next/link";

export default function Home() { 
    return (
        <div className="bg-black-200 flex flex-col justify-center items-center w-full h-screen">
        	<h1 className="text-6xl font-bold mb-5">Just do IT ▲</h1>
            <span>get chucking boys</span>
            <Link href="/auth/login" className="mt-5 text-blue-500 hover:text-blue-700">
                Login
            </Link>
            <Link href="/tasks" className="mt-5 text-blue-500 hover:text-blue-700">
                Task cards (demo)
            </Link>
			<Card />
        </div>
    );
}
