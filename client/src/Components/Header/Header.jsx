import React from 'react'
import { Link } from 'react-router-dom'
function Header() {
  return (
    <>
	<header className="p-4 bg-gray-800 text-gray-100">
	<div className="container flex justify-between h-16 mx-auto">
	<Link to="/" className="flex items-center px-4 -mb-1 "><img src='https://www.pngkey.com/png/full/217-2174579_picture-royalty-free-stock-images-clip-art-real.png' className='h-12 w-12' /></Link>
	
	<h1 className="font-bold flex items-center px-4 -mb-1 text-3xl">Travel<span className='font-bold dark:text-violet-600'> Boundless </span></h1>
		<ul className="items-stretch hidden space-x-3 md:flex">
			<li className="flex">
				<Link to="/" className="flex items-center px-4 -mb-1">Home</Link>
			</li>
			<li className="flex">
				<Link to="/posts" className="flex items-center px-4 -mb-1 ">Post</Link>
			</li>
			<li className="flex">
				<Link to="/contact" className="flex items-center px-4 -mb-1 ">Travel</Link>
			</li>
			<li className="flex">
			<Link to="/login" className="flex items-center px-4 -mb-1">Login</Link>
			</li>
		</ul>
		<button className="flex justify-end p-4 md:hidden">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
			</svg>
		</button>
	</div>
</header>
    </>
  )
}

export default Header
