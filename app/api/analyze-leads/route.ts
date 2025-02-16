import { NextResponse } from "next/server";

interface LeadSourceData {
  source: string;
  newLeads: number;
  contacted: number;
  storeVisits: number;
  apptsOpened: number;
  apptsShown: number;
  noShows: number;
  sales: number;
}

interface Totals {
  newLeads: number;
  contacted: number;
  storeVisits: number;
  apptsOpened: number;
  apptsShown: number;
  noShows: number;
  sales: number;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new NextResponse("OpenAI API key not configured", { status: 500 });
  }

  try {
    const { data } = await req.json() as { data: LeadSourceData[] };

    // Calculate totals
    const totals = data.reduce(
      (acc: Totals, row: LeadSourceData) => ({
        newLeads: acc.newLeads + row.newLeads,
        contacted: acc.contacted + row.contacted,
        storeVisits: acc.storeVisits + row.storeVisits,
        apptsOpened: acc.apptsOpened + row.apptsOpened,
        apptsShown: acc.apptsShown + row.apptsShown,
        noShows: acc.noShows + row.noShows,
        sales: acc.sales + row.sales,
      }),
      {
        newLeads: 0,
        contacted: 0,
        storeVisits: 0,
        apptsOpened: 0,
        apptsShown: 0,
        noShows: 0,
        sales: 0,
      }
    );

    // Find source of sales
    const salesSources = data
      .filter((source: LeadSourceData) => source.sales > 0)
      .map((source: LeadSourceData) => source.source)
      .join(", ");

    // Group leads by source
    const leadsBySource = data.reduce((acc: Record<string, number>, row: LeadSourceData) => {
      acc[row.source] = row.newLeads;
      return acc;
    }, {});

    // Create the source breakdown text
    const sourceBreakdown = Object.entries(leadsBySource)
      .filter(([, count]) => count > 0)
      .map(([source, count]) => `${count} from ${source}`)
      .join(", ");

    const summary = `
<h2>Overall Performance Summary</h2>
<p>Total New Leads: ${totals.newLeads}</p>
<p>Total Contacted: ${totals.contacted}</p>
<p>Total Store Visits: ${totals.storeVisits}</p>
<p>Total Appointments Opened: ${totals.apptsOpened}</p>
<p>Total Appointments Shown: ${totals.apptsShown}</p>
<p>Total No-Shows: ${totals.noShows}</p>
<p>Total Sales: ${totals.sales}</p>

<p>There were ${totals.newLeads} leads yesterday (${sourceBreakdown}). ${totals.contacted} leads were marked as contacted, there ${totals.apptsOpened === 1 ? 'was 1 appointment' : `were ${totals.apptsOpened} appointments`} created and ${totals.noShows === 1 ? '1 appointment' : `${totals.noShows} appointments`} that didn't show. We had ${totals.sales === 1 ? 'one sale' : `${totals.sales} sales`}${salesSources ? ` and the source of the sale was ${salesSources}` : ''}.</p>`;

    return NextResponse.json({ insights: summary });
  } catch (error) {
    console.error("[ANALYZE_LEADS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 