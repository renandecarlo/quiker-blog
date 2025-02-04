"use client"

import { useState } from "react"
import { Box, Typography, IconButton, Menu, MenuItem, Paper, Card, CardContent, CardActions } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Comment } from "@/types/comment"
import { CommentForm } from "./comment-form"
import { useAuth } from "@/contexts/auth.context"
import parse from "html-react-parser"
import { formatRelativeDate } from "@/utils/date"

interface CommentItemProps {
    comment: Comment
    postUserId: number
    onUpdate: (id: number, content: string) => Promise<void>
    onDelete: (id: number) => Promise<void>
}

export function CommentItem({ comment, postUserId, onUpdate, onDelete }: CommentItemProps) {
    const { user } = useAuth()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isCommentAuthor = user?.id === comment.user.id
    const isPostAuthor = user?.id === postUserId
    const canModify = !comment.deletedAt && (isCommentAuthor || isPostAuthor)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleEdit = () => {
        setIsEditing(true)
        handleClose()
    }

    const handleDelete = async () => {
        if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
            await onDelete(comment.id)
        }
        handleClose()
    }

    const handleUpdate = async (data: { content: string }) => {
        setIsLoading(true)
        try {
            await onUpdate(comment.id, data.content)
            setIsEditing(false)
        } finally {
            setIsLoading(false)
        }
    }

    if (isEditing) {
        return (
            <Paper sx={{ p: 2, mb: 2, mt: 2 }}>
                <CommentForm
                    onSubmit={handleUpdate}
                    initialContent={comment.content}
                    submitLabel="Atualizar"
                    isLoading={isLoading}
                />
            </Paper>
        )
    }

    return (
        <Card key={comment.id} sx={{ mt: 2 }} variant="outlined">
            <CardActions sx={{ justifyContent: "flex-end", float: "right" }}>
                {canModify && (
                    <div>
                        <IconButton onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            {isCommentAuthor && <MenuItem onClick={handleEdit}>Editar</MenuItem>}
                            <MenuItem onClick={handleDelete}>Excluir</MenuItem>
                        </Menu>
                    </div>
                )}
            </CardActions>
            <CardContent>
                <Box>
                    <Typography variant="subtitle2" display="inline" mr="5px">
                        {comment.user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="inline">
                        {formatRelativeDate(comment.createdAt)}
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }} mt={1}>
                    {comment.deletedAt ? (
                        <Typography color="text.secondary" fontStyle="italic" component="span">
                            Este comentário foi deletado.
                        </Typography>
                    ) : (
                        parse(comment.content)
                    )}
                </Typography>
            </CardContent>
        </Card>
    )
}
