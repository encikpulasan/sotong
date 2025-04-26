# Pay Slip Generator

A modern, user-friendly pay slip generator built with Deno Fresh framework. This
application allows users to create professional pay slips with detailed
calculations for salary, deductions, and employer contributions.

## Features

- **Simple Form Interface**: Easy-to-use form for inputting employee and company
  information
- **Automatic Calculations**: Automatically calculates deductions (EPF, SOCSO,
  EIS, PCB) based on salary input
- **Multi-Step Process**: Three-step process (form input → user identity → pay
  slip preview)
- **Responsive Design**: Works well on both desktop and mobile devices
- **Print-Ready Pay Slips**: Generated pay slips can be printed or saved as PDFs
  using browser functionality
- **User Data Storage**: Stores user information in Deno KV database for future
  reference

## Technical Details

- Built with [Deno Fresh](https://fresh.deno.dev/) - a full stack web framework
  for Deno
- Uses Islands architecture for client-side interactivity
- Tailwind CSS for styling
- Deno KV for data persistence
- Clean code principles (SOLID, DRY)

## Calculation Details

The application uses the following rates for automatic calculations (based on
Malaysian employment standards):

- **EPF**: 11% for employee contribution, 12% for employer contribution
- **SOCSO**: ~0.39% for employee, ~1.31% for employer (approximation)
- **EIS**: ~0.15% for both employee and employer (approximation)
- **PCB (Tax)**: Simplified calculation for demonstration purposes

## Getting Started

1. Clone the repository
2. Install Deno: https://deno.land/manual/getting_started/installation
3. Run the application:

```bash
deno task start
```

4. Open http://localhost:8000 in your browser

## Development

To run the project in development mode:

```bash
deno task dev
```

## License

MIT
