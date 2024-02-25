const Home = () => {
  return (
    <>
      <div
        className={`h-[100vh]  flex lg:flex-row flex-col justify-evenly items-center`}
      >
        <div className="   h-1/2 flex flex-col justify-center p-4">
          <h1 className="md:text-6xl text-4xl font-bold tracking-tighter ">
            Welcome to CraveWave
          </h1>
          <p className="md:text-xl text-md mt-4 dark:text-white text-black">
            You can order food from here
          </p>
        </div>
        <img
          src="https://www.chilitochoc.com/wp-content/uploads/2020/08/Chicken-Handi-5.jpg"
          className="w-[450px] h-[450px] p-4 rounded-[30px] object-cover object-center"
        />
      </div>
    </>
  );
};

export default Home;
