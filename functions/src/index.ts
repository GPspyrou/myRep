import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

// Interface for Pub/Sub-triggered event data
export interface PubSubEvent {
  data: string;
  attributes?: { [key: string]: string };
}

// Replace with your own project ID
const PROJECT_ID = 'propertyhall-31280';
const PROJECT_NAME = `projects/${PROJECT_ID}`;
// Google Cloud Billing client
const billing = google.cloudbilling('v1').projects;

/**
 * Cloud Function to disable billing when cost exceeds budget.
 */
export const stopBilling = async (pubsubEvent: PubSubEvent): Promise<string> => {
  try {
    console.log('Pub/Sub event data (base64):', pubsubEvent.data);
    const raw = Buffer.from(pubsubEvent.data, 'base64').toString();
    console.log('Parsed JSON:', raw);
    const payload = JSON.parse(raw) as {
      costAmount: number | string;
      budgetAmount: number | string;
    };

    // Coerce to numbers
    const cost = typeof payload.costAmount === 'string'
      ? parseFloat(payload.costAmount)
      : payload.costAmount;
    const budget = typeof payload.budgetAmount === 'string'
      ? parseFloat(payload.budgetAmount)
      : payload.budgetAmount;

    console.log(`Cost: ${cost}, Budget: ${budget}`);
    if (cost <= budget) {
      console.log('No action necessary.');
      return `No action necessary. (Current cost: ${cost})`;
    }

    // Authenticate for Google APIs
    setAuthCredential();

    // Check if billing is currently enabled
    const enabled = await isBillingEnabled(PROJECT_NAME);
    if (!enabled) {
      console.log('Billing already disabled.');
      return 'Billing already disabled';
    }

    // Disable billing
    console.log('Disabling billing now...');
    const result = await disableBillingForProject(PROJECT_NAME);
    console.log('Billing disabled:', result);
    return `Billing disabled: ${JSON.stringify(result)}`;
  } catch (error) {
    console.error('Error in kill-switch function:', error);
    throw error;
  }
};

/**
 * Set up GoogleAuth globally for all googleapis calls.
 */
function setAuthCredential(): void {
  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/cloud-billing',
      'https://www.googleapis.com/auth/cloud-platform',
    ],
  });
  google.options({ auth });
}

/**
 * Check if billing is enabled for the given project.
 * @param name Fully-qualified project name (e.g., "projects/your-id").
 */
async function isBillingEnabled(name: string): Promise<boolean> {
  try {
    const res = await billing.getBillingInfo({ name });
    return Boolean(res.data.billingEnabled);
  } catch (err) {
    console.warn('Unable to determine billing status; assuming enabled.', err);
    return true;
  }
}

/**
 * Disable billing by clearing the billing account association.
 * @param name Fully-qualified project name.
 */
async function disableBillingForProject(name: string): Promise<any> {
  const res = await billing.updateBillingInfo({
    name,
    requestBody: { billingAccountName: '' },
  });
  return res.data;
}
