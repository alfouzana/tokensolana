import React from "react";

const Footer = ({ setOpenContact, openContact }) => {
  return (
    <footer>
      <div class="container">
        <div class="footer-menu">
          <div class="copyright">
            &copy; 2024 CoinMaker.io All rights reserved.
          </div>
          <ul>
            <li>
              <a
                onClick={() =>
                  openContact ? setOpenContact(false) : setOpenContact(true)
                }
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
