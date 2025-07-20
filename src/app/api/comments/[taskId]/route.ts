import { NextRequest, NextResponse } from "next/server";
import { Comment, Task } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params

  try {
    await dbConnect()
    const comments = await Comment.find({ task: taskId }).populate("author", "name")

    return NextResponse.json(comments)
  } catch (err) {
    return NextResponse.json(
      { message: "COMMENTS API ERROR: " + err },
      { status: 500 }
    )
  }
}


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  const { content, author } = await request.json()

  try {
    await dbConnect()

    // CREATE comment and get the created document
    const newComment = await Comment.create({
      content: content,
      task: taskId,
      author: author
    })

    // ADD comment ID to task.comments array
    await Task.findByIdAndUpdate(taskId, {
      $push: { comments: newComment._id }
    })

    return NextResponse.json(
      { message: "Comment added successfully!" },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: "COMMENTS API ERROR: " + err },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest
) {
  const { commentId } = await request.json()

  try {
    await dbConnect()
    await Comment.deleteOne({
      _id: commentId
    })

    return NextResponse.json(
      { message: "Comment deleted successfully!" },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: "COMMENTS API ERROR: " + err },
      { status: 500 }
    )
  }
}