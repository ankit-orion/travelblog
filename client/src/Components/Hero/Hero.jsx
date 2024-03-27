import React from 'react';

function Hero() {
  return (
    <>
      <section className="bg-gray-800 text-gray-100">
        <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
          <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
            <img src="https://www.pngkey.com/png/full/217-2174579_picture-royalty-free-stock-images-clip-art-real.png" alt="" className="object-cover h-80 sm:h-96 lg:h-112 xl:h-128 2xl:h-144 flex-shrink-0" />
          </div>
          <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
            <h1 className="text-5xl font-bold leading-normal sm:text-6xl">Explore
              <span className="dark:text-violet-600"> Beyond </span>Boundaries
            </h1>
            <p className="mt-6 mb-8 text-lg sm:mb-12">
              <span className='text-2xl font-bold dark:text-violet-600'>Embark on a journey</span> of discovery and exploration.
              <br className="hidden md:inline lg:hidden" />Share your adventures <span className='text-2xl font-bold dark:text-violet-600'>with the world.</span>
            </p>
            <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
              <a rel="noopener noreferrer" href="#" className="px-8 py-3 text-lg font-semibold rounded dark:bg-violet-600 dark:text-gray-50 hover:bg-violet-700 transition-colors">Explore</a>
			  <a rel="noopener noreferrer" href="#" className="px-8 py-3 text-lg font-semibold border rounded dark:border-white-800 hover:bg-gray-800 transition-colors">Create Post</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
