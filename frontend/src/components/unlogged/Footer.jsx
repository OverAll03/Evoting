import React from 'react';

function Footer() {
    return (
        <footer className="bg-blue-800 text-white py-8">
            <div className="container mx-auto text-center">
                <div className="mb-4">
                    <h3 className="text-2xl font-bold">E-Voting Platform</h3>
                    <p className="text-gray-200">Sécurisez et rendez vos votes transparents grâce à la technologie blockchain.</p>
                </div>
                <div className="flex justify-center space-x-6 mb-4">
                    <a href="#" className="text-gray-200 hover:text-white transition duration-300">Politique de confidentialité</a>
                    <a href="#" className="text-gray-200 hover:text-white transition duration-300">Conditions de service</a>
                    <a href="#" className="text-gray-200 hover:text-white transition duration-300">Contactez-nous</a>
                </div>
                <div className="text-gray-300">
                    &copy; {new Date().getFullYear()} E-Voting Platform. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
