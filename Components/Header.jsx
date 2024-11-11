import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Ensure you import styles for WalletMultiButton to appear correctly
import "@solana/wallet-adapter-react-ui/styles.css";

//IMPORT
import Button from "./Ethereum/Button";

const Header = ({
  setOpenContact,
  openContact,
  setAddress,
}) => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected && publicKey) {
      setAddress(publicKey.toString());
    } else {
      setAddress(null);
    }
  }, [connected, publicKey, setAddress]);

  return (
    <header className="header">
      <nav>
        <div className="logo">
          <a href="/">
            Coin<span>Maker.io</span>
          </a>
        </div>
        <input type="checkbox" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          &#9776;
        </label>
        <ul className="menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              onClick={() =>
                openContact ? setOpenContact(false) : setOpenContact(true)
              }
            >
              Contact
            </a>
          </li>
          {connected ? (
            <li>
              <Button
                name={`${publicKey.toString().slice(0, 4)}...${publicKey
                  .toString()
                  .slice(-4)}`}
                handleClick={() => router.push(`/profile`)}
              />
            </li>
          ) : (
            <li>
              <WalletMultiButton />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
