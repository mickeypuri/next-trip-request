import Link from "next/link";

const Header = () => {

  return (
    <nav className="flex justify-around items-center bg-black h-14 text-white">
      <Link href="/">Home</Link>
      <Link href="/request">Trip Request</Link>
      <Link href="/login">Login</Link>
    </nav>
  )
};

export default Header;

// Note: can also use useRouter from next/navigation, and then router.push("/about")
// const router = useRouter();
// onClick={() => router.push("/about")}
