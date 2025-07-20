import Link from "next/link";
import Card from "@/components/Footer";

// MAIN TODO

// TODO: make sure all pages/ components have a top-level comment explaining the comment/component
// TODO: all views should be at least partially responsive
// TODO: all types should be imported from a central types directory


export default function Home() {
	return (
		<div className="bg-black-200 flex flex-col justify-center items-center w-full h-screen">
			<h1 className="text-6xl font-bold mb-5">Just do IT ▲</h1>
			<span>get chucking boys</span>
			<Link
				href="/auth/login"
				className="mt-5 text-blue-500 hover:text-blue-700"
			>
				Login
			</Link>
			<Link href="/projects" className="mt-5 text-blue-500 hover:text-blue-700">
				All Projects
			</Link>
			<Link href="/tasks" className="mt-5 text-blue-500 hover:text-blue-700">
				Task cards (demo)
			</Link>
			<Card />
		</div>
	);
}
