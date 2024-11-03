import React, { useState } from "react";

// INTERNAL IMPORTS
import { useStateContext } from "../Context/index";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Contact from "../Components/Contact";

const Pricing = () => {
  const {
    connectWallet,
    address,
    shortenAddress,
    accountBalance,
    setLoader,
  } = useStateContext();

  const [openContact, setOpenContact] = useState(false);
  const [activeTap, setActiveTap] = useState(0);

  return (
    <>
      <Header
        connectWallet={connectWallet}
        address={address}
        shortenAddress={shortenAddress}
        accountBalance={accountBalance}
        setOpenContact={setOpenContact}
        openContact={openContact}
      />
      <div className="content">
        <div className="index-blocks-2">
          <div className="wide-bg">
            <div className="app-desc max-width">
              <div className="text">
                <h2>Flexible Pricing for Your Crypto Token Needs</h2>
                <p>
                  At Web3.Tools, we provide flexible pricing tailored to each of our services. Whether you’re creating tokens on Solana, Ethereum, Polygon, or another blockchain, our transparent pricing structure ensures fairness and clarity for every user.
                </p>
              </div>
              <img
                src="/assets/i/v3/universe/vcutter-veditor.svg"
                alt="Crypto Token Creation"
              />
            </div>
          </div>
          <article className="block-padding max-width">
            <h2>Why Web3.Tools?</h2>
            <p>
              Our services are crafted to support a wide array of blockchain networks, including Solana, Ethereum, and Polygon. Each service has its unique pricing, which you can always view within the app for full transparency.
            </p>
            <ol>
              <li>
                <h3>ERC20 Token Creation</h3>
                <p>Launch your token on the Ethereum blockchain with straightforward and fair pricing.</p>
              </li>
              <li>
                <h3>Solana Token Creation</h3>
                <p>Experience quick, affordable token creation on the Solana network, known for low fees and high efficiency.</p>
              </li>
              <li>
                <h3>Polygon Token Creation</h3>
                <p>Leverage the power of Polygon with cost-effective token creation for projects seeking scalability.</p>
              </li>
            </ol>
          </article>
          <div className="line" />
          <div className="block-padding misc max-width">
            <h2>Frequently Asked Questions</h2>
            <div className="faq">
              {[
                {
                  question: "What networks are supported?",
                  answer: "We support Solana, Ethereum, Polygon, and several other major blockchains."
                },
                {
                  question: "How is the pricing structured?",
                  answer: "Our pricing is customized based on the specific service. Check within the app for details on each network."
                },
                {
                  question: "Are there any additional fees?",
                  answer: "All fees are displayed upfront for each service. There are no hidden charges."
                },
                {
                  question: "How long does it take to create a token?",
                  answer: "Most tokens are created instantly, but it can take a few minutes depending on the network."
                },
                {
                  question: "Is technical knowledge required?",
                  answer: "No, our platform is designed to be user-friendly, even for those new to crypto."
                },
                {
                  question: "Do you offer support for token management after creation?",
                  answer: "Yes, we provide ongoing support to help you manage your token as needed."
                }
              ].map((faq, index) => (
                <div
                  onClick={() => setActiveTap(index)}
                  className={`item ${index === activeTap ? "active" : ""}`}
                  key={index}
                >
                  <div className="q">{faq.question}</div>
                  <div className="a">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="line" />
        </div>
      </div>
      {openContact && (
        <Contact setOpenContact={setOpenContact} setLoader={setLoader} />
      )}
      <Footer setOpenContact={setOpenContact} openContact={openContact} />
    </>
  );
};

export default Pricing;
