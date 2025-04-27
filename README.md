# Pay Slip Generator

A modern, user-friendly pay slip generator built with Deno Fresh framework. This
application allows users to create professional pay slips with detailed
calculations for salary, deductions, and employer contributions.

## Features

- **Simple Form Interface**: Easy-to-use form for inputting employee and company
  information
- **Automatic Calculations**: Automatically calculates deductions (EPF, SOCSO,
  EIS, PCB) based on salary input and Malaysian standards
- **Multi-Step Process**: Step-by-step form process with validation
- **Responsive Design**: Works well on both desktop and mobile devices
- **Print-Ready Pay Slips**: Generated pay slips can be downloaded as PDFs
- **User Data Storage**: Stores user information and payslips in Deno KV
  database for future reference
- **Payslip History**: View and download past payslips using your email address

## Technical Details

- Built with [Deno Fresh](https://fresh.deno.dev/) - a full stack web framework
  for Deno
- Uses Islands architecture for client-side interactivity
- Tailwind CSS for styling
- Deno KV for persistent data storage
- Clean code principles (SOLID, DRY)
- API endpoints for payslip generation and retrieval

## Calculation Details

The application uses the following rates for automatic calculations (based on
Malaysian employment standards):

- **EPF**: Configurable rates (0%, 5.5%, 9%, 11%) for employee contribution, 13%
  for employer contribution
- **SOCSO**: ~0.39% for employee, ~1.3% for employer with salary cap of RM4,000
- **EIS**: 0.2% for both employee and employer with salary cap of RM4,000
- **PCB (Tax)**: Simplified calculation for demonstration purposes
  (approximately 3%)

## Data Storage

The application uses Deno KV for persistent data storage:

- **User Information**: Stores user contact details (name, email, phone)
- **Payslip Data**: Stores generated payslips associated with user emails
- **Retrieval**: Allows users to view and download past payslips

## Getting Started

1. Clone the repository
2. Install Deno: https://deno.land/manual/getting_started/installation
3. Run the application:

```bash
deno task start
```

4. Open http://localhost:8000 in your browser

## Development

To run the project in development mode with live reloading:

```bash
deno task start
```

## Deno KV Setup

This application uses Deno KV for data storage, which requires the
`--unstable-kv` flag. This is already configured in the `deno.json` file.

## License

MIT
