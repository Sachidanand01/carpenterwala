import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: Add, toggle, or switch comment reaction (like/dislike)
export async function POST(request) {
  try {
    const body = await request.json();
    const { commentId, userEmail, userRole, reactionType } = body;

    // Validate inputs
    if (!commentId || !userEmail || !userRole || !reactionType) {
      return NextResponse.json(
        { error: 'commentId, userEmail, userRole, and reactionType are all required.' },
        { status: 400 }
      );
    }

    const cleanRole = userRole.trim().toLowerCase();
    if (cleanRole !== 'customer' && cleanRole !== 'pro') {
      return NextResponse.json({ error: 'Invalid user role. Must be customer or pro.' }, { status: 400 });
    }

    const cleanReaction = reactionType.trim().toLowerCase();
    if (cleanReaction !== 'like' && cleanReaction !== 'dislike') {
      return NextResponse.json({ error: 'Invalid reaction type. Must be like or dislike.' }, { status: 400 });
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const commentIdInt = parseInt(commentId, 10);

    if (isNaN(commentIdInt)) {
      return NextResponse.json({ error: 'Invalid comment ID.' }, { status: 400 });
    }

    // 1. Check if comment exists
    const { data: comment, error: commentCheckErr } = await supabase
      .from('blog_comments')
      .select('id')
      .eq('id', commentIdInt)
      .maybeSingle();

    if (commentCheckErr || !comment) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    // 2. Query for existing reaction by this user on this comment
    const { data: existingReaction, error: reactionCheckErr } = await supabase
      .from('blog_comment_reactions')
      .select('id, reaction_type')
      .eq('comment_id', commentIdInt)
      .eq('user_email', cleanEmail)
      .maybeSingle();

    if (reactionCheckErr) {
      console.error('Error checking reaction:', reactionCheckErr);
      return NextResponse.json({ error: 'Database check failed.' }, { status: 500 });
    }

    if (existingReaction) {
      if (existingReaction.reaction_type === cleanReaction) {
        // Toggled off: If clicked the same reaction, remove it
        const { error: deleteErr } = await supabase
          .from('blog_comment_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (deleteErr) {
          console.error('Error deleting reaction:', deleteErr);
          return NextResponse.json({ error: 'Failed to remove reaction.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, action: 'removed' }, { status: 200 });
      } else {
        // Toggled other: If clicked the opposite reaction, switch it
        const { error: updateErr } = await supabase
          .from('blog_comment_reactions')
          .update({ reaction_type: cleanReaction })
          .eq('id', existingReaction.id);

        if (updateErr) {
          console.error('Error updating reaction:', updateErr);
          return NextResponse.json({ error: 'Failed to switch reaction.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, action: 'switched' }, { status: 200 });
      }
    } else {
      // Create reaction: If no existing reaction, insert one
      const { error: insertErr } = await supabase
        .from('blog_comment_reactions')
        .insert([
          {
            comment_id: commentIdInt,
            user_email: cleanEmail,
            user_role: cleanRole,
            reaction_type: cleanReaction,
          },
        ]);

      if (insertErr) {
        console.error('Error inserting reaction:', insertErr);
        return NextResponse.json({ error: 'Failed to save reaction.' }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: 'added' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error in reactions POST route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
