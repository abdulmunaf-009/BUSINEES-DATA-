import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Booking appointment via API:", body);
    
    // Simulate clicking the "Book Appointment" button and processing
    console.log(`Simulating form submission for ${body.name}...`);
    
    // Simulate sending a confirmation email
    console.log(`Sending confirmation email to ${body.email}...`);
    console.log(`Email sent successfully to ${body.email} for appointment on ${body.date} at ${body.time}.`);
    
    return NextResponse.json({ success: true, message: "Appointment booked successfully and confirmation email sent." });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json({ success: false, message: "Failed to book appointment." }, { status: 500 });
  }
}
