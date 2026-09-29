# Majik Signature Desktop

### Free Digital Signing & Verification, Protected by Post-Quantum Cryptography

<a href="https://majikah.solutions/products/majik-signature">
<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-1" src="https://github.com/user-attachments/assets/e2843b67-a04c-4119-9ec2-196d746524b8" />
</a>

Majik Signature is a free desktop application for creating and verifying cryptographic signatures on virtually anything digital — including contracts, PDFs, documents, photos, music, videos, source code, software releases, archives, websites, and social profiles.

**Sign it. Share it. Verify it.**

Majik Signature is designed so that you don't need to understand cryptography to use it. The same workflow works whether you're a freelancer protecting a client contract, a creator proving authorship of a work, a developer signing a software release, or a business managing multi-party documents.

Every signature combines **Ed25519** and **ML-DSA-87 (NIST FIPS-204)** in a hybrid cryptographic design, combining established public-key cryptography with a standardized post-quantum signature algorithm.

Your files remain on your device. Your private keys never leave your device.

---

## 📦 This Repository

This repository is the **official public release repository for Majik Signature Desktop**.

It contains:

* Official Windows and Linux installers
* Release binaries
* Release assets
* Versioned checksums and distribution artifacts
* Public release history and changelogs

The application source code and project development resources are maintained separately.

### 🌐 Official Links

