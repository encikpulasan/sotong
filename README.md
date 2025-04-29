# Sotong - Malaysian Payslip Generator

[![Built with Deno Fresh](https://img.shields.io/badge/Built%20with-Deno%20Fresh-3178C6?style=flat-square&logo=deno&logoColor=white)](https://fresh.deno.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A modern, enterprise-grade payslip generation application designed for Malaysian
businesses. Built with Deno Fresh for high performance and reliability.

<div align="center">
  <img src="./static/logo.svg" alt="Sotong Payslip Generator" width="150">
</div>

## Overview

Sotong Payslip Generator simplifies the complex process of creating legally
compliant payslips in Malaysia. With precise calculations for EPF, SOCSO, EIS,
and PCB deductions, Sotong ensures your payroll process is accurate and
efficient.

### Key Features

✅ **Accurate Calculations**: Based on the latest Malaysian tax regulations and
contribution rates\
✅ **Professional PDF Payslips**: Generate beautiful, detailed payslips suitable
for professional use\
✅ **Secure Data Storage**: All user and payslip data stored securely with Deno
KV\
✅ **User Authentication**: Complete API user management with secure
registration and login\
✅ **API Access**: Full REST API with detailed documentation and developer
dashboard\
✅ **Multi-step Form**: Intuitive step-by-step process with validation\
✅ **Responsive Design**: Works flawlessly on desktop and mobile\
✅ **Payslip History**: Employees can access their historical payslips via email

## Technical Architecture

Sotong is built using modern web technologies for optimal performance and
developer experience:

- **Framework**: [Deno Fresh](https://fresh.deno.dev/) - Next-gen web framework
  with zero configuration
- **Runtime**: [Deno](https://deno.land/) - Secure JavaScript & TypeScript
  runtime
- **Database**: [Deno KV](https://deno.com/kv) - Key-value database with
  persistent storage
- **Frontend Architecture**: Islands Architecture for client-side interactivity
- **Styling**: Tailwind CSS for modern, responsive design
- **Authentication**: Custom JWT-based authentication with secure cookie
  sessions
- **API Security**: API key authentication with usage tracking

## Calculation Details

Sotong performs calculations in accordance with Malaysian employment standards:

- **EPF**:
  - Employee: Configurable rates (0%, 5.5%, 9%, 11%)
  - Employer: 13% contribution rate

- **SOCSO**:
  - Employee: ~0.39% contribution with RM4,000 salary cap
  - Employer: ~1.3% contribution with RM4,000 salary cap

- **EIS**:
  - Both employee and employer: 0.2% contribution with RM4,000 salary cap

- **PCB (Tax)**:
  - Calculated based on progressive tax rates
  - Factors in marital status and number of dependents

## API Documentation

Sotong provides a comprehensive API for easy integration with your existing
systems. Full documentation is available at `/api/docs` when the application is
running.

Current API version: **v1**

### API Endpoints

- **POST /api/v1/calculate** - Calculate payslip deductions
- **POST /api/v1/preview-payslip** - Generate a preview of the payslip
- **GET /api/v1/download-payslip** - Download a generated payslip
- **POST /api/v1/save-user** - Save user information
- **GET /api/v1/save-user** - Retrieve user information
- **POST /api/v1/save-payslip** - Save payslip data
- **GET /api/v1/save-payslip** - Retrieve payslip data

## Security & Data Privacy

Sotong takes security seriously:

- All data is stored securely in Deno KV
- API access is protected with API keys
- User passwords are hashed and never stored in plain text
- Authentication uses secure HTTP-only cookies
- No sensitive data is exposed in client-side code
- Regular security updates and maintenance

## Changelog

### Version 1.1.0 (April 2025)

- Added versioned API endpoints under `/api/v1/`
- Implemented API key management system with usage tracking
- Added dashboard for API users
- Updated storage system to use persistent Deno KV storage
- Fixed refresh issue in dashboard after form submission
- Improved UI across all pages

### Version 1.0.0 (March 2025)

- Initial release
- Calculation engine for Malaysian payslip standards
- Multi-step form interface
- PDF generation
- Basic data storage
- Responsive design

## Roadmap

- Employee self-service portal
- Bulk payslip generation
- Excel import/export functionality
- Multi-language support (BM, Mandarin, Tamil)
- Integration with accounting systems
- Email delivery of payslips
- Advanced tax calculations

## License

MIT © Sofehaus Sdn Bhd

---

<div align="center">
  <p>Made with ❤️ in Malaysia</p>
</div>
