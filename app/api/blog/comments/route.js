import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Retrieve all comments for a specific blog post (reverse-chronological)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('blogSlug');
    const userEmail = searchParams.get('userEmail')?.trim().toLowerCase();

    if (!blogSlug) {
      return NextResponse.json({ error: 'blogSlug parameter is required.' }, { status: 400 });
    }

    // 1. Fetch comments sorted reverse-chronologically (newest first)
    const { data: comments, error: commentsErr } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('blog_slug', blogSlug)
      .order('created_at', { ascending: false });

    if (commentsErr) {
      console.error('Error fetching comments:', commentsErr);
      return NextResponse.json({ error: 'Failed to fetch comments.' }, { status: 500 });
    }

    if (!comments || comments.length === 0) {
      return NextResponse.json({ comments: [] }, { status: 200 });
    }

    // 2. Fetch reactions for these comments to calculate likes/dislikes counts
    const commentIds = comments.map((c) => c.id);
    const { data: reactions, error: reactionsErr } = await supabase
      .from('blog_comment_reactions')
      .select('comment_id, reaction_type, user_email')
      .in('comment_id', commentIds);

    if (reactionsErr) {
      console.error('Error fetching reactions:', reactionsErr);
      // Fallback: Return comments with zero reactions rather than failing completely
    }

    const commentReactions = reactions || [];

    // 3. Map reactions to each comment
    const commentsWithReactions = comments.map((comment) => {
      const reactionsForComment = commentReactions.filter((r) => r.comment_id === comment.id);
      const likes = reactionsForComment.filter((r) => r.reaction_type === 'like').length;
      const dislikes = reactionsForComment.filter((r) => r.reaction_type === 'dislike').length;
      const userReaction = reactionsForComment.find((r) => r.user_email === userEmail)?.reaction_type || null;

      return {
        ...comment,
        likes,
        dislikes,
        userReaction,
      };
    });

    return NextResponse.json({ comments: commentsWithReactions }, { status: 200 });
  } catch (error) {
    console.error('Error in comments GET route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Add a new comment to a blog post
export async function POST(request) {
  try {
    const body = await request.json();
    const { blogSlug, authorName, authorEmail, authorRole, content } = body;

    // Validate request body
    if (!blogSlug || !authorName || !authorEmail || !authorRole || !content) {
      return NextResponse.json(
        { error: 'blogSlug, authorName, authorEmail, authorRole, and content are all required.' },
        { status: 400 }
      );
    }

    const cleanRole = authorRole.trim().toLowerCase();
    if (cleanRole !== 'customer' && cleanRole !== 'pro') {
      return NextResponse.json({ error: 'Invalid author role. Must be either customer or pro.' }, { status: 400 });
    }

    const cleanName = authorName.trim();
    const cleanEmail = authorEmail.trim().toLowerCase();
    const cleanContent = content.trim();

    if (cleanContent.length === 0) {
      return NextResponse.json({ error: 'Comment content cannot be empty.' }, { status: 400 });
    }

    // Insert comment into the database
    const { data: newComment, error: insertError } = await supabase
      .from('blog_comments')
      .insert([
        {
          blog_slug: blogSlug,
          author_name: cleanName,
          author_email: cleanEmail,
          author_role: cleanRole,
          content: cleanContent,
        },
      ])
      .select('*')
      .single();

    if (insertError) {
      console.error('Error saving comment:', insertError);
      return NextResponse.json({ error: 'Failed to save comment to database.' }, { status: 500 });
    }

    // Return the new comment with initialized 0 likes/dislikes
    return NextResponse.json(
      {
        success: true,
        comment: {
          ...newComment,
          likes: 0,
          dislikes: 0,
          userReaction: null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in comments POST route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
