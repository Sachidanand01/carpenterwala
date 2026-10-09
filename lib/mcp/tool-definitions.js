/**
 * Master definition of WebMCP & AI Agent tools for Carpenterwala.
 * Used by JSON-RPC Remote MCP Server (/api/mcp), REST endpoints, and OpenAPI generator.
 */

export const MCP_TOOLS = [
  {
    name: 'initiate_technician_onboarding',
    title: 'Initiate Technician Onboarding',
    description: 'Initiates a service technician (carpenter, painter, plumber, electrician) registration on Carpenterwala with 0% platform commission. Returns an encrypted, secure 1-click mobile verification link for the technician to complete OTP verification and KYC document upload on their mobile browser without exposing private credentials to 3rd-party LLM chat transcripts. Rate limited to max 3 attempts per 24 hours per phone number.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Full legal name of the technician (e.g. "Ram Singh").'
        },
        phone: {
          type: 'string',
          description: '10-digit Indian mobile number starting with 6-9 (e.g. "9876543210").'
        },
        trade: {
          type: 'string',
          description: 'Primary trade of the technician: "carpentry", "painting", "plumbing", "electrical", or custom specialization.'
        },
        location: {
          type: 'string',
          description: 'Bangalore locality, neighborhood, or PIN code (e.g. "HSR Layout", "Koramangala", "Whitefield", "Thanisandra").'
        },
        experienceYears: {
          type: 'number',
          description: 'Number of years of trade experience (optional).'
        }
      },
      required: ['name', 'phone', 'trade', 'location']
    }
  },
  {
    name: 'check_technician_application_status',
    title: 'Check Technician Application Status',
    description: 'Checks the current onboarding or verification status of a registered service professional on Carpenterwala by mobile number. Returns verification state and next required step without leaking sensitive personal credentials.',
    inputSchema: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          description: '10-digit Indian mobile number of the registered technician.'
        }
      },
      required: ['phone']
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
