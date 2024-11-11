import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//IMPORT
import Button from "./Ethereum/Button";

const Header = ({
  connectWallet,
  address,
  shortenAddress,
  accountBalance,
  setOpenContact,
  openContact,
  setAddress,
}) => {
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    if (typeof window.solana !== "undefined" && window.solana.isPhantom) {
      setIsPhantomInstalled(true);

      // Automatically connect if Phantom is already authorized
      window.solana.on("connect", (publicKey) => {
        handleConnect(publicKey);
      });

      window.solana.on("disconnect", handleDisconnect);
    }

    return () => {
      if (typeof window.solana !== "undefined" && window.solana.isPhantom) {
        window.solana.removeListener("connect", handleConnect);
        window.solana.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [address]);

  const handleConnect = async () => {
    try {
      const { publicKey } = await window.solana.connect();
      setAddress(publicKey.toString());
    } catch (error) {
      console.error("Connection to Phantom wallet failed", error);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
  };

  const router = useRouter();
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
          {address ? (
            <li>
              <Button
                name={`${shortenAddress(address)} `}
                handleClick={() => router.push(`/profile`)}
              />
            </li>
          ) : (
            <li>
              {isPhantomInstalled ? (
                <Button handleClick={handleConnect} name="Connect Wallet" />
              ) : (
                <span>Please install Phantom Wallet</span>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
