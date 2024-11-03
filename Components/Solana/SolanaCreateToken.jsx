const SolanaCreateToken = ({
  setOpenSolanaTokenCreator,
  setLoader,
  PINATA_AIP_KEY,
  PINATA_SECRECT_KEY,
  SOLANA_FEE,
  SOLANA_RECEIVER,
  address,
}) => {
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  const [tokenMintAddress, setTokenMintAddress] = useState("");

  const [token, updateToken] = useState({
    name: "",
    symbol: "",
    decimals: "",
    supply: "",
    image: "",
    description: "",
    revokeFreeze: false,
    revokeMint: false,
  });

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const createToken = useCallback(
    async (token) => {
      try {
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const mintKeypair = Keypair.generate();
        const tokenATA = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          publicKey
        );
        const chargeAmount = await chargeFee();
        if (chargeAmount) {
          const metadataUrl = await uploadMetadata(token);
          console.log(metadataUrl);

          const createMetadataInstruction =
            createCreateMetadataAccountV3Instruction(
              {
                metadata: PublicKey.findProgramAddressSync(
                  [
                    Buffer.from("metadata"),
                    PROGRAM_ID.toBuffer(),
                    mintKeypair.publicKey.toBuffer(),
                  ],
                  PROGRAM_ID
                )[0],
                mint: mintKeypair.publicKey,
                mintAuthority: publicKey,
                payer: publicKey,
                updateAuthority: publicKey,
              },
              {
                createMetadataAccountArgsV3: {
                  data: {
                    name: token.name,
                    symbol: token.symbol,
                    uri: metadataUrl,
                    creators: null,
                    sellerFeeBasisPoints: 0,
                    uses: null,
                    collection: null,
                  },
                  isMutable: false,
                  collectionDetails: null,
                },
              }
            );

          const createNewTokenTransaction = new Transaction().add(
            SystemProgram.createAccount({
              fromPubkey: publicKey,
              newAccountPubkey: mintKeypair.publicKey,
              space: MINT_SIZE,
              lamports: lamports,
              programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
              mintKeypair.publicKey,
              Number(token.decimals),
              publicKey,
              publicKey,
              TOKEN_PROGRAM_ID
            ),
            createAssociatedTokenAccountInstruction(
              publicKey,
              tokenATA,
              publicKey,
              mintKeypair.publicKey
            ),
            createMintToInstruction(
              mintKeypair.publicKey,
              tokenATA,
              publicKey,
              Number(token.supply) * Math.pow(10, Number(token.decimals))
            ),
            createMetadataInstruction
          );

          // Check if Revoke Freeze is selected
          if (token.revokeFreeze) {
            // Add revoke freeze logic here if needed
            console.log("Revoke Freeze authority is selected");
          }

          // Check if Revoke Mint is selected
          if (token.revokeMint) {
            // Add revoke mint logic here if needed
            console.log("Revoke Mint authority is selected");
          }

          const signature = await sendTransaction(
            createNewTokenTransaction,
            connection,
            {
              signers: [mintKeypair],
            }
          );

          if (mintKeypair.publicKey.toString()) {
            const today = Date.now();
            let date = new Date(today);
            const _tokenCreatedData = date.toLocaleDateString("en-US");

            const _token = {
              network: "Solana",
              account: publicKey,
              supply: token.supply,
              name: token.name,
              symbol: token.symbol,
              tokenAddress: mintKeypair.publicKey.toString(),
              transactionHash: signature,
              createdAt: _tokenCreatedData,
              logo: token.image,
            };

            let tokenHistory = [];

            const history = localStorage.getItem("TOKEN_HISTORY");
            if (history) {
              tokenHistory = JSON.parse(localStorage.getItem("TOKEN_HISTORY"));
              tokenHistory.push(_token);
              localStorage.setItem(
                "TOKEN_HISTORY",
                JSON.stringify(tokenHistory)
              );
            } else {
              tokenHistory.push(_token);
              localStorage.setItem(
                "TOKEN_HISTORY",
                JSON.stringify(tokenHistory)
              );
            }
          }
          setLoader(false);
          setTokenMintAddress(mintKeypair.publicKey.toString());
          console.log(`Address: ${mintKeypair.publicKey.toString()}`);
          notifySuccess("Token creation successful");
        }
      } catch (error) {
        console.log(error);
        notifyError("Token creation failed");
      }
    },
    [publicKey, connection, sendTransaction]
  );

  return (
    <div className="bootstrap">
      <div className="modal show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered modal-custom modal-custom-xl">
          <div className="modal-content">
            <button
              onClick={() => setOpenSolanaTokenCreator(false)}
              className="close"
            />
            <div className="modal-header">
              <div className="modal-title">Solana Token Creator</div>
              <div className="modal-desc">
                Create your ERC20 token and launch
              </div>
            </div>
            <div className="modal-body">
              {/* Image Upload Section */}
              {token.image ? (
                <div>
                  <img
                    style={{ width: "150px", height: "auto" }}
                    src={token.image}
                    alt=""
                  />
                </div>
              ) : (
                <label htmlFor="file" className="custum-file-upload">
                  <div className="icon">
                    <UploadICON />
                  </div>
                  <div className="text">
                    <span>Click to upload Logo</span>
                  </div>
                  <input
                    onChange={handleImageChange}
                    id="file"
                    type="file"
                  />
                </label>
              )}

              {/* Input Fields */}
              <Input
                icon={<MdOutlineGeneratingTokens />}
                placeholder={"Name"}
                handleChange={(e) =>
                  updateToken({ ...token, name: e.target.value })
                }
              />
              <Input
                icon={<MdOutlineGeneratingTokens />}
                placeholder={"Symbol"}
                handleChange={(e) =>
                  updateToken({ ...token, symbol: e.target.value })
                }
              />
              <Input
                icon={<MdOutlineGeneratingTokens />}
                placeholder={"Supply"}
                handleChange={(e) =>
                  updateToken({ ...token, supply: e.target.value })
                }
              />
              <Input
                icon={<MdOutlineGeneratingTokens />}
                placeholder={"Decimals"}
                handleChange={(e) =>
                  updateToken({ ...token, decimals: e.target.value })
                }
              />
              <Input
                icon={<MdOutlineGeneratingTokens />}
                placeholder={"Description"}
                handleChange={(e) =>
                  updateToken({ ...token, description: e.target.value })
                }
              />

              {/* Checkboxes for Revoke Freeze and Revoke Mint */}
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={token.revokeFreeze}
                    onChange={(e) =>
                      updateToken({ ...token, revokeFreeze: e.target.checked })
                    }
                  />
                  Revoke Freeze (required)
                  <p>Revoke Freeze allows you to create a liquidity pool</p>
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={token.revokeMint}
                    onChange={(e) =>
                      updateToken({ ...token, revokeMint: e.target.checked })
                    }
                  />
                  Revoke Mint
                  <p>Mint Authority allows you to increase token supply</p>
                </label>
              </div>

              {/* Create Token Button */}
              {tokenMintAddress ? (
                <div className="form-group">
                  <a
                    href={`https://solscan.io/account/${tokenMintAddress}?cluster=devnet`}
                    target="_blank"
                    className="btn btn-primary btn-block "
                  >
                    View Explorer
                  </a>
                </div>
              ) : balance < 2 ? (
                <div className="form-group">
                  <button className="btn btn-primary btn-block ">
                    Balance {balance} Sol, required minimum 2 Sol
                  </button>
                </div>
              ) : (
                <div className="form-group">
                  <button
                    onClick={() => createToken(token)}
                    className="btn btn-primary btn-block "
                  >
                    Create token (Fee {SOLANA_FEE} Sol)
                  </button>
                </div>
              )}
              <div className="text-center notice">
                By creating token you agree to our
                <a href="/pricing" target="_blank">
                  Privacy &amp; Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolanaCreateToken;
