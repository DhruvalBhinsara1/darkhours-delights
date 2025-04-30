function Footer() {
    return (
        <footer className="bg-gradient-to-r from-nav-bg to-nav-bg/90 backdrop-blur-sm text-nav-text shadow-lg border-t border-border-color">
            {/* Contact Information Layer */}
            <div className="container mx-auto px-4 py-6 border-b border-border-color">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                        <p className="text-sm">Phone: 9510517172</p>
                        <p className="text-sm">Email: dhruvalbhinsara460@gmail.com</p>
                    </div>
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-semibold mb-2">Location</h3>
                        <p className="text-sm">DEFINITELY A GOOD COLLEGE </p>
                        <p className="text-sm">VADODARA, GUJARAT</p>
                    </div>
                </div>
            </div>

            {/* Copyright Layer */}
            <div className="container mx-auto px-4 py-4">
                <p className="text-sm text-center">
                    🖕 2025 DarkHours Delights. fuck the rights.
                </p>
            </div>
        </footer>
    );
}

export default Footer;