# Security Policy

Thank you for helping keep **Majik Signature** and the broader Majikah ecosystem secure.

Majik Signature is designed around local cryptographic operations, private-key ownership, offline verification, and minimizing the amount of sensitive data that leaves the user's device. Security issues are therefore taken seriously and investigated carefully.

## Reporting Security Vulnerabilities

**Do not create a public GitHub issue for a suspected security vulnerability.**

Public disclosure of a vulnerability before it has been investigated and addressed may expose users to unnecessary risk.

### Private Vulnerability Reporting

For security vulnerabilities, please use **GitHub's Private Vulnerability Reporting** feature for this repository whenever possible.

This is the preferred channel for reporting issues involving:

* Cryptographic implementation or verification
* Signature forgery or bypasses
* Private-key exposure or extraction
* Authentication or authorization weaknesses
* Account or credential compromise
* Encryption or key-storage weaknesses
* Secure storage or database vulnerabilities
* Local privilege escalation
* IPC security issues
* Code execution vulnerabilities
* Memory or data disclosure
* Malicious file processing
* Tampering with signature or verification results
* Security issues involving `.mjksig`, `.mjksmap`, or related formats
* Vulnerabilities affecting the CLI or MCP server
* Supply-chain or dependency vulnerabilities
* Any issue that could compromise the confidentiality, integrity, or authenticity of user data

### Email

Security reports may also be submitted privately to:

**[business@majikah.solutions](mailto:business@majikah.solutions)**

When reporting by email, please include **SECURITY** in the subject line.

Please do not include private keys, passwords, recovery phrases, or other sensitive personal information in your report.

---

# Application, UX/UI & General Bugs

For issues that are **not security vulnerabilities**, please use the repository's public GitHub Issues.

Create a new issue and provide as much detail as possible.

This includes:

* Application crashes
* UI or UX problems
* Incorrect visual behavior
* Broken workflows
* Signing or verification errors that are not security vulnerabilities
* Hot Folder problems
* CLI/MCP functionality problems
* Installation problems
* Platform-specific bugs
* Performance issues
* Unexpected application behavior
* Feature-specific errors

Please **do not publicly report a bug as a security issue unless it actually has security implications**. When in doubt, use Private Vulnerability Reporting or email us privately.

---

# 🧾 Bug Report Template

When opening a public issue, please copy and complete the following template.

````markdown
## Bug Summary

<!-- Give us a short description of the problem. -->

### What happened?

<!-- Describe exactly what went wrong. -->

### What did you expect to happen?

<!-- Describe the expected behavior. -->

### Steps to reproduce

1. 
2. 
3. 
4. 

### Environment

- Majik Signature version:
- Operating system:
- OS version:
- Installation format:
- Architecture: <!-- e.g. x64 / arm64 -->
- Desktop environment: <!-- Linux only, if applicable -->
- CLI/MCP version: <!-- If applicable -->

### File / Workflow Information

- Feature involved:
- File type:
- File size:
- Embedded or detached signature:
- MJKS Map involved: Yes / No
- Hot Folder involved: Yes / No
- CLI involved: Yes / No
- MCP involved: Yes / No

### Error message

<!-- Copy the exact error message if one is shown. -->

### Stack trace

<!--
If Majik Signature's error boundary catcher displays a stack trace,
PLEASE COPY THE ENTIRE STACK TRACE AND PASTE IT HERE.

A stack trace is extremely useful for locating the source of the problem.
Do not remove or edit it unless it contains private or sensitive information.
-->

```text
Paste stack trace here
```

### Logs / Additional Output

<!--
Paste any relevant console output, CLI output, or application logs here.
-->

```text
Paste logs here
```

### Screenshots / Screen Recordings

<!-- Attach screenshots or a screen recording if they help demonstrate the issue. -->

### Reproducibility

* [ ] Happens every time
* [ ] Happens sometimes
* [ ] Happened once
* [ ] Unable to reproduce consistently

### Additional Context

<!-- Anything else that may help us reproduce or diagnose the issue. -->

````

---

# 🔍 Why the Details Matter

Majik Signature is a cross-platform desktop application with several components working together, including the desktop interface, native Rust functionality, local storage, cryptographic workflows, Hot Folders, CLI/MCP integrations, and platform-specific system services.

A report that includes the **exact version, operating system, reproduction steps, logs, and especially a complete stack trace** can dramatically reduce the time required to identify the underlying problem.

### Please include the stack trace whenever available

Majik Signature includes an error boundary catcher that may provide diagnostic information when an unexpected application error occurs.

When a stack trace is shown:

> **Copy the complete stack trace and paste it into the issue report.**

Please preserve the original formatting.

A stack trace can reveal the component, function, source location, and execution path involved in the failure, making it significantly easier to locate and reproduce the problem.

Before posting publicly, remove any information that may contain secrets or sensitive personal data.

---

# What Not to Include

Never publicly post:

- Private keys
- BIP-39 recovery phrases
- Passwords or passphrases
- Authentication tokens
- API keys
- Session credentials
- Personal identification documents
- Confidential business documents
- Private signatures containing sensitive information
- Private URLs or access links
- Other secrets or credentials

When a security report requires sensitive information to reproduce the issue, use **Private Vulnerability Reporting** or email:

**business@majikah.solutions**

---

# Responsible Disclosure

For security vulnerabilities, please allow Majikah reasonable time to:

1. Receive and reproduce the report.
2. Determine the security impact.
3. Identify affected versions and components.
4. Develop and test a fix or mitigation.
5. Release the appropriate update.
6. Communicate any necessary remediation information.

Please avoid publicly disclosing exploit details, proof-of-concept code, affected secrets, or other information that could materially increase risk before the issue has been addressed.

We appreciate responsible disclosure and will make a reasonable effort to acknowledge and investigate valid security reports.

---

# Security Scope

Security research involving Majik Signature may include, but is not limited to:

- Majik Signature Desktop
- `.mjksig` Signature Envelopes
- `.mjksmap` Signature Maps
- Cryptographic signing and verification
- Majik Key account handling
- Local key protection
- Native credential storage
- Encrypted local storage
- Desktop-to-CLI communication
- Windows named-pipe IPC
- Linux Unix-domain socket IPC
- Hot Folder automation
- CLI workflows
- MCP workflows
- File parsing and processing
- Update mechanisms
- Application packaging and distribution

For vulnerabilities in other Majikah services or infrastructure, please use the private reporting channels above rather than opening a public issue.

---

# Contact

### Security vulnerabilities

**Preferred:** GitHub Private Vulnerability Reporting

**Alternative:** business@majikah.solutions  
Please use **SECURITY** in the subject line.

### Application / UX / UI / General bugs

Open a **[GitHub Issue](../../issues/new/choose)** and provide the completed bug report information above.

---

## Thank You

Security is a shared responsibility.

Every report helps us improve the security, reliability, and trustworthiness of Majik Signature for individuals, creators, businesses, developers, and automated workflows.

**Sign. Anchor. Verify. Trust the Chain. Just like Magic.**

---

*Majik Signature is a product of [Majikah Solutions](https://majikah.solutions).*
