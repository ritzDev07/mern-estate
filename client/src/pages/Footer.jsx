import React from 'react';
import { AiOutlineFacebook, AiOutlineGithub, AiOutlineTwitter, AiOutlineYoutube } from 'react-icons/ai';
import { Link } from 'react-router-dom';


const footerProductLinks = [
    {
        name: "About us",
        link: "/about"
    },
    {
        name: "Careers",
    },
    {
        name: "Our Blog",
    },
    {
        name: "Reviews",
    },
];

const footercompanyLinks = [
    {
        name: "Recent Offers",
    },
    {
        name: "Recent For Rent",
    },
    {
        name: "Recent For Sale",
    },
    {
        name: "Events",
    },
];

const footerSupportLinks = [
    {
        name: "FAQ",
    },
    {
        name: "Reviews",
    },
    {
        name: "Contact Us",
    },
    {
        name: "Live chat",
    },
];


const FooterSection = ({ title, links }) => (
    <div className=' text-left'>
        <h1 className="mb-1 font-semibold">{title}</h1>
        <ul >
            {links.map((link) => (
                <li key={link.name}>
                    <Link
                        className="text-gray-200 hover:text-emerald-400 duration-300 text-sm cursor-pointer leading-6"
                        to={link.link}
                    >
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const SocialMediaLinks = () => (
    <div className="flex items-start mt-4">
        {[
            { Icon: AiOutlineFacebook, label: 'Facebook' },
            { Icon: AiOutlineTwitter, label: 'Twitter' },
            { Icon: AiOutlineYoutube, label: 'YouTube' },
            { Icon: AiOutlineGithub, label: 'GitHub' },
        ].map((social, index) => (
            <a
                key={social.label}
                href={`https://${social.label.toLowerCase()}.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-200 hover:text-emerald-500 duration-300${index !== 0 ? ' ml-2' : ''}`}
            >
                <social.Icon size={25} />
            </a>
        ))}
    </div>
);


const Footer = () => (
    <footer className="bg-emerald-600 text-white mt-5 ">

        <section className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-emerald-900 py-7">
            <div className='md:w-[1100px] md:flex justify-between mx-auto'>
                <h1 className=" lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5">
                    <span className="text-emerald-600">Subscribe</span> us for more discounts and offers
                </h1>
                <div className='mt-10'>
                    <input
                        type="email"
                        name="email"
                        autoComplete='email'
                        id="email"
                        required
                        placeholder="Enter your email ..."
                        className="text-gray-600 sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none"
                    />
                    <button className="bg-emerald-500 hover:bg-emerald-600 duration-300 px-5 py-2.5 rounded-md text-white md:w-auto w-full">
                        submit
                    </button>
                </div>
            </div>

        </section>
        <div className='max-w-6xl mx-auto'>
            <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center">
                <FooterSection title="Company" links={footerProductLinks} />
                <FooterSection title="Shop" links={footercompanyLinks} />
                <FooterSection title="Support" links={footerSupportLinks} />
                <div className='text-left'>
                    <h1 className="mb-1 font-semibold">RitzEstate</h1>
                    <p>Discover your ideal home with ease!</p>
                    <SocialMediaLinks />
                </div>
            </section>
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 text-center pt-2 text-gray-300 text-sm pb-8 justify-center items-center">
                <span>&copy; {new Date().getFullYear()} RitzDev. All rights reserved</span>
                <span>
                    <Link className="text-gray-300 hover:text-emerald-400 duration-300" to="/terms">
                        Terms
                    </Link>{' '}
                    |{' '}
                    <Link className="text-gray-300 hover:text-emerald-400 duration-300" to="/privacy">
                        Privacy Policy
                    </Link>
                </span>
            </div>
        </div>

    </footer>
);

export default Footer;