import { NextResponse } from 'next/server';
import { getAllActivities, getActivitiesByDay, createActivity, updateActivity } from '@/lib/notion';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dayId = searchParams.get('dayId');

    if (dayId) {
      const activities = await getActivitiesByDay(dayId);
      return NextResponse.json(activities);
    }

    const activities = await getAllActivities();
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = await createActivity(body);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    await updateActivity(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}
