import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // 检查用户认证状态
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 检查管理员权限 - 支持多种验证方式
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.email === 'admin@admin.com' ||
                   user.email === 'admin@example.com'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')

    // 使用Supabase查询数据
    let trackingQuery = supabase
      .from('species_tracking')
      .select('*')
      .order('created_at', { ascending: false })

    if (startDate) {
      trackingQuery = trackingQuery.gte('created_at', startDate)
    }

    const [trackingResult, usersResult] = await Promise.all([
      trackingQuery,
      supabase.from('profiles').select('*', { count: 'exact', head: true })
    ])

    if (trackingResult.error) {
      console.error('Tracking query error:', trackingResult.error)
      throw trackingResult.error
    }

    if (usersResult.error) {
      console.error('Users query error:', usersResult.error)
      throw usersResult.error
    }

    return NextResponse.json({
      tracking: trackingResult.data || [],
      userCount: usersResult.count || 0
    })
  } catch (error) {
    console.error('Admin analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}