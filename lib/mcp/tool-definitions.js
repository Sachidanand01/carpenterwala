/**
 * Master definition of WebMCP & AI Agent tools for Carpenterwala.
 * Used by JSON-RPC Remote MCP Server (/api/mcp), REST endpoints, and OpenAPI generator.
 */

export const MCP_TOOLS = [
  {
    name: 'start_carpenterwala_onboarding',
    title: 'Start Carpenterwala Pro Onboarding (Pan-India 0% Commission)',
    description: 'Starts the zero-commission service professional onboarding flow on Carpenterwala for carpenters, painters, plumbers, and electricians across India. Generates a short session_token and verify_url (/v/[token]), returning a Dual-Handoff response with a mobile-first clickable magic link ("Tap Here to Upload") for Android/mobile users and a desktop-friendly QR code of verify_url for desktop users.',
    inputSchema: {
      type: 'object',
      properties: {
        phone_number: {
          type: 'string',
          pattern: '^[6-9][0-9]{9}$',
          description: 'Required 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. "9876543210").'
        },
        email: {
          type: 'string',
          description: 'Optional email address of the professional (e.g. "ramesh@example.com").'
        },
        full_name: {
          type: 'string',
          description: 'Full name of the service professional (e.g. "Ramesh Kumar").'
        },
        trade: {
          type: 'string',
          enum: ['carpentry', 'painting', 'plumbing', 'electrical'],
          description: 'Primary service trade: "carpentry", "painting", "plumbing", or "electrical".'
        },
        city: {
          type: 'string',
          description: 'Indian city where the professional operates (e.g. "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai").'
        },
        locality: {
          type: 'string',
          description: 'Locality or neighborhood within the city (e.g. "HSR Layout", "Andheri West", "Koramangala").'
        },
        pincode: {
          type: 'string',
          description: '6-digit Indian PIN code of the service locality (e.g. "560102").'
        },
        experience_years: {
          type: 'integer',
          description: 'Number of years of hands-on trade experience (e.g. 8).'
        }
      },
      required: ['phone_number', 'full_name', 'trade', 'city', 'locality']
    }
  },
  {
    name: 'check_onboarding_status',
    title: 'Check Carpenterwala Pro Onboarding Status',
    description: 'Polls the current onboarding session status (PENDING_UPLOAD, VERIFIED, or EXPIRED) by session_token or 10-digit Indian phone_number, and welcomes the professional once their profile is VERIFIED.',
    inputSchema: {
      type: 'object',
      properties: {
        session_token: {
          type: 'string',
          description: 'Short onboarding session token returned by start_carpenterwala_onboarding (e.g. "7K9M2P4X"). Optional if phone_number is provided.'
        },
        phone_number: {
          type: 'string',
          description: '10-digit Indian mobile number of the service professional (e.g. "9876543210"). Optional if session_token is provided.'
        }
      },
      required: []
    }
  },
  {
    name: 'search_verified_pros',
    title: 'Search Verified Professionals in Bangalore',
    description: 'Find verified, background-checked carpenters, painters, plumbers, or electricians across Bangalore neighborhoods with ratings, verified badges, and direct zero-commission profiles.',
    inputSchema: {
      type: 'object',
      properties: {
        trade: {
          type: 'string',
          description: 'Trade category: "carpentry", "painting", "plumbing", or "electrical".'
        },
        locality: {
          type: 'string',
          description: 'Bangalore locality or neighborhood (e.g. "Indiranagar", "HSR Layout", "Koramangala", "Electronic City", "Whitefield").'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of verified pros to return (default: 5, max: 15).'
        }
      },
      required: ['trade']
    }
  },
  {
    name: 'get_service_rate_card',
    title: 'Get Standard Labor Rate Card',
    description: 'Fetch transparent, standard Bangalore labor rate cards for carpentry, painting, plumbing, and electrical services with 0% platform commission guarantees.',
    inputSchema: {
      type: 'object',
      properties: {
        serviceCategory: {
          type: 'string',
          description: 'Service category: "carpentry", "painting", "plumbing", or "electrical".'
        },
        jobType: {
          type: 'string',
          description: 'Specific repair job or keyword (e.g. "lock", "hinge", "tank", "leak", "mcb", "fan", "bhk"). Optional.'
        }
      },
      required: ['serviceCategory']
    }
  },
  {
    name: 'calculate_service_estimate',
    title: 'Calculate Service Cost & Wastage Estimate',
    description: 'Calculates instant estimates for painting square footage & paint liters, dripping tap water loss (litres & rupees), or home appliance electrical bill wastage in Bangalore.',
    inputSchema: {
      type: 'object',
      properties: {
        calculatorType: {
          type: 'string',
          enum: ['paint_cost', 'water_wastage', 'electricity_bill'],
          description: 'The calculator type to run.'
        },
        params: {
          type: 'object',
          description: 'Parameters for the calculator:\n- For paint_cost: { flatType: "1bhk"|"2bhk"|"3bhk"|"custom", carpetAreaSqFt: number, paintQuality: "economy"|"premium"|"luxury" }\n- For water_wastage: { drippingTaps: number, dripRate: "slow"|"medium"|"fast" }\n- For electricity_bill: { appliances: [{ name: "fan"|"ac"|"geyser"|"refrigerator", hoursPerDay: number, count: number }] }'
        }
      },
      required: ['calculatorType', 'params']
    }
  },
  {
    name: 'request_service_callback',
    title: 'Request Verified Service Callback / Lead',
    description: 'Submit a service lead for a Bangalore homeowner needing a carpenter, painter, plumber, or electrician. Directly dispatches the job inquiry to nearby verified professionals with 60-90 min response time.',
    inputSchema: {
      type: 'object',
      properties: {
        customerName: {
          type: 'string',
          description: 'Full name of the homeowner.'
        },
        customerPhone: {
          type: 'string',
          description: '10-digit Indian mobile number.'
        },
        trade: {
          type: 'string',
          description: 'Required service trade: "carpentry", "painting", "plumbing", "electrical".'
        },
        locality: {
          type: 'string',
          description: 'Locality or address in Bangalore (e.g. "Bellandur", "Thanisandra", "Jayanagar").'
        },
        description: {
          type: 'string',
          description: 'Brief description of the work needed (e.g. "Wardrobe door hinge loose and lock jammed").'
        }
      },
      required: ['customerName', 'customerPhone', 'trade', 'locality', 'description']
    }
  }
];
