import React, { useEffect, useRef, useState } from "react";

function Sidebar() {
	  const [refresh, setRefresh] = useState(false);
		useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';  // The Tailwind CSS CDN link
    script.async = true;

    // Append the script to the body or head
    document.head.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);  // Empty dependency array means this runs once when the component mounts
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const signupFormRef = useRef(null);

  const breakpointLg = 976;

  const toggle = () => {
    if (window.innerWidth < breakpointLg) {
      showModal();
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  const showModal = () => {
    if (overlayRef.current && signupFormRef.current) {
      overlayRef.current.classList.add("opacity-1", "z-50");
      overlayRef.current.classList.remove("opacity-0", "-z-50");
      signupFormRef.current.classList.add("top-[0%]");
      signupFormRef.current.classList.remove("-top-[150%]");
      document.body.style.overflowY = "hidden";
    }
  };

  const closeModal = () => {
    if (overlayRef.current && signupFormRef.current) {
      overlayRef.current.classList.add("opacity-0", "-z-50");
      overlayRef.current.classList.remove("opacity-1", "z-50");
      signupFormRef.current.classList.add("-top-[150%]");
      signupFormRef.current.classList.remove("top-[0%]");
      document.body.style.overflowY = "scroll";
    }
  };

  return (
    <>
      <header className="border-b-green-500 border-b-8">
        <nav className="flex justify-between">
          <button className="px-4 py-4 rounded-r-md border-r text-2xl" onClick={toggle}>
            {/* <img className="w-[30px] h-[30px]" src="../../assets/images/menu.png" alt="Menu" /> */}
            ☰
          </button>
          <div className="flex justify-center">
            <a href="www.salimwireless.com" className="navbar-brand">
              <img
                src="#"
                alt="logo"
                className="mx-4 px-4 max-md:w-[118px] max-md:h-[64px] py-2"
              />
            </a>
          </div>
<div id="headerNavbar" className="flex items-center ml-auto max-md:hidden">
  <ul className="flex text-center text-[#2c98cd]" style={{ fontFamily: "Raleway, sans-serif" }}>
    {["HOME", "CONTACT"].map((text, index) => (
      <li key={index} className="px-2 m-1">
        <a
          className="mx-4 px-4 py-2 hover:bg-[#99cc3e] hover:underline hover:text-white rounded-lg"
          href={`https://www.salimwireless.com/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      </li>
    ))}
  </ul>
</div>

        </nav>

        {/* Overlay */}
        <div ref={overlayRef} className="overlaycontainer fixed top-0 w-full h-full bg-[#00000080] opacity-0 -z-50" onClick={closeModal}></div>

        {/* Modal Signup Form */}
        <div ref={signupFormRef} className="overlaysignupform fixed -top-[150%] left-1/2 -translate-x-1/2 z-50 transition-all ease-in-out duration-300">
          <div className="flex justify-center items-center px-4 h-screen w-screen">
            <div className="relative bg-white border border-[#00000033] rounded-md w-[498px] flex flex-col overflow-y-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <div className="w-[87px] h-[50px] flex justify-center items-center">
                  <a href="www.salimwireless.com">
                    <img src="../../assets/images/vlabs-color-small-moe.jpg" alt="logo" className="w-[71px] h-[40px]" />
                  </a>
                </div>
                <button className="w-[24px] h-[24px]" onClick={closeModal}>
                  <img src="../../assets/images/close.png" alt="Close" />
                </button>
              </div>
              <div className="p-4 flex flex-col text-[19.2px] font-bold text-[#3e6389]">
{["dropdown1", "dropdown2", "dropdown3"].map((item, index) => (
  <div key={index} className="flex justify-center">
    <a
      href={`https://www.salimwireless.com/${item.toLowerCase()}.html`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 hover:text-[#343a40] hover:underline"
    >
      {item}
    </a>
  </div>
))}

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 pl-8 text-[25.6px] max-sm:text-[20px] text-[#337ab7]">
        <ol className="inline-flex space-x-1 md:space-x-2 items-center">
          {[
            { href: "www.salimwireless.com", text: "Parent Topic" },
            { href: "../../Introduction.html", text: "Child Topic 1" },
            { href: "../../List_of_experiments.html", text: "Child Topic 2" },
          ].map((item, index) => (
            <li key={index} className="inline-flex flex-wrap items-center">
              <a href={item.href} className="hover:underline inline-flex items-center hover:text-black">
                {item.text}
              </a>
              {index < 2 && (
                <svg className="w-4 h-4 mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m1 9 4-4-4-4" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Sidebar */}
      <div className="flex min-h-[280px]">
        <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "block" : "hidden"} px-6 border-r font-semibold text-[#3e6389]`}>
          <div className="flex flex-col items-start">
{["dropdown1", "dropdown2", "dropdown3"].map((item, index) => (
  <div key={index} className="p-2 text-[19.2px] hover:text-black hover:underline">
    <a
      href={`https://www.salimwireless.com/${item.toLowerCase()}.html`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {item}
    </a>
  </div>
))}
          </div>
        </div>
      </div>
	  <div className = "footer">
        <div className="flex max-sm:flex-col text-white bg-[#111111] px-6">
          <div className="flex-1 flex flex-col px-[15px]">
            <span className="w-1/5 font-bold pb-2 mb-3 border-b-2 border-b-green-500">Community Links</span>
            <a href="https://www.salimwireless.com" className="footerlink" target="_blank" rel="noopener noreferrer">Career</a>
            <a href="https://www.salimwireless.com" className="footerlink" target="_blank" rel="noopener noreferrer">Partners</a>
          </div>
          <div className="flex-1 flex flex-col px-[15px]">
            <span className="w-1/5 font-bold pb-2 mb-3 border-b-2 border-b-green-500">Contact Us</span>
<a href="https://www.salimwireless.com" className="footerlink" target="_blank" rel="noopener noreferrer">
  Email
</a>
<a href="https://www.salimwireless.com" className="footerlink" target="_blank" rel="noopener noreferrer">
  Phone
</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
