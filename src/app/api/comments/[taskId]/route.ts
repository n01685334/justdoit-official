import { Comment } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params

    try{
        await dbConnect()
        const comments = await Comment.find({task: taskId}).populate("author", "name")
        
        return NextResponse.json(comments)
    }catch(err){
        return NextResponse.json(
            {message : "COMMENTS API ERROR: " + err},
            {status: 500}
        )
    }
}


export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params
    const { content, author} = await request.json()

    try{
        await dbConnect()
        await Comment.create({
            content: content,
            task: taskId,
            author: author
        })

        return NextResponse.json(
            {message : "Comment added successfully!"},
            {status: 200}
        )
    }catch(err){
        return NextResponse.json(
            {message : "COMMENTS API ERROR: " + err},
            {status: 500}
        )
    }
}

export async function DELETE(
    request: NextRequest
) {
    const { commentId } = await request.json()

    try{
        await dbConnect()
        await Comment.deleteOne({
            _id: commentId
        })

        return NextResponse.json(
            {message : "Comment deleted successfully!"},
            {status: 200}
        )
    }catch(err){
        return NextResponse.json(
            {message : "COMMENTS API ERROR: " + err},
            {status: 500}
        )
    }
}