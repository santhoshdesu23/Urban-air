import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDailyPlan } from '@/lib/planner/generator';
import { AirQualityData } from '@/types/air-quality';
import { UserPlannerProfile } from '@/types/planner';

const plannerProfileSchema = z.object({
  lifestyle: z.enum([
    'student',
    'working_professional',
    'work_from_home',
    'homemaker',
    'senior',
    'other',
  ]),
  transport: z.enum([
    'walking',
    'bicycle',
    'two_wheeler',
    'car',
    'public_transit',
    'carpool',
    'wfh',
  ]),
  wakeUpTime: z.string().default('06:30'),
  workHoursStart: z.string().default('09:00'),
  workHoursEnd: z.string().default('17:30'),
  typicalCommuteMinutes: z.number().min(0).max(300).default(40),
  exercisePreference: z.enum([
    'morning_outdoor',
    'morning_indoor',
    'evening_outdoor',
    'evening_indoor',
    'none',
  ]),
  householdType: z.enum(['individual', 'family']).default('family'),
  hasChildren: z.boolean().default(false),
  hasSeniors: z.boolean().default(false),
  hasSensitiveMembers: z.boolean().default(false),
  hasAirPurifier: z.boolean().default(false),
  hasKitchenExhaust: z.boolean().default(true),
  windowsFrequentlyOpened: z.boolean().default(true),
  cookingFuel: z
    .enum(['lpg_gas', 'electric_induction', 'traditional_biomass', 'other'])
    .default('lpg_gas'),
  homeSizeCategory: z.enum(['compact', 'medium', 'spacious']).default('medium'),
  budgetTier: z.enum(['no_cost', 'low_cost', 'moderate_budget']).default('low_cost'),
});

const recommendationRequestSchema = z.object({
  profile: plannerProfileSchema,
  airQuality: z.any(), // AirQualityData
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = recommendationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { profile, airQuality } = parsed.data;
    const plan = generateDailyPlan(profile as UserPlannerProfile, airQuality as AirQualityData);

    return NextResponse.json({ plan });
  } catch (err) {
    console.error('Recommendations error:', err);
    return NextResponse.json(
      { error: 'Failed to generate personalized daily plan.' },
      { status: 500 }
    );
  }
}