| Resource                   | Link                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| 🌐 Product Website         | [majikah.solutions/products/majik-signature](https://majikah.solutions/products/majik-signature) |
| 📥 Downloads               | [GitHub Releases](https://github.com/Majikah/majik-signature-desktop-releases/releases)          |
| 📚 Documentation           | [Majik Signature Documentation](https://majikah.solutions/products/majik-signature/docs)         |
| 🔐 `.mjksig` Specification | [MJKSIG Specification](https://github.com/Majikah/majik-signature/blob/main/MJKSIG_SPEC.md)      |
| 🧾 `.mjksig` Media Type    | [IANA Registration](https://www.iana.org/assignments/media-types/application/vnd.majikah.mjksig) |
| 🏢 Majikah                 | [majikah.solutions](https://majikah.solutions)                                                   |

---

# ⬇️ Download

Download the latest version from the **[GitHub Releases](https://github.com/Majikah/majik-signature-desktop-releases/releases)** page.

### Supported Platforms

| Platform   | Distribution               |
| ---------- | -------------------------- |
| 🪟 Windows | Official Windows installer |
| 🐧 Linux   | Official Linux packages    |

Linux support was introduced in **v0.17.0**.

Each release may include multiple distribution formats depending on the target platform.

> **Always download Majik Signature from an official Majikah distribution channel or this repository.**

---

# 🛡️ Security & Trust

Majik Signature is built around local cryptographic operations, private-key ownership, and verifiable digital records.

### Independent security software recognition

**Majik Signature binaries from v0.15 onward have been whitelisted by both Avast and Kaspersky.**

This helps reduce unnecessary security warnings when installing or running the application and provides an additional distribution-level security signal for users downloading the official binaries.

Read more:

* [Majik Signature Is Now Officially Whitelisted by Avast](https://www.linkedin.com/pulse/majik-signature-now-officially-whitelisted-avast-majikah-solutions-u9uhc)
* [Majik Signature Is Now Officially Whitelisted by Kaspersky](https://www.linkedin.com/pulse/majik-signature-now-officially-whitelisted-kaspersky-ypcec/)

> Whitelisting by security vendors does not replace your own security practices. Always obtain installers from official release channels and verify release information where available.

---

# 🔐 Hybrid Post-Quantum Cryptography
<a href="https://majikah.solutions/articles/ml-dsa-87-strongest-post-quantum-signature">
<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-7" src="https://github.com/user-attachments/assets/c035e272-55a2-4ce5-abc0-dc981a7ee2ae" />
</a>

Every Majik Signature uses a hybrid signing design combining:

* **Ed25519**
* **ML-DSA-87 — NIST FIPS-204**

The two signatures are combined into a single verification workflow designed to provide protection using both classical and post-quantum cryptographic algorithms.

This is not a future roadmap item.

**Hybrid post-quantum signatures are used by Majik Signature today.**

---

# 🔒 Your Keys Stay Yours

<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-2" src="https://github.com/user-attachments/assets/6ed0274c-ce7e-4fd1-ad6c-ad77b08b799c" />


Majik Signature is designed around local ownership of cryptographic keys.

* Private keys never leave your device.
* Signing happens locally.
* Core verification works locally.
* Files are not uploaded for signing.
* Core signing and verification do not require an internet connection.
* Optional online services are separate from core signing and verification.

You can sign a file, transfer it to another device or person, and allow the recipient to verify it using the file and its signature.

No Majikah account is required simply to verify a signature.

---

# ✨ Features

## 📄 Sign Virtually Any File

<a href="https://majikah.solutions/articles/universal-file-signing">
<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-3" src="https://github.com/user-attachments/assets/0f1c2a49-c5f0-4077-8dd5-d37941a35ec5" />
</a>

Sign:

* PDFs
* Office documents
* Images
* Audio
* Video
* Source code
* Archives
* Applications
* Software releases
* And virtually any other digital file

Signed files remain usable.

PDFs remain PDFs, Office documents remain editable, videos continue playing, and images open normally.

---

## 📦 Embedded & Detached Signatures

Majik Signature supports both embedded and detached signatures.

### Embedded signatures

Where supported, the signature can be embedded directly into the file while retaining the original file's usability.

### Detached signatures

Use a portable:

```text
.mjksig
```

signature envelope when you want to keep the original file completely untouched.

Detached signatures can also be distributed as a ZIP bundle containing:

```text
original-file.ext
original-file.ext.mjksig
```

This allows the original bytes to remain untouched while the signature travels alongside them.

---

## 🔐 Multi-Signature & Signing Order

Multiple people can independently sign the same file.

Majik Signature can preserve and verify:

* Signer identity
* Signature status
* Signing history
* Signing timeline
* Signing order
* Revision chains
* Multiple independent signatures

This makes it possible to build workflows around approvals, reviews, authorizations, and multi-party records.

---

## 🗺️ MJKS Maps

**MJKS Maps** provide a structured way to manage multiple files and signatures through a single Signature Map.

Use `.mjksmap` files for:

* Batch signing
* Batch verification
* Multi-file workflows
* Signing-order verification
* Revision tracking
* Signature status tracking

A single Signature Map can represent a larger signing workflow without requiring each file to be handled independently.

---

## 🔎 Full Chain Verification

Majik Signature can verify an entire revision-aware signing chain.

The verification process can check that:

1. Each revision corresponds to the expected previous file.
2. The expected file bytes are preserved.
3. The associated signatures remain valid.
4. Signatures were created by the expected signers.
5. The signing chain has not been improperly modified.

The latest file can carry the information necessary to verify the complete chain and its signing history.

---

## ⛓️ Majik Notary — Solana Mainnet

<a href="https://majikah.solutions/articles/majik-notary-explained">
<img width="1920" height="1080" alt="ArticleCover_SolanaNotary" src="https://github.com/user-attachments/assets/12a6a202-7bda-4c93-af04-a22a9675d58b" />
</a>

Majik Notary provides optional blockchain anchoring for sealed files.

**₱50.00 per file**
VAT exclusive; processing fees may apply.

Majik Notary records only the file's **SHA3-512 seal hash** on Solana Mainnet.

The file itself is never uploaded to the blockchain.

No cryptocurrency wallet or blockchain account is required. Majikah handles the associated on-chain gas fees through its internal system.

Majik Notary can be used with documents, images, audio, video, applications, software releases, and other digital files.

Learn more:

- [Majik Notary Explained](https://majikah.solutions/articles/majik-notary-explained)
- [How to Notarize Sealed Files](https://majikah.solutions/products/majik-signature/docs/ms-notarizing-sealed-files)

---

## ⏳ Signature Expiration

Signatures can optionally include an expiration date.

Recipients can verify whether a signature:

* Is currently valid
* Has expired
* Was created within its declared validity period

Expiration is useful for contracts, approvals, licenses, temporary authorizations, credentials, and other time-sensitive records.

---

## 🌐 Majik SLink

**Majik SLink** extends cryptographic verification beyond files.

You can create verifiable claims for public URLs such as:

* Websites
* Social profiles
* Repositories
* Public pages
* Other web resources

Claims can represent things such as:

* Ownership
* Attribution
* Reference

Each claim is tied to the signer's cryptographic identity and can be searched and independently verified.

---

## 📁 Hot Folder Automation

<a href="https://majikah.solutions/products/majik-signature/docs/hot-folders">
<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-5" src="https://github.com/user-attachments/assets/86e636f6-28f3-462e-84ab-d49c99e5253e" />
</a>

Point a folder at Majik Signature and let the application automatically process incoming files.

Hot Folders can:

* Automatically verify files
* Sort files into **Passed** or **Failed**
* Operate without constant manual interaction
* Support unattended workflows

Hot Folders are useful for shared folders, operational workflows, and automated verification pipelines.

---

## 🎨 Stamping & Watermarking

<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-6" src="https://github.com/user-attachments/assets/b9ce10b0-774f-4394-a716-4b4bf4c9e8b8" />


Majik Signature can apply visible or embedded signing-related information to supported media.

Supported workflows include:

* Image stamps
* PDF marks
* Office document watermarks
* Logos
* Producer tags
* Audio watermarks

Templates, custom fonts, and audio timeline/mixing controls are available for supported workflows.

Learn more:
- [How to Sign in Majik Signature](https://majikah.solutions/products/majik-signature/docs/signing-documentation)
- [How to Sign with Multiple People](https://majikah.solutions/articles/multi-party-signing-guide)
- [How to Sign Stems and Audio Files](https://majikah.solutions/articles/signing-stems-and-masters-guide)
- [Universal File Signing for Photographers](https://majikah.solutions/articles/universal-file-signing-for-photographers)

---

## 🕒 Trusted Timestamps

Trusted Timestamps provide an additional independently verifiable indication of signing time.

Every account receives:

**5 free Trusted Timestamps every 24 hours**

Additional timestamp credits are available through optional top-ups.

Core signing and verification do not require the timestamp service.

---

## ⚙️ CLI & MCP Automation

<a href="https://majikah.solutions/articles/majik-signature-cli-mcp-automation">
<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-9" src="https://github.com/user-attachments/assets/ced3d189-e65b-4444-ba0a-1731585608e8" />
</a>

Majik Signature can be integrated into developer and automation workflows.

### CLI

The experimental CLI supports automation for:

* Signing
* Verification
* Sealing
* Timestamping
* Account operations
* Key management
* Contact management
* MJKS Map workflows

### MCP

The experimental MCP server enables AI assistants and LLM-based workflows to interact with signing and verification operations.

This makes Majik Signature suitable for:

* Scripts
* CI/CD pipelines
* Release automation
* Local agents
* AI-assisted workflows
* Unattended signing workflows

**Private keys remain on the user's device.**

[Read the Full CLI and MCP Guide Here](https://majikah.solutions/products/majik-signature/docs/mjksig-cli-mcp)

---

## 🆔 Majik Universal ID

Create a cryptographic identity that can be used to:

* Establish a public verification profile
* Share identity information
* Publish verifiable information
* Embed a live verification widget on your own website

---

## 🔑 Passwordless & Adaptive Key Security

Majik Signature supports multiple local key-unlock models.

Depending on the platform and configuration, users can:

* Unlock using Windows Hello
* Use face, fingerprint, or PIN authentication
* Unlock once for a session
* Require authentication for each signing operation

The goal is to keep sensitive private-key material protected while giving users control over the security/convenience balance.

---

## 📜 Privacy-Friendly Activity History

Majik Signature maintains a local activity history for signing, verification, and sealing operations.

The history is designed around cryptographic digests rather than relying on file names as the primary record.

Retention can be configured by the user.

---

# 💰 Free to Download. Free to Use.

<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-10" src="https://github.com/user-attachments/assets/c001edb3-c609-48db-b0c3-6f251d258823" />


Majik Signature's core signing and verification features are **completely free**.

There is no subscription or paywall for core functionality.

### Free features include

* Signing
* Verification
* Sealing
* Hot Folders
* CLI
* MCP
* Majik SLink
* MJKS Maps
* Multi-signature workflows
* Detached signatures
* Signature expiration
* Local activity history
* And more

Optional paid services include:

### Majik Notary

₱50.00 per file
VAT exclusive; processing fees may apply.

Anchors the SHA3-512 seal hash of a sealed file on Solana Mainnet.

### Trusted Timestamps

<a href="https://majikah.solutions/articles/trusted-timestamps-explained">
<img width="3840" height="2160" alt="MajikSignature_Store_Promo_v2Artboard-8" src="https://github.com/user-attachments/assets/e0c9ac67-11dd-46d7-85c6-8fdb4680f548" />
</a>

5 free timestamps every 24 hours per account, with additional timestamp credits available when needed.

---

# 🧩 Full Feature Overview

## Security & Keys

* Hybrid Ed25519 + ML-DSA-87 cryptography
* NIST FIPS-204 ML-DSA-87
* Self-contained Signature Envelope
* SHA-256 file integrity verification
* Optional Trusted Timestamps
* Windows Hello support
* Unlock Once or Per Operation
* BIP-39 support
* 12- and 24-word recovery phrases
* All official BIP-39 languages
* Up to 100 Majik Keys
* SLink URL normalization, DNS, and content verification

## Signing & Verification

* Embedded signatures
* Detached `.mjksig` signatures
* Detached `.zip` bundles
* `.mjksmap` Signature Maps
* Batch signing
* Batch verification
* Multi-signature workflows
* Signing-order verification
* Signer status verification
* Signing timelines
* Revision-chain verification
* Signature expiration
* Metadata embedding
* Universal fallback
* Non-destructive re-signing
* Offline verification
* Instant identity switching
* Passphrase management

## Notary & Anchoring

* Majik Notary
* Solana Mainnet anchoring
* SHA3-512 seal hashes
* Solana Memo anchoring
* No file-content anchoring
* No user-managed crypto wallet required
* Majikah-paid gas fees
* Pay-per-file notarization

## Automation & Productivity

* Unlimited Hot Folders
* Automatic Passed/Failed sorting
* Custom Hot Folder icons
* Auto-save
* Configurable activity history retention
* CLI automation
* MCP automation

## Collaboration

* Multi-party signing
* Open or restricted signing modes
* Signing allowlists
* Expected signing order
* File sealing
* Signing progress tracking
* MJKS Map workflows
* Up to 5,000 contacts
* Multiple shareable claims per URL

## Developer & AI Automation

> Experimental

* CLI
* MCP server
* Signing automation
* Verification automation
* Timestamp automation
* Sealing automation
* CI/CD workflows
* AI assistant integration
* LLM agent workflows
* Hot Folder automation

## Privacy

* Local signing
* Local core verification
* No file-content uploads
* Private keys never leave the device
* Offline-first architecture
* Internet required only for optional services
* Blockchain anchoring stores only a SHA3-512 seal hash

---

# 🛠️ Built for Windows & Linux

Majik Signature Desktop is built with **Tauri** for a lightweight native desktop experience.

The application combines a modern desktop interface with native system capabilities for security, storage, credentials, inter-process communication, and automation.

Starting with **v0.17.0**, Majik Signature supports both:

**Windows 🪟**
and
**Linux 🐧**

Platform-specific native integrations include:

* Secure credential storage
* Local IPC
* Hot Folder integration
* Native SQLite storage
* Application system integration

---

# 🔄 Release History

Majik Signature has evolved through a series of releases focused on signing, verification, identity, automation, and trust.

| Version     | Highlights                                                                             |
| ----------- | -------------------------------------------------------------------------------------- |
| **v0.17.0** | Linux support, encrypted native storage, secure credentials, easier Majik Key recovery |
| **v0.16.0** | Automatic updates and smarter Hot Folders                                              |
| **v0.15.0** | CLI/MCP expansion, batch MJKS Map workflows, key & contact management                  |
| **v0.14.0** | MJKS Maps, multi-party verification, signing order & revision chains                   |
| **v0.13.0** | Security improvements, safer notarization, signature expiration                        |
| **v0.12.0** | Majik SLink, Majik Key accounts & templates                                            |
| **v0.11.0** | Solana Mainnet Notary & multi-signature verification                                   |
| **v0.10.0** | Signature expiration & streamlined onboarding                                          |
| **v0.9.3**  | MUID key rotation                                                                      |
| **v0.9.2**  | Majik SLink                                                                            |
| **v0.9.1**  | Hot Folders, History & Auto-Save                                                       |
| **v0.9.0**  | Detached signatures, CLI & MCP                                                         |

See the complete release history on the **[Releases page](https://github.com/Majikah/majik-signature-desktop-releases/releases)**.

---

# 📜 `.mjksig` Specification

Majik Signature uses the portable `.mjksig` Signature Envelope format for detached signatures.

The media type has been officially registered with IANA:

**`application/vnd.majikah.mjksig`**

[View the official IANA registration](https://www.iana.org/assignments/media-types/application/vnd.majikah.mjksig)

[Read the MJKSIG specification](https://github.com/Majikah/majik-signature/blob/main/MJKSIG_SPEC.md)

The format is designed so that signatures can remain portable and independently verifiable rather than being locked to the desktop application.

---

# 🔍 Verification Philosophy

A core principle of Majik Signature is that **verification should not require blind trust in the software vendor**.

A recipient should be able to verify a signed file using the file, the associated signature, and the relevant public cryptographic information.

Core verification can work offline.

The purpose is not simply to say:

> "Majikah says this file is authentic."

The goal is to make the underlying cryptographic evidence independently verifiable.

---

# 🤝 Who Is Majik Signature For?

Majik Signature is designed for anyone who needs to establish trust in digital records.

### Individuals

Protect important personal records, documents, creative work, and digital assets.

### Freelancers & Professionals

Sign contracts, proposals, deliverables, credentials, and client documents.

### Creators

Protect authorship and attribution for music, photographs, video, artwork, writing, and other creative work.

### Businesses

Manage approvals, signatures, document histories, and multi-party workflows.

### Developers

Sign source code, binaries, builds, releases, and other software artifacts.

### Teams

Use signing orders, allowlists, Hot Folders, and multi-party signatures for collaborative workflows.

### AI & Automation

Integrate cryptographic signing and verification into scripts, CI/CD systems, local agents, and AI-assisted workflows.

---

# 🚀 The Goal

Digital files are easy to copy.

What is harder is proving:

**Who created it.
What exactly was signed.
Whether it changed.
When it was signed.
Who else signed it.
What happened before it.
And whether the record can still be trusted.**

Majik Signature is built to make those questions cryptographically verifiable.

From an individual file to a multi-party signing chain, a public URL, a software release, or a blockchain-anchored record, the objective remains the same:

**Make digital records verifiable from the record itself — while keeping your files and private keys under your control.**

---

# ✨ Majik Signature

**Free to download. Free to use.
Local by design.
Cryptographically verifiable.
Built for the post-quantum era.**

**Sign. Anchor. Verify. Trust the Chain. Just like Magic.**

---

### Majik Signature is a product of [Majikah Solutions](https://majikah.solutions)

**Just like magic.**
