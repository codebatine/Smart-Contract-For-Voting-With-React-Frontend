import React from 'react';
import { FaYoutube, FaGithub, FaLinkedin, FaTelegram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://telegram.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegram />
        </a>
      </div>
      <p>=)</p>
    </footer>
  );
};

export default Footer;
